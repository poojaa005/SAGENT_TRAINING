import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import { AuthContext } from "../../context/AuthContext";
import { getAppointments, getPatientProfile, getPatientRecords } from "../../services/patientService";
import { getDoctorPatients, getDoctorProfile } from "../../services/doctorService";
import aiService from "../../services/aiService";
import "./Ai.css";

const QUICK_PROMPTS = [
  "Summarize my current health status",
  "Check if my vitals look risky",
  "What should I ask my doctor next?",
  "Show important trends from my records",
];

const formatTime = (date) =>
  new Date(date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

const formatMessage = (text) =>
  String(text || "")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/\[CRITICAL\]/g, '<span class="ai-alert-badge critical">CRITICAL</span>')
    .replace(/\[WARNING\]/g, '<span class="ai-alert-badge warning">WARNING</span>')
    .replace(/\n/g, "<br />");

const normalize = (value) => String(value || "").trim().toLowerCase();

const isDetailsIntent = (question) =>
  /(full details|all details|patient details|show details|patient record|health record|profile|appointments?|history)/i.test(
    question
  );

const pickPatientFromQuestion = (question, patients) => {
  const q = normalize(question);
  const byName = (Array.isArray(patients) ? patients : []).find((p) => q.includes(normalize(p?.name)));
  if (byName) return byName;

  const idMatch = q.match(/patient\s*(id)?\s*(\d+)/i);
  if (!idMatch) return null;
  const targetId = Number(idMatch[2]);
  return (Array.isArray(patients) ? patients : []).find((p) => Number(p?.patientId) === targetId) || null;
};

const formatDate = (value) => {
  if (!value) return "N/A";
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? String(value) : parsed.toLocaleDateString();
};

const formatPatientDetailsText = ({ profile, records, appointments }) => {
  const safeRecords = Array.isArray(records) ? records : [];
  const safeAppointments = Array.isArray(appointments) ? appointments : [];

  const recordLines =
    safeRecords.length === 0
      ? ["No health records found."]
      : safeRecords.map((r, index) => {
          const rDate = formatDate(r?.recordDate);
          return `${index + 1}. ${rDate} | Type: ${r?.recordType || "N/A"} | Diagnosis: ${r?.diagnosis || "N/A"} | Treatment: ${r?.treatment || "N/A"} | Prescription: ${r?.prescription || "N/A"} | Notes: ${r?.notes || "N/A"}`;
        });

  const appointmentLines =
    safeAppointments.length === 0
      ? ["No appointments found."]
      : safeAppointments.map((a, index) => {
          const doctorName = a?.doctor?.doctorName || a?.doctorName || "N/A";
          const status = a?.appointmentStatus || a?.status || "N/A";
          return `${index + 1}. ${a?.appointmentDate || "N/A"} ${a?.appointmentTime || ""} | Doctor: ${doctorName} | Status: ${status} | Reason: ${a?.reason || "N/A"} | Notes: ${a?.notes || "N/A"}`;
        });

  return [
    `Patient Details`,
    `Name: ${profile?.name || "N/A"}`,
    `Patient ID: ${profile?.patientId || profile?.id || "N/A"}`,
    `Age: ${profile?.age ?? "N/A"}`,
    `Gender: ${profile?.gender || "N/A"}`,
    `Contact: ${profile?.contactNo || "N/A"}`,
    `Email: ${profile?.email || "N/A"}`,
    ``,
    `Health Records (${safeRecords.length})`,
    ...recordLines,
    ``,
    `Appointments (${safeAppointments.length})`,
    ...appointmentLines,
  ].join("\n");
};

const getAppointmentDateTime = (appointment) => {
  const dateValue = appointment?.appointmentDate || appointment?.date;
  const timeValue = appointment?.appointmentTime || appointment?.time || "00:00:00";

  if (!dateValue) return null;
  const iso = `${dateValue}T${String(timeValue).slice(0, 8)}`;
  const parsed = new Date(iso);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const isUpcomingAppointment = (appointment) => {
  const rawStatus = (appointment?.status || appointment?.appointmentStatus || "").toLowerCase();
  const dateTime = getAppointmentDateTime(appointment);
  if (!dateTime) return false;

  // Treat booked/scheduled/new style statuses as active upcoming appointments.
  const isActiveStatus =
    rawStatus === "booked" ||
    rawStatus === "scheduled" ||
    rawStatus === "pending" ||
    rawStatus === "confirmed";

  return isActiveStatus && dateTime.getTime() >= Date.now();
};

const Ai = () => {
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [contextLoading, setContextLoading] = useState(false);
  const [error, setError] = useState("");
  const [patientContext, setPatientContext] = useState(null);

  const fetchPatientSnapshot = useCallback(async (patientId) => {
    const [profile, records, appointments] = await Promise.all([
      getPatientProfile(patientId),
      getPatientRecords(patientId),
      getAppointments(patientId),
    ]);
    return {
      profile,
      records: Array.isArray(records) ? records : [],
      appointments: Array.isArray(appointments) ? appointments : [],
    };
  }, []);

  useEffect(() => {
    const loadContext = async () => {
      if (!user) return;

      setContextLoading(true);
      setError("");

      try {
        if (user.role === "PATIENT") {
          const { profile, records, appointments } = await fetchPatientSnapshot(user.id);

          const latestRecord = Array.isArray(records) && records.length > 0 ? records[0] : null;

          setPatientContext({
            role: user.role,
            patient: profile,
            records,
            appointments,
            latestRecord,
            totalRecords: Array.isArray(records) ? records.length : 0,
            upcomingAppointments: Array.isArray(appointments)
              ? appointments.filter(isUpcomingAppointment).length
              : 0,
          });
        } else {
          const [doctor, patients] = await Promise.all([getDoctorProfile(user.id), getDoctorPatients(user.id)]);
          setPatientContext({
            role: user.role,
            doctor,
            patientsCount: Array.isArray(patients) ? patients.length : 0,
            patients: Array.isArray(patients) ? patients : [],
          });
        }
      } catch (err) {
        setError("Failed to load patient context from backend database.");
      } finally {
        setContextLoading(false);
      }
    };

    loadContext();
  }, [user, fetchPatientSnapshot]);

  const contextLabel = useMemo(() => {
    if (!patientContext) return "No context loaded";
    if (patientContext.role === "PATIENT") {
      return patientContext.patient?.name || "Patient context ready";
    }
    return `${patientContext.doctor?.doctorName || "Doctor"} | ${patientContext.patientsCount || 0} patients`;
  }, [patientContext]);

  const handleSend = async (manualPrompt) => {
    const text = (manualPrompt ?? input).trim();
    if (!text || !user || isLoading) return;

    const userMessage = {
      id: Date.now(),
      role: "user",
      content: text,
      time: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setError("");

    try {
      let contextForQuestion = patientContext;
      let directReply = null;

      if (user.role === "PATIENT" && isDetailsIntent(text)) {
        const snapshot = await fetchPatientSnapshot(user.id);
        directReply = formatPatientDetailsText(snapshot);
        contextForQuestion = {
          ...(patientContext || {}),
          patient: snapshot.profile,
          records: snapshot.records,
          appointments: snapshot.appointments,
          totalRecords: snapshot.records.length,
          upcomingAppointments: snapshot.appointments.filter(isUpcomingAppointment).length,
        };
        setPatientContext(contextForQuestion);
      }

      if (user.role === "DOCTOR" && isDetailsIntent(text)) {
        const chosenPatient = pickPatientFromQuestion(text, patientContext?.patients);
        if (!chosenPatient) {
          directReply =
            "Please mention patient name or patient ID to fetch full details. Example: Show full details for patient Poojaa Kumar.";
        } else {
          const snapshot = await fetchPatientSnapshot(chosenPatient.patientId);
          directReply = formatPatientDetailsText(snapshot);
          contextForQuestion = {
            ...(patientContext || {}),
            selectedPatient: snapshot.profile,
            selectedPatientRecords: snapshot.records,
            selectedPatientAppointments: snapshot.appointments,
          };
          setPatientContext(contextForQuestion);
        }
      }

      if (directReply) {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            role: "assistant",
            content: directReply,
            time: new Date(),
          },
        ]);
        return;
      }

      const history = [...messages, userMessage].slice(-10).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const data = await aiService.sendAiMessage({
        message: text,
        userId: user.id,
        role: user.role,
        context: contextForQuestion,
        history,
      });

      const reply =
        data?.reply || data?.response || data?.message || data?.answer || "No response from AI service.";

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          content: reply,
          time: new Date(),
        },
      ]);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Failed to get response from AI service.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-content">
        <Navbar />

        <div className="dashboard-container ai-page-wrapper">
          <div className="ai-panel" id="ai-panel">
            <div className="ai-header">
              <div className="ai-logo">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
                </svg>
                <div className="ai-logo-pulse" />
              </div>

              <div className="ai-header-info">
                <p className="ai-header-title">Clinical AI Assistant</p>
                <p className="ai-header-sub">
                  <span className={`ai-status-dot ${isLoading ? "loading" : ""}`} />
                  <span>{isLoading ? "Thinking..." : "Frontend Gemini mode"}</span>
                </p>
              </div>

              <div className="ai-header-actions">
                <button className="ai-icon-btn" onClick={() => setMessages([])} title="Clear chat">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-1 14H6L5 6" />
                    <path d="M10 11v6M14 11v6" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="ai-context-bar">
              <span className="ai-context-label">Context</span>
              <span className="ai-context-chip">{contextLoading ? "Loading..." : contextLabel}</span>
              {patientContext?.role === "PATIENT" && (
                <span className="ai-context-chip">
                  Upcoming: {patientContext.upcomingAppointments}
                </span>
              )}
            </div>

            <div className="ai-messages">
              {messages.length === 0 ? (
                <div className="ai-empty-state">
                  <div className="ai-empty-icon">
                    <svg viewBox="0 0 24 24" strokeWidth="1.5">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
                      />
                    </svg>
                  </div>
                  <p className="ai-empty-title">AI Assistant is ready</p>
                  <p className="ai-empty-desc">Ask about your records, appointments, or risk alerts.</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div key={msg.id} className={`ai-message ${msg.role}`}>
                    <div className="ai-msg-avatar">{msg.role === "assistant" ? "AI" : "U"}</div>
                    <div className="ai-msg-content">
                      <div className="ai-msg-bubble" dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }} />
                      <span className="ai-msg-time">{formatTime(msg.time)}</span>
                    </div>
                  </div>
                ))
              )}

              {isLoading && (
                <div className="ai-message assistant ai-typing">
                  <div className="ai-msg-avatar">AI</div>
                  <div className="ai-typing-dots">
                    <div className="ai-typing-dot" />
                    <div className="ai-typing-dot" />
                    <div className="ai-typing-dot" />
                  </div>
                </div>
              )}

              {error && <div className="ai-error-msg">{error}</div>}
            </div>

            <div className="ai-quick-prompts">
              {QUICK_PROMPTS.map((prompt) => (
                <button key={prompt} className="ai-quick-btn" onClick={() => handleSend(prompt)}>
                  {prompt}
                </button>
              ))}
            </div>

            <div className="ai-input-area">
              <div className="ai-input-wrapper">
                <textarea
                  className="ai-textarea"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Ask a question about patient data..."
                  rows="1"
                />

                <button className="ai-send-btn" onClick={() => handleSend()} disabled={!input.trim() || isLoading}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
              </div>

              <div className="ai-input-footer">
                <span className="ai-input-hint">Press <span>Enter</span> to send</span>
                <span className="ai-powered-by">Powered by <strong>Gemini</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ai;

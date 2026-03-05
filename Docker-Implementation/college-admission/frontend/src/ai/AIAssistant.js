import React, { useState, useRef, useEffect } from 'react';
import './AIAssistant.css';

const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
const PRIMARY_MODEL = process.env.REACT_APP_GEMINI_MODEL || 'gemini-2.0-flash';
const FALLBACK_MODELS = (process.env.REACT_APP_GEMINI_FALLBACK_MODELS || '')
  .split(',')
  .map((m) => m.trim())
  .filter(Boolean);
const FORCE_LOCAL_AI = process.env.REACT_APP_FORCE_LOCAL_AI === 'true';
const SYSTEM_CONTEXT = `You are EduAdmit AI, a helpful college admissions assistant for a college admission portal.
You help students with:
- Course selection advice (B.Tech IT, B.Tech CSE, BBA and other programs)
- Admission process guidance (registration, application, documents, payment)
- Document requirements (marksheets, ID proof, etc.)
- Application status understanding
- Career advice related to courses
- General college admission tips

Keep responses concise, friendly and helpful. Use bullet points for lists.
If asked about specific personal information (passwords, etc.) politely decline.
Always encourage students to use the platform to apply.`;

const SUGGESTIONS = [
  'Which course is best for a software career?',
  'What documents do I need to apply?',
  'How long does admission take?',
  'What is the application fee?',
  'Tell me about B.Tech CSE',
  'How to check my application status?',
];

const getLocalFallbackReply = (userMsg) => {
  const text = userMsg.toLowerCase();

  if (/(hi|hello|hey)/.test(text)) {
    return 'Hello! Ask me anything about admissions, courses, fees, eligibility, documents, or timelines.';
  }
  if (/(course|program|cse|it|bba|degree|branch)/.test(text)) {
    return 'Course guidance:\n- **B.Tech CSE**: software, AI, development careers\n- **B.Tech IT**: systems, networking, operations\n- **BBA**: business, management, operations\n\nTell me your interests and I will suggest the best fit.';
  }
  if (/(document|certificate|id|marksheet|upload)/.test(text)) {
    return 'Common required documents:\n- 10th and 12th marksheets\n- Government photo ID\n- Passport-size photo\n- Transfer/Character certificate (if applicable)';
  }
  if (/(fee|payment|pay|cost|amount)/.test(text)) {
    return 'Application fee is typically **Rs.500**. Payment options usually include UPI, card, and net banking.';
  }
  if (/(status|track|application|review|approved|rejected|pending)/.test(text)) {
    return 'You can track status from **Dashboard -> My Status**. Usual stages: Submitted -> Under Review -> Decision.';
  }
  if (/(eligib|criteria|minimum|cutoff|marks|percentage)/.test(text)) {
    return 'Eligibility usually depends on qualifying exam marks and course requirements. Share your marks and target course, and I will guide you.';
  }
  if (/(scholarship|loan|financial|aid)/.test(text)) {
    return 'Scholarship/financial aid depends on merit and policy. Check official notifications and admissions office for current eligibility.';
  }

  return `I can help with your query: "${userMsg}".\n\nFor faster guidance, share these details:\n- target course\n- current qualification/marks\n- your specific question (fees, eligibility, documents, timeline, status)`;
};

function AIAssistant() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! I am EduAdmit AI. I can help with courses, documents, fees, and application status.",
      time: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [geminiDisabledReason, setGeminiDisabledReason] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text) => {
    const userMsg = text || input.trim();
    if (!userMsg) return;

    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMsg, time: new Date() }]);
    setLoading(true);

    try {
      if (FORCE_LOCAL_AI || !API_KEY || API_KEY === 'your_gemini_api_key_here') {
        setMessages((prev) => [...prev, { role: 'assistant', content: getLocalFallbackReply(userMsg), time: new Date() }]);
        return;
      }

      if (geminiDisabledReason) {
        setMessages((prev) => [...prev, {
          role: 'assistant',
          content: getLocalFallbackReply(userMsg),
          time: new Date()
        }]);
        return;
      }

      const history = messages.slice(-10).map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));

      const payload = {
        contents: [
          { role: 'user', parts: [{ text: SYSTEM_CONTEXT }] },
          { role: 'model', parts: [{ text: 'Understood! I am EduAdmit AI, ready to help.' }] },
          ...history,
          { role: 'user', parts: [{ text: userMsg }] }
        ],
        generationConfig: { maxOutputTokens: 500, temperature: 0.7 }
      };

      const modelCandidates = [PRIMARY_MODEL, ...FALLBACK_MODELS].filter((m, i, arr) => arr.indexOf(m) === i);
      let lastReason = '';
      let allQuotaErrors = true;
      let allRecoverableModelIssues = true;

      for (const model of modelCandidates) {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          }
        );

        const data = await response.json();
        if (!response.ok) {
          const reason = data?.error?.message || `Gemini request failed (${response.status})`;
          const quotaError = /quota|rate.?limit|exceeded/i.test(reason);
          const modelIssue = /not found for api version|not supported for generatecontent|model/i.test(reason);
          if (!quotaError) allQuotaErrors = false;
          if (!modelIssue) allRecoverableModelIssues = false;
          lastReason = reason;
          continue;
        }

        const blockReason = data?.promptFeedback?.blockReason;
        if (blockReason) {
          setMessages((prev) => [...prev, {
            role: 'assistant',
            content: `Gemini blocked this request (${blockReason}). Please rephrase your question.`,
            time: new Date()
          }]);
          return;
        }

        const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (reply) {
          setMessages((prev) => [...prev, { role: 'assistant', content: reply, time: new Date() }]);
          return;
        }

        allQuotaErrors = false;
        allRecoverableModelIssues = false;
        lastReason = 'Gemini returned an empty response.';
      }

      if (allQuotaErrors || allRecoverableModelIssues) {
        setGeminiDisabledReason('service unavailable');
        setMessages((prev) => [...prev, {
          role: 'assistant',
          content: getLocalFallbackReply(userMsg),
          time: new Date()
        }]);
        return;
      }

      setMessages((prev) => [...prev, {
        role: 'assistant',
        content: getLocalFallbackReply(userMsg),
        time: new Date()
      }]);
    } catch {
      setMessages((prev) => [...prev, {
        role: 'assistant',
        content: getLocalFallbackReply(userMsg),
        time: new Date()
      }]);
    } finally {
      setLoading(false);
    }
  };

  const formatMessage = (content) => {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br/>');
  };

  const formatTime = (date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="ai-page page-wrapper">
      <div className="ai-layout">
        <div className="ai-sidebar">
          <div className="ais-header">
            <div className="ais-logo">AI</div>
            <h3>EduAdmit AI</h3>
            <p>Powered by Google Gemini</p>
          </div>
          <div className="ais-suggestions">
            <div className="ais-section-title">Quick Questions</div>
            {SUGGESTIONS.map((s, i) => (
              <button key={i} className="ais-suggestion" onClick={() => sendMessage(s)}>
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="ai-chat-area">
          <div className="aca-header">
            <div className="aca-bot">
              <div className="aca-bot-icon">AI</div>
              <div>
                <div className="aca-bot-name">EduAdmit AI Assistant</div>
                <div className="aca-bot-status">Online - Ready to help</div>
              </div>
            </div>
            <button className="aca-clear" onClick={() => setMessages([messages[0]])}>Clear Chat</button>
          </div>

          <div className="aca-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`message ${msg.role}`}>
                {msg.role === 'assistant' && <div className="msg-avatar">AI</div>}
                <div className="msg-content">
                  <div className="msg-bubble" dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }} />
                  <div className="msg-time">{formatTime(msg.time)}</div>
                </div>
                {msg.role === 'user' && <div className="msg-user-avatar">You</div>}
              </div>
            ))}
            {loading && (
              <div className="message assistant">
                <div className="msg-avatar">AI</div>
                <div className="msg-content">
                  <div className="msg-bubble typing">
                    <div className="typing-dots">
                      <span></span><span></span><span></span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="aca-input-area">
            <div className="aca-input-row">
              <input
                type="text"
                className="aca-input"
                placeholder="Ask me anything about college admissions..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !loading && sendMessage()}
                disabled={loading}
              />
              <button className="aca-send" onClick={() => sendMessage()} disabled={loading || !input.trim()}>
                {loading ? '...' : 'Send'}
              </button>
            </div>
            <p className="aca-disclaimer">
              AI responses are for guidance only. For official information, contact admissions office.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AIAssistant;

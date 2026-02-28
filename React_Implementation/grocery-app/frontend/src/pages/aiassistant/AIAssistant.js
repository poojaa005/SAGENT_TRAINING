import React, { useState, useRef, useEffect } from 'react';
import './AIAssistant.css';

const SYSTEM_PROMPT = `You are FreshMart's AI grocery assistant named Basil.
Help users with recipes, meal plans, shopping lists, nutrition advice, and product suggestions.
Keep responses concise, helpful, and friendly.`;

const toGeminiRole = (role) => (role === 'assistant' ? 'model' : 'user');
const GEMINI_MODELS = ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-1.5-flash-8b', 'gemini-pro'];

const getModelCandidates = async (apiKey) => {
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    if (!res.ok) return GEMINI_MODELS;
    const payload = await res.json();
    const listed = (payload?.models || [])
      .filter((m) => Array.isArray(m.supportedGenerationMethods) && m.supportedGenerationMethods.includes('generateContent'))
      .map((m) => (m.name || '').replace('models/', ''))
      .filter(Boolean);

    const prioritized = listed.filter((name) => /gemini/i.test(name));
    return [...new Set([...GEMINI_MODELS, ...prioritized])];
  } catch {
    return GEMINI_MODELS;
  }
};

const AIAssistant = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! I'm Basil, your FreshMart AI assistant. What can I help you with today?",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const hasApiKey = Boolean(process.env.REACT_APP_GEMINI_API_KEY);

  const SUGGESTIONS = [
    'What can I cook with rice and vegetables?',
    'Plan a healthy weekly meal for 2 people',
    'What should I buy for a South Indian breakfast?',
    'Suggest high-protein vegetarian meals',
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text = input) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    setInput('');

    const userMsg = { role: 'user', content: trimmed };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
      if (!apiKey) throw new Error('API key not configured');

      const body = {
        systemInstruction: {
          role: 'system',
          parts: [{ text: SYSTEM_PROMPT }],
        },
        contents: updatedMessages.map((m) => ({
          role: toGeminiRole(m.role),
          parts: [{ text: m.content }],
        })),
        generationConfig: {
          maxOutputTokens: 500,
          temperature: 0.7,
        },
      };

      let data = null;
      let lastErrorText = '';
      const modelsToTry = await getModelCandidates(apiKey);
      for (const model of modelsToTry) {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
          }
        );
        if (response.ok) {
          data = await response.json();
          break;
        }
        const errorPayload = await response.json().catch(() => ({}));
        lastErrorText = `${model}: ${errorPayload?.error?.message || `Gemini request failed (${response.status})`}`;
      }

      if (!data) throw new Error(lastErrorText || 'API request failed');

      const assistantContent =
        data?.candidates?.[0]?.content?.parts?.map((part) => part.text).join('\n') || 'Sorry, I could not get a response.';
      setMessages((prev) => [...prev, { role: 'assistant', content: assistantContent }]);
    } catch (err) {
      const errMsg = err.message.includes('API key')
        ? 'Please add REACT_APP_GEMINI_API_KEY in your .env file to enable AI responses.'
        : `Gemini error: ${err.message}`;
      setMessages((prev) => [...prev, { role: 'assistant', content: errMsg }]);
    } finally {
      setLoading(false);
    }
  };

  const formatMessage = (content) => content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>');

  return (
    <div className="ai-page">
      <div className="ai-sidebar">
        <div className="ai-branding">
          <div className="ai-avatar">AI</div>
          <h2>Basil</h2>
          <p>Your AI Grocery Assistant</p>
        </div>
        <div className="env-note">
          {hasApiKey ? (
            <p>
              Gemini key detected in environment.
            </p>
          ) : (
            <p>
              Add <code>REACT_APP_GEMINI_API_KEY</code> to <code>.env</code> to activate AI
            </p>
          )}
        </div>
      </div>

      <div className="ai-chat">
        <div className="ai-chat-header">
          <div className="ai-header-info">
            <div className="ai-status-dot"></div>
            <span>Basil is online</span>
          </div>
        </div>

        <div className="ai-messages">
          {messages.map((msg, i) => (
            <div key={i} className={`message ${msg.role}`}>
              <div className="msg-bubble" dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }} />
            </div>
          ))}
          {loading && (
            <div className="message assistant">
              <div className="msg-bubble typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {messages.length === 1 && (
          <div className="suggestions">
            {SUGGESTIONS.map((s, i) => (
              <button key={i} className="suggestion-chip" onClick={() => sendMessage(s)}>
                {s}
              </button>
            ))}
          </div>
        )}

        <div className="ai-input-area">
          <input
            type="text"
            placeholder="Ask Basil anything about groceries, recipes, meals..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            disabled={loading}
          />
          <button className="send-btn" onClick={() => sendMessage()} disabled={loading || !input.trim()}>
            {loading ? '...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;

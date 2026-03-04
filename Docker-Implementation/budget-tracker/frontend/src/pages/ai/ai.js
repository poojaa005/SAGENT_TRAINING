import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useUser } from '../../context/UserContext';
import { incomeService } from '../../services/incomeService';
import { expenseService } from '../../services/expenseService';
import { goalService } from '../../services/goalService';
import { budgetService } from '../../services/budgetService';
import { formatCurrency } from '../../utils/formatters';
import './ai.css';

// ─── Quick suggestion prompts ────────────────────────────────────
const SUGGESTIONS = [
  { icon: 'fa-chart-pie',      label: 'Analyze my spending'          },
  { icon: 'fa-lightbulb',      label: 'How can I save more?'         },
  { icon: 'fa-piggy-bank',     label: 'Review my savings goals'      },
  { icon: 'fa-triangle-exclamation', label: 'Am I over budget?'      },
  { icon: 'fa-calendar-check', label: 'Monthly financial summary'    },
  { icon: 'fa-coins',          label: 'Top tips to cut expenses'     },
];

// ─── Format timestamp ────────────────────────────────────────────
const formatTime = () =>
  new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

// ─── Parse basic markdown for AI responses ───────────────────────
const parseMarkdown = (text) => {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/^### (.+)$/gm, '<strong>$1</strong>')
    .replace(/^## (.+)$/gm,  '<strong>$1</strong>')
    .replace(/^# (.+)$/gm,   '<strong>$1</strong>')
    .replace(/^\- (.+)$/gm,  '• $1')
    .replace(/\n/g, '<br/>');
};

// ─── Main Component ──────────────────────────────────────────────
const isLikelyGeminiKey = (key) => typeof key === 'string' && key.startsWith('AIza');

const getAiConfig = () => {
  const anthropicKey = process.env.REACT_APP_ANTHROPIC_API_KEY?.trim();
  const geminiKey = process.env.REACT_APP_GEMINI_API_KEY?.trim();

  if (geminiKey) return { provider: 'gemini', apiKey: geminiKey };
  if (anthropicKey && isLikelyGeminiKey(anthropicKey)) {
    return { provider: 'gemini', apiKey: anthropicKey };
  }
  if (anthropicKey) return { provider: 'anthropic', apiKey: anthropicKey };
  return null;
};

let cachedGeminiModel = '';

const pickGeminiModel = async (apiKey) => {
  if (cachedGeminiModel) return cachedGeminiModel;

  if (process.env.REACT_APP_GEMINI_MODEL?.trim()) {
    cachedGeminiModel = process.env.REACT_APP_GEMINI_MODEL.trim();
    return cachedGeminiModel;
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
  );

  if (!response.ok) {
    const errData = await response.json();
    throw new Error(errData?.error?.message || `Gemini ListModels error: ${response.status}`);
  }

  const data = await response.json();
  const model = (data.models || []).find((m) =>
    (m.supportedGenerationMethods || []).includes('generateContent')
  );

  if (!model?.name) {
    throw new Error('No Gemini model with generateContent support is available for this API key.');
  }

  cachedGeminiModel = model.name.replace(/^models\//, '');
  return cachedGeminiModel;
};

const AI = () => {
  const { user } = useUser();
  const [messages, setMessages]   = useState([]);
  const [input, setInput]         = useState('');
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');
  const [financialData, setFinancialData] = useState(null);
  const messagesEndRef = useRef(null);
  const textareaRef    = useRef(null);

  // ── Auto-scroll to bottom ──────────────────────────────────────
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(() => { scrollToBottom(); }, [messages, loading]);

  // ── Fetch user's financial data to give AI context ─────────────
  const fetchFinancialContext = useCallback(async () => {
    if (!user) return;
    try {
      const [incRes, expRes, goalRes, budRes] = await Promise.all([
        incomeService.getIncomeByUser(user.userId),
        expenseService.getExpensesByUser(user.userId),
        goalService.getGoalsByUser(user.userId),
        budgetService.getBudgetsByUser(user.userId),
      ]);

      const incomes  = incRes.data;
      const expenses = expRes.data;
      const goals    = goalRes.data;
      const budgets  = budRes.data;

      const totalIncome   = incomes.reduce((s, i) => s + (i.amount || 0), 0);
      const totalExpenses = expenses.reduce((s, e) => s + (e.amount || 0), 0);
      const balance       = totalIncome - totalExpenses;

      // Group expenses by category
      const byCategory = expenses.reduce((acc, e) => {
        const cat = e.category?.categoryName || 'Other';
        acc[cat] = (acc[cat] || 0) + e.amount;
        return acc;
      }, {});

      setFinancialData({
        userName: user.name,
        totalIncome,
        totalExpenses,
        balance,
        incomeCount: incomes.length,
        expenseCount: expenses.length,
        byCategory,
        goals: goals.map((g) => ({
          name: g.goalName,
          target: g.targetAmount,
          saved: g.savedAmount,
          progress: Math.round(((g.savedAmount || 0) / (g.targetAmount || 1)) * 100),
          status: g.status,
          targetDate: g.targetDate,
        })),
        budgets: budgets.map((b) => ({
          month: b.month,
          total: b.totalAmount,
          startDate: b.startDate,
          endDate: b.endDate,
        })),
        recentExpenses: expenses
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 5)
          .map((e) => ({ title: e.title, amount: e.amount, category: e.category?.categoryName, date: e.date })),
        recentIncome: incomes
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 3)
          .map((i) => ({ source: i.source, amount: i.amount, date: i.date })),
      });
    } catch (err) {
      console.error('Failed to fetch financial context:', err);
    }
  }, [user]);

  useEffect(() => { fetchFinancialContext(); }, [fetchFinancialContext]);

  // ── Build system prompt with live financial data ───────────────
  const buildSystemPrompt = () => {
    const fd = financialData;
    if (!fd) {
      return `You are a helpful personal finance AI assistant. The user's financial data could not be loaded right now. Answer general finance questions helpfully and concisely.`;
    }

    const catBreakdown = Object.entries(fd.byCategory)
      .map(([cat, amt]) => `  - ${cat}: ${formatCurrency(amt)}`)
      .join('\n') || '  No expenses recorded yet.';

    const goalsText = fd.goals.length
      ? fd.goals.map((g) => `  - ${g.name}: ${formatCurrency(g.saved)} / ${formatCurrency(g.target)} (${g.progress}%) — ${g.status}`).join('\n')
      : '  No savings goals set.';

    const budgetsText = fd.budgets.length
      ? fd.budgets.map((b) => `  - ${b.month}: Budget ${formatCurrency(b.total)}`).join('\n')
      : '  No budgets set.';

    const recentExpText = fd.recentExpenses.length
      ? fd.recentExpenses.map((e) => `  - ${e.title} (${e.category}): ${formatCurrency(e.amount)} on ${e.date}`).join('\n')
      : '  None.';

    const recentIncText = fd.recentIncome.length
      ? fd.recentIncome.map((i) => `  - ${i.source}: ${formatCurrency(i.amount)} on ${i.date}`).join('\n')
      : '  None.';

    return `You are a smart, friendly, and concise personal finance AI assistant for ${fd.userName}'s Budget Tracker app.

You have access to their REAL financial data as of right now:

📊 FINANCIAL SUMMARY:
  - Total Income:   ${formatCurrency(fd.totalIncome)} (${fd.incomeCount} entries)
  - Total Expenses: ${formatCurrency(fd.totalExpenses)} (${fd.expenseCount} entries)
  - Current Balance: ${formatCurrency(fd.balance)}

📂 EXPENSES BY CATEGORY:
${catBreakdown}

🎯 SAVINGS GOALS:
${goalsText}

💼 BUDGETS:
${budgetsText}

🧾 RECENT EXPENSES:
${recentExpText}

💰 RECENT INCOME:
${recentIncText}

YOUR ROLE:
- Analyze their actual data when answering questions
- Give specific, actionable advice based on real numbers
- Be encouraging but honest about overspending or risks
- Keep responses concise and well-structured
- Use bullet points and bold text for clarity
- You can suggest budget adjustments, saving strategies, or spending improvements
- If asked about something unrelated to personal finance, politely redirect`;
  };

  // ── Send message to Claude API ─────────────────────────────────
  const sendMessage = async (text) => {
    const userText = (text || input).trim();
    if (!userText || loading) return;

    const userMsg = { role: 'user', content: userText, time: formatTime() };
    const updatedHistory = [...messages, userMsg];

    setMessages(updatedHistory);
    setInput('');
    setLoading(true);
    setError('');

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    try {
      const aiConfig = getAiConfig();
      if (!aiConfig) {
        throw new Error('Set REACT_APP_ANTHROPIC_API_KEY or REACT_APP_GEMINI_API_KEY in .env and restart the app.');
      }

      // Build conversation history for API (exclude our custom `time` field)
      const apiMessages = updatedHistory.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      let aiText = '';

      if (aiConfig.provider === 'gemini') {
        const geminiModel = await pickGeminiModel(aiConfig.apiKey);
        const chatTranscript = apiMessages
          .map((m) => `${m.role === 'assistant' ? 'Assistant' : 'User'}: ${m.content}`)
          .join('\n');

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${aiConfig.apiKey}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: `${buildSystemPrompt()}\n\nConversation:\n${chatTranscript}\nAssistant:`,
                    },
                  ],
                },
              ],
              generationConfig: {
                maxOutputTokens: 1024,
                temperature: 0.7,
              },
            }),
          }
        );

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData?.error?.message || `Gemini API error: ${response.status}`);
        }

        const data = await response.json();
        aiText =
          data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join('\n').trim() ||
          'Sorry, I could not generate a response.';
      } else {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': aiConfig.apiKey,
            'anthropic-version': '2023-06-01',
            'anthropic-dangerous-direct-browser-access': 'true',
          },
          body: JSON.stringify({
            model: process.env.REACT_APP_ANTHROPIC_MODEL || 'claude-3-5-sonnet-latest',
            max_tokens: 1024,
            system: buildSystemPrompt(),
            messages: apiMessages,
          }),
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData?.error?.message || `Anthropic API error: ${response.status}`);
        }

        const data = await response.json();
        aiText = data.content?.[0]?.text || 'Sorry, I could not generate a response.';
      }

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: aiText, time: formatTime() },
      ]);
    } catch (err) {
      console.error('AI error:', err);
      setError(err.message || 'Failed to connect to AI. Check your API key and network.');
    } finally {
      setLoading(false);
    }
  };

  // ── Keyboard: Enter to send, Shift+Enter for newline ──────────
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // ── Auto-grow textarea ─────────────────────────────────────────
  const handleInputChange = (e) => {
    setInput(e.target.value);
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = 'auto';
      ta.style.height = Math.min(ta.scrollHeight, 130) + 'px';
    }
  };

  const clearChat = () => {
    setMessages([]);
    setError('');
  };

  // ─── Render ────────────────────────────────────────────────────
  return (
    <div className="ai-page">

      {/* Header */}
      <div className="ai-header">
        <div className="ai-header-left">
          <div className="ai-avatar">
            <i className="fas fa-robot"></i>
          </div>
          <div className="ai-header-text">
            <h1>AI Finance Assistant</h1>
            <p>Powered by Claude · Analyzing your live financial data</p>
          </div>
        </div>
        <div className="ai-status">
          <span className="ai-status-dot"></span>
          Online
        </div>
      </div>

      {/* Suggestion Chips */}
      <div className="ai-suggestions">
        {SUGGESTIONS.map((s) => (
          <button
            key={s.label}
            className="suggestion-chip"
            onClick={() => sendMessage(s.label)}
            disabled={loading}
          >
            <i className={`fas ${s.icon}`}></i>
            {s.label}
          </button>
        ))}
      </div>

      {/* Chat Area */}
      <div className="ai-chat-container">
        <div className="ai-messages">

          {/* Welcome state */}
          {messages.length === 0 && !loading && (
            <div className="ai-welcome">
              <div className="ai-welcome-icon">
                <i className="fas fa-robot"></i>
              </div>
              <h2>Hello, {user?.name?.split(' ')[0]}! 👋</h2>
              <p>
                I have access to your live income, expenses, goals, and budgets.
                Ask me anything about your finances — I'll give you personalized advice.
              </p>
            </div>
          )}

          {/* Message bubbles */}
          {messages.map((msg, idx) => (
            <div key={idx} className={`message-row ${msg.role === 'user' ? 'user' : 'ai'}`}>
              <div className={`msg-avatar ${msg.role === 'user' ? 'user' : 'ai'}`}>
                {msg.role === 'user'
                  ? user?.name?.charAt(0).toUpperCase()
                  : <i className="fas fa-robot"></i>
                }
              </div>
              <div className="message-bubble">
                {msg.role === 'assistant' ? (
                  <span dangerouslySetInnerHTML={{ __html: parseMarkdown(msg.content) }} />
                ) : (
                  msg.content
                )}
                <span className="msg-time">{msg.time}</span>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {loading && (
            <div className="message-row ai">
              <div className="msg-avatar ai">
                <i className="fas fa-robot"></i>
              </div>
              <div className="message-bubble" style={{ padding: '10px 16px' }}>
                <div className="typing-indicator">
                  <span></span><span></span><span></span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Error Banner */}
        {error && (
          <div className="ai-error-banner">
            <i className="fas fa-circle-exclamation"></i>
            {error}
          </div>
        )}

        {/* Input Bar */}
        <div className="ai-input-bar">
          <div className="ai-input-wrap">
            <textarea
              ref={textareaRef}
              rows={1}
              placeholder="Ask about your finances... (Enter to send, Shift+Enter for new line)"
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />
          </div>
          <div className="ai-input-actions">
            {messages.length > 0 && (
              <button className="ai-clear-btn" onClick={clearChat} title="Clear chat">
                <i className="fas fa-trash"></i> Clear
              </button>
            )}
            <button
              className="ai-send-btn"
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              title="Send message"
            >
              {loading
                ? <i className="fas fa-spinner fa-spin"></i>
                : <i className="fas fa-paper-plane"></i>
              }
            </button>
          </div>
        </div>
      </div>

      <p className="ai-hint">
        <i className="fas fa-shield-halved"></i> Your data is sent securely to Claude AI for analysis only. It is not stored.
      </p>
    </div>
  );
};

export default AI;

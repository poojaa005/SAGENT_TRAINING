const geminiApiKey = (process.env.REACT_APP_GEMINI_API_KEY || "").trim();
const geminiModel = (process.env.REACT_APP_GEMINI_MODEL || "gemini-2.5-flash").trim();

const callGeminiDirect = async ({ message, userId, role, context, history }) => {
  if (!geminiApiKey) {
    throw new Error("REACT_APP_GEMINI_API_KEY is missing in frontend .env.");
  }

  const systemInstruction = [
    "You are a clinical AI assistant for a patient monitoring app.",
    "Use only the provided backend context and conversation history.",
    "If context is missing, ask a short clarification question.",
    "For risk situations, clearly mark [WARNING] or [CRITICAL].",
    "Keep responses concise and medically safe.",
  ].join(" ");

  const prompt = {
    userId,
    role,
    context,
    history,
    userMessage: message,
  };

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(geminiModel)}:generateContent?key=${encodeURIComponent(geminiApiKey)}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `${systemInstruction}\n\n${JSON.stringify(prompt)}`,
              },
            ],
          },
        ],
      }),
    }
  );

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini request failed (${response.status}): ${errText}`);
  }

  const data = await response.json();
  const text =
    data?.candidates?.[0]?.content?.parts?.map((p) => p?.text || "").join("").trim() ||
    "No response from Gemini.";

  return { reply: text };
};

export const sendAiMessage = async ({ message, userId, role, context, history }) => {
  return callGeminiDirect({
    message,
    userId,
    role,
    context,
    history,
  });
};

const aiService = {
  sendAiMessage,
};

export default aiService;

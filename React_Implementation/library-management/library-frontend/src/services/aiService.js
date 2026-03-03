// Get your free key at: https://aistudio.google.com/app/apikey
// Add to .env: REACT_APP_GEMINI_API_KEY=your_key_here
// Optional: REACT_APP_GEMINI_MODEL=gemini-2.5-flash

const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
const MODEL = process.env.REACT_APP_GEMINI_MODEL || 'gemini-2.5-flash';
const BASE_URL =
  `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

async function callGemini(prompt) {
  if (!API_KEY) {
    throw new Error('Gemini API key not found. Add REACT_APP_GEMINI_API_KEY to your .env file.');
  }

  const response = await fetch(`${BASE_URL}?key=${API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
    }),
  });

  if (!response.ok) {
    const err = await response.json();
    const message = err.error?.message || `Gemini API error while calling ${MODEL}.`;
    if (message.toLowerCase().includes('reported as leaked')) {
      throw new Error('Gemini API key is blocked (reported leaked). Create a new key, update REACT_APP_GEMINI_API_KEY in .env, then restart the frontend.');
    }
    throw new Error(message);
  }

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}

// ─── FEATURE 1: Book Recommendation Chatbot ──────────────────
export async function getBookRecommendations(userQuery, availableBooks) {
  const bookList = availableBooks
    .map(b => `- "${b.book_title}" by ${b.book_author} | Category: ${b.book_category} | Copies: ${b.book_quantity}`)
    .join('\n');

  const prompt = `You are a helpful library assistant.

Library catalog:
${bookList}

Member's request: "${userQuery}"

Recommend the most suitable books FROM THE LIST ABOVE ONLY. For each:
- Mention title and author
- Explain in 1-2 sentences why it matches
- Note if copies are available

Keep it friendly and concise.`;

  return callGemini(prompt);
}

// ─── FEATURE 2: Smart Book Search ────────────────────────────
export async function smartBookSearch(naturalQuery, allBooks) {
  const bookList = allBooks
    .map(b => `ID:${b.book_id} | "${b.book_title}" by ${b.book_author} | Category: ${b.book_category}`)
    .join('\n');

  const prompt = `You are a smart library search engine.

Library catalog:
${bookList}

User search: "${naturalQuery}"

Return ONLY a JSON array of matching book IDs (max 6). Example: [1, 3, 7]
If nothing matches return: []
No explanation, just the JSON array.`;

  const result = await callGemini(prompt);
  const match = result.match(/\[[\d,\s]*\]/);
  if (!match) return [];
  const ids = JSON.parse(match[0]);
  return allBooks.filter(b => ids.includes(b.book_id));
}

// ─── FEATURE 3: Overdue Notification Generator ───────────────
export async function generateOverdueNotification(memberName, bookTitle, daysOverdue, fineAmount) {
  const prompt = `You are a library notification system.

Details:
- Member: ${memberName}
- Book: "${bookTitle}"
- Days overdue: ${daysOverdue}
- Fine: Rs.${fineAmount}

Write a short (3-4 sentences), polite but firm overdue reminder.
- Address member by name
- Mention the book
- State the fine amount
- Encourage return soon
Just the message body, no subject line.`;

  return callGemini(prompt);
}

// ─── FEATURE 4: Book Summary Generator ───────────────────────
export async function generateBookSummary(bookTitle, bookAuthor, bookCategory) {
  const prompt = `You are a knowledgeable librarian.

Book: "${bookTitle}"
Author: ${bookAuthor}
Category: ${bookCategory}

Provide:
1. A 2-3 sentence summary of what the book is about
2. Who would enjoy this book
3. One interesting fact or highlight

Keep it under 150 words. Make it engaging.`;

  return callGemini(prompt);
}

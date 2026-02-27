# 🎓 EduAdmit — College Admission Frontend

A full-featured React.js frontend for the Spring Boot college admission system with Gemini AI integration.

## 📁 Project Structure

```
src/
├── ai/
│   ├── AIAssistant.js        ← Gemini AI chat interface
│   └── AIAssistant.css
├── components/
│   ├── Navbar/               ← Navigation bar
│   ├── Footer/               ← Footer component
│   └── StatusBadge/          ← Status indicator badge
├── context/
│   └── AuthContext.js        ← Auth state management
├── pages/
│   ├── Home/                 ← Landing page
│   ├── Register/             ← Student registration
│   ├── Login/                ← Student login
│   ├── Dashboard/            ← Student dashboard
│   ├── Application/          ← Multi-step application form
│   ├── Courses/              ← Course listing
│   ├── Payment/              ← Fee payment
│   ├── ApplicationStatus/    ← Status tracking
│   ├── OfficerLogin/         ← Officer portal login
│   └── OfficerDashboard/     ← Officer review panel
└── services/
    └── api.js                ← Axios API calls
```

## 🚀 Setup & Run

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Edit `.env` file:
```env
REACT_APP_API_BASE_URL=http://localhost:8080
REACT_APP_GEMINI_API_KEY=your_actual_gemini_api_key_here
```

Get your Gemini API key from: https://aistudio.google.com/app/apikey

### 3. Start Spring Boot Backend
Make sure your Spring Boot app is running on port 8080.

### 4. Start React App
```bash
npm start
```

App runs at: http://localhost:3000

## 🔑 Default Credentials (from DB seeds)

**Student Accounts:**
- poojaa@gmail.com / pass123
- rahul@gmail.com / rahul123
- ananya@gmail.com / ananya123

**Officer Accounts:**
- admin@college.com / admin123
- review@college.com / review123

## ✨ Features

- **Student Flow:** Register → Apply (5-step wizard) → Upload Docs → Pay → Track Status
- **Officer Flow:** Login → View Applications → Update Status → Add Remarks
- **AI Assistant:** Gemini AI powered chatbot for admission guidance
- **Real-time Status:** Application timeline tracking
- **Responsive Design:** Mobile-friendly

## 🎨 Tech Stack

- React 18 + React Router v6
- Google Gemini AI (gemini-2.0-flash)
- Axios for API calls
- Context API for state management
- CSS Variables for theming
- Google Fonts (Playfair Display + DM Sans)

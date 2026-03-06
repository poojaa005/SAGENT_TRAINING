# FreshMart - React Frontend

## Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Create `.env` file** (copy from `.env.example`):
```bash
REACT_APP_API_BASE_URL=http://localhost:8080
REACT_APP_GEMINI_API_KEY=your_gemini_api_key_here
```

3. **Start the app:**
```bash
npm start
```

## Project Structure

```
src/
├── pages/
│   ├── home/           Home.js + Home.css
│   ├── login/          Login.js + Login.css
│   ├── register/       Register.js + Register.css
│   ├── products/       Products.js + Products.css
│   ├── cart/           Cart.js + Cart.css
│   ├── orders/         Orders.js + Orders.css
│   ├── profile/        Profile.js + Profile.css
│   ├── aiassistant/    AIAssistant.js + AIAssistant.css
│   └── admin/          AdminDashboard.js + AdminDashboard.css
├── components/
│   ├── navbar/         Navbar.js + Navbar.css
│   ├── footer/         Footer.js + Footer.css
│   ├── productcard/    ProductCard.js + ProductCard.css
│   └── PrivateRoute.js
├── context/
│   ├── AuthContext.js  (Login/Register state)
│   └── CartContext.js  (Cart state)
├── services/
│   ├── api.js          (Axios base config)
│   ├── userService.js
│   ├── productService.js
│   ├── cartService.js
│   ├── cartItemService.js
│   ├── orderService.js
│   └── storeService.js
└── index.css           (Global styles + CSS variables)
```

## Features

- ✅ Login & Register (connects to `/api/users`)
- ✅ Product browsing with search & category filter
- ✅ Add to cart & checkout
- ✅ Order history with status tracker
- ✅ User profile management
- ✅ Admin dashboard (products CRUD, users, orders)
- ✅ AI Assistant (Basil) powered by Gemini API
- ✅ Responsive design

## Demo Credentials
- User: `poojaa@gmail.com` / `1234`
- Admin: `admin@gmail.com` / `admin123`

## AI Assistant
Add your Gemini API key to `.env` as `REACT_APP_GEMINI_API_KEY` to activate the AI grocery assistant.

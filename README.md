# 💰 AccountAbility

**AccountAbility** is a full-stack personal finance tracker built with the MERN stack. It empowers users to manage income, expenses, and cash accounts with intuitive charts, clean UI, and financial tools that actually help.

> "AccountAbility" is about more than just tracking — it's about building clarity, confidence, and control over your financial life.

---

## 🚀 Key Features

### 🔐 Authentication

- Secure user login & registration using JWT tokens
- Protected routes via backend middleware

### 💳 Account Management

- Add, edit, and delete checking/savings accounts
- Balances update in real-time based on transactions
- Individual cash flow charts for each account

### 📒 Transactions

- Record income or expenses with category, date, description
- Filter by account, category, or transaction type
- Sort by amount or date
- Supports pagination (5, 10, 20 rows per page)
- Monthly breakdown view for insight into trends

### 📊 Dashboard

- Total balance and account summary
- Pie chart: Spending by category
- Bar chart: Monthly spending (past 12 months)
- Smart alerts: “You’ve spent more/less than average this month”

### 🧮 Planning Tools

- 💡 **NEW:** Planning Page with calculators for:
  - Mortgage/Car affordability
  - Monthly loan payments
  - Budgeting breakdowns (e.g., 50/30/20 rule)
- Explains financial rules and gives actionable insights

### 🤖 AI Chat Coach _(Coming Soon)_

- Ask natural questions like “How do I start investing?” or “What’s the 50/30/20 rule?”
- Built using OpenAI’s GPT for financial education

---

## 📸 Screenshots

Modern, clean, and responsive UI.

> 🖼️ Preview images coming soon after deployment!

---

## 🛠️ Tech Stack

- **Frontend:** React, Axios, Recharts
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **Authentication:** JWT
- **Styling:** Custom CSS (mobile-first & responsive)

---

## ⚙️ Local Setup

```bash
# Clone the repository
git clone https://github.com/victorvaladez1/accountability-finance.git
cd accountability-finance

# Start the backend
cd backend
npm install
npm run dev

# Start the frontend
cd ../frontend
npm install
npm start
```

> App runs on localhost:3000 (frontend) and localhost:5000 (backend)

---

## 🌐 Deployment

**Status:** _In progress_

Will be deployed with:

- **Frontend:** Vercel
- **Database:** MongoDB Atlas
- **Domain:** Custom domain or Vercel link

---

## 📅 Roadmap

- [x] Core CRUD for accounts & transactions
- [x] Dashboard with charts & summaries
- [x] Planning page with calculators
- [x] Responsive design for mobile & desktop
- [x] Subtle UI animations and polish
- [ ] AI ChatCoach integration (OpenAI)
- [ ] Budget goal tracker
- [ ] Final deployment to production

---

## 🙌 Inspiration

This project is built by someone passionate about both personal finance and software engineering. Whether you're trying to take control of your money or just love clean interfaces, **AccountAbility** was made to help.

> "Because knowing your numbers should be empowering — not overwhelming."

---

## 👨‍💻 Author

Victor Valadez — [GitHub](https://github.com/victorvaladez1)

---

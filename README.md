# 💸 AccountAbility

**AccountAbility** is a full-stack personal finance tracker built with the MERN stack.  
It helps users simulate bank accounts, manage transactions, and track balances — all with a clean and modern authentication system.

---

## 🚀 Tech Stack

**Frontend:**
- React
- Axios
- React Router DOM

**Backend:**
- Node.js
- Express.js
- MongoDB + Mongoose

**Authentication:**
- JWT (JSON Web Tokens)
- bcrypt password hashing
- Protected API routes with middleware

---

## ✅ Current Features

- 🔐 **User Registration & Login**  
  Securely register new users and log in using JWT-based authentication.

- 🧠 **JWT Token Storage**  
  Auth token stored in `localStorage` and sent in headers for protected endpoints.

- 🛡 **Protected Backend Routes**  
  Only authenticated users can access routes like `/api/accounts` or `/api/transactions`.

- 📫 **Tested API with Postman**  
  All routes tested and functional with Postman for backend verification.

---

## 🛠 Upcoming Features

- 💳 Create, update, and delete simulated bank accounts
- 📊 Add transactions (income/expense) linked to specific accounts
- ⚖️ Auto-update account balances when transactions are created or removed
- 📂 Filter and sort by categories or date ranges
- 🧾 Dashboard UI showing financial overview
- 🚪 Logout functionality and session handling
- 🌈 Polished frontend UI with styled components

---

## 🧪 Getting Started

### 🔧 Backend Setup

```bash
cd backend
npm install
npm run dev
```

Create a `.env` file in the `/backend` folder with the following:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### 🎨 Frontend Setup

```bash
cd frontend
npm install
npm start
```

ChatGPT said:
Here’s the fully fixed and properly formatted Markdown version of that entire section — clean, structured, and GitHub-ready:

md
Copy
Edit
## 📡 API Routes (Preview)

### 🔐 Auth
- `POST /api/auth/register` – Register a new user  
- `POST /api/auth/login` – Login and receive a token

### 💳 Accounts
- `GET /api/accounts` – Get user’s accounts (protected)  
- `POST /api/accounts` – Create a new account  
- `PUT /api/accounts/:id` – Update an existing account  
- `DELETE /api/accounts/:id` – Delete an account

### 💸 Transactions
- `GET /api/transactions` – Get all transactions  
- `POST /api/transactions` – Create a new transaction

---

## ✨ Status

✅ Authentication & backend logic complete  
✅ Account and transaction CRUD implemented  
🛠️ Frontend UI in progress  
📈 More features coming soon

---

## 📸 Screenshots (Coming Soon)

Screenshots and UI walkthroughs will be added as the frontend is completed.

---

## 🙌 Author

Built with passion by **Victor Valadez** — aspiring Software Engineer with a love for fintech, functionality, and fire code.  
Inspired by a personal mission to build smarter financial tools for the next generation.

---

## ⭐ Project Goals

This project is a portfolio piece demonstrating:

- Full-stack app architecture  
- Real authentication and data protection  
- Clean, scalable project structure  
- A passion for financial literacy + software development
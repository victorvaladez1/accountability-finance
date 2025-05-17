import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

import authRoutes from "./routes/auth.js";
import accountRoutes from "./routes/accounts.js";
import transactionRoutes from "./routes/transactions.js";
import analyticsRoutes from "./routes/analytics.js";
import chatRoutes from "./routes/chat.js";
import holdingsRoutes from "./routes/holdings.js";
import marketRoutes from "./routes/market.js";
import snapshotRoutes from "./routes/snapshots.js";
import accountSnapshotsRoute from "./routes/accountSnapshots.js";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://accountability-finance-smrxm15id-victor-valadez-projects.vercel.app",
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
}));

// Middleware
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/holdings", holdingsRoutes);
app.use("/api/market", marketRoutes);
app.use("/api/snapshots", snapshotRoutes);
app.use("/api/account-snapshots", accountSnapshotsRoute);

app.get("/", (req, res) => {
  res.send("AccountAbility backend is running");
});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  app.listen(PORT, () =>
    console.log(`✅ Server started on port ${PORT}`)
  );
})
.catch((err) =>
  console.error("❌ MongoDB connection error:", err)
);

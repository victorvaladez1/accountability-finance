import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Import Routes
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
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("❌ Not allowed by CORS"));
    }
  },
  credentials: true,
}));

// Preflight support for all routes
app.options("*", cors());

// Middleware
app.use(express.json());

// API Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/accounts", accountRoutes);
// app.use("/api/transactions", transactionRoutes);
// app.use("/api/analytics", analyticsRoutes);
// app.use("/api/chat", chatRoutes);
// app.use("/api/holdings", holdingsRoutes);
// app.use("/api/market", marketRoutes);
// app.use("/api/snapshots", snapshotRoutes);
// app.use("/api/account-snapshots", accountSnapshotsRoute);

// Test route
app.get("/", (req, res) => {
  res.send("✅ AccountAbility backend is running");
});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
})
.catch((err) => {
  console.error("❌ MongoDB connection failed:", err);
});

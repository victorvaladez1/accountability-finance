const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth");
const accountRoutes = require("./routes/accounts");
const transactionRoutes = require("./routes/transactions");
const analyticsRoutes = require("./routes/analytics");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/analytics", analyticsRoutes);

// Root test route
app.get("/", (req, res) => {
    res.send("AccountAbility backend is running");
});

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
})
.catch((err) => console.error("MongoDB connection error:", err));
const mongoose = require("mongoose");

const AccountSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: ["Checking", "Savings", "Investment"],
            required: true,
        },
        balance: {
            type: Number,
            required: true,
            default: 0,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {timestamps: true}
);

module.exports = mongoose.model("Account", AccountSchema);
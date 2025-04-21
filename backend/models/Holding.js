import mongoose from "mongoose";

const HoldingSchema = new mongoose.Schema({
    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
        required: true,
    },
    ticker: {
        type: String,
        required: true,
        uppercase: true,
    },
    shares: {
        type: Number,
        required: true,
    },
    averageCost: {
        type: Number,
        required: true,
    },
}, { timestamps: true });

const Holding = mongoose.model("Holding", HoldingSchema);
export default Holding;
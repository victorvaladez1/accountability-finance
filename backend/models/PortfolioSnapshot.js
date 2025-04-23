import mongoose from "mongoose";

const PortfolioSnapshotSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        value: {type: Number, required: true },
        timestamp: {type: Date, default: Date.now },
    },
    { timestamps: true }
);

export default mongoose.model("PortfolioSnapshot", PortfolioSnapShotSchema);
import mongoose from "mongoose";

const AccountSnapshotSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  accountId: { type: mongoose.Schema.Types.ObjectId, ref: "Account" },
  value: Number,
  timestamp: { type: Date, default: Date.now },
});

const AccountSnapshot = mongoose.model("AccountSnapshot", AccountSnapshotSchema);

export default AccountSnapshot;

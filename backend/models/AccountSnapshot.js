const mongoose = require("mongoose");

const AccountSnapshotSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  accountId: { type: mongoose.Schema.Types.ObjectId, ref: "Account" },
  value: Number,
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model("AccountSnapshot", AccountSnapshotSchema);

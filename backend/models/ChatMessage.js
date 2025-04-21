import mongoose form "mongoose";

const ChatMessageSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        role: {
            type: String,
            enum: ["user", "assistant"],
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

const ChatMessage = mongoose.model("ChatMessage", ChatMessageSchema);
export default ChatMessage;
import mongoose from "mongoose";

const HistorySchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    videoId: { type: mongoose.Schema.Types.ObjectId, ref: "Video", required: true },
    watchedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.History || mongoose.model("History", HistorySchema);
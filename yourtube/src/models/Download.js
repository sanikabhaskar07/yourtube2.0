import mongoose from "mongoose";

const DownloadSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    videoId: { type: String, required: true },
    plan: { type: String, default: "Free" },
    downloadedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.Download || mongoose.model("Download", DownloadSchema);
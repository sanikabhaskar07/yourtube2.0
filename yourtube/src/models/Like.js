import mongoose from "mongoose";

const LikeSchema = new mongoose.Schema(
  {
    videoId: { type: mongoose.Schema.Types.ObjectId, ref: "Video", required: true },
    userId: { type: String, required: true },
    type: { type: String, enum: ["like", "dislike"], required: true },
  },
  { timestamps: true }
);

LikeSchema.index({ videoId: 1, userId: 1 }, { unique: true });

export default mongoose.models.Like || mongoose.model("Like", LikeSchema);
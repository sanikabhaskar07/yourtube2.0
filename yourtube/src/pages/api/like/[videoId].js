import connectDB from "@/lib/mongodb";
import Like from "@/models/Like";
import Video from "@/models/Video";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await connectDB();
    const { videoId } = req.query;
    const { userId, type } = req.body;
    const likeType = type || "like";

    const existing = await Like.findOne({ videoId, userId });

    if (existing) {
      if (existing.type === likeType) {
        await Like.deleteOne({ _id: existing._id });
        return res.status(200).json({ liked: false, removed: true });
      } else {
        existing.type = likeType;
        await existing.save();
      }
    } else {
      await Like.create({ videoId, userId, type: likeType });
    }

    return res.status(200).json({ liked: likeType === "like" });
  } catch (error) {
    console.error("Like error:", error);
    return res.status(500).json({ message: "Failed", error: String(error) });
  }
}
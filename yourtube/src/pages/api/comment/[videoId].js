import connectDB from "@/lib/mongodb";
import Comment from "@/models/Comment";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  try {
    await connectDB();
    const { videoId } = req.query;
    const comments = await Comment.find({ videoid: videoId }).sort({ commentedon: -1 });
    return res.status(200).json({ result: comments });
  } catch (error) {
    console.error("Get comments error:", error);
    return res.status(500).json({ message: "Failed", error: String(error) });
  }
}
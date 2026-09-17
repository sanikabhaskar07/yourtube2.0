import connectDB from "@/lib/mongodb";
import Comment from "@/models/Comment";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  try {
    await connectDB();
    const { id } = req.query;
    const { commentbody } = req.body;
    const updated = await Comment.findByIdAndUpdate(id, { commentbody }, { new: true });
    return res.status(200).json(updated);
  } catch (error) {
    console.error("Edit comment error:", error);
    return res.status(500).json({ message: "Failed", error: String(error) });
  }
}
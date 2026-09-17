import connectDB from "@/lib/mongodb";
import Comment from "@/models/Comment";

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  try {
    await connectDB();
    const { id } = req.query;
    const comment = await Comment.findByIdAndDelete(id);
    return res.status(200).json({ comment });
  } catch (error) {
    console.error("Delete comment error:", error);
    return res.status(500).json({ message: "Failed", error: String(error) });
  }
}
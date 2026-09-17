import connectDB from "@/lib/mongodb";
import Comment from "@/models/Comment";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  try {
    await connectDB();
    const { videoid, userid, commentbody, usercommented } = req.body;
    const comment = await Comment.create({ videoid, userid, commentbody, usercommented });
    return res.status(200).json({ comment });
  } catch (error) {
    console.error("Post comment error:", error);
    return res.status(500).json({ message: "Failed", error: String(error) });
  }
}
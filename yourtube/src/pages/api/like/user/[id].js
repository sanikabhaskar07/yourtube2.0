import connectDB from "@/lib/mongodb";
import Like from "@/models/Like";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await connectDB();

    const { id } = req.query;

    const likedVideos = await Like.find({
      userId: id,
      type: "like",
    })
      .populate("videoId")
      .sort({ createdAt: -1 });

    return res.status(200).json(likedVideos);
  } catch (error) {
    console.error("Get liked videos error:", error);
    return res.status(500).json({
      message: "Failed to fetch liked videos",
      error: String(error),
    });
  }
}
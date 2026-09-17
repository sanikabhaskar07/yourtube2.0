import connectDB from "@/lib/mongodb";
import History from "@/models/History";
import Video from "@/models/Video";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await connectDB();

    const { userId } = req.query;

    const history = await History.find({ userId })
      .populate({
        path: "videoId",
        model: Video,
      })
      .sort({ watchedAt: -1 });

    return res.status(200).json(history);
  } catch (error) {
    console.error("History fetch error:", error);

    return res.status(500).json({
      message: "Failed to load history",
      error: String(error),
    });
  }
}
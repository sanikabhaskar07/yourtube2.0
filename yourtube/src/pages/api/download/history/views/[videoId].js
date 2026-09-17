import connectDB from "@/lib/mongodb";
import Video from "@/models/Video";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await connectDB();
    const { videoId } = req.query;

    await Video.findByIdAndUpdate(videoId, { $inc: { views: 1 } });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("View count error:", error);
    return res.status(500).json({ message: "Failed", error: String(error) });
  }
}
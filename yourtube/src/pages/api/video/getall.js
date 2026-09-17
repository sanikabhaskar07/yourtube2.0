import connectDB from "@/lib/mongodb";
import Video from "@/models/Video";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await connectDB();
    const videos = await Video.find().sort({ createdAt: -1 });
    return res.status(200).json({ result: videos });
  } catch (error) {
    console.error("Get videos error:", error);
    return res.status(500).json({ message: "Failed to fetch videos", error: String(error) });
  }
}
import connectDB from "@/lib/mongodb";
import History from "@/models/History";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await connectDB();
    const { videoId } = req.query;
    const { userId } = req.body;

    if (userId) {
      await History.create({ userId, videoId });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("History error:", error);
    return res.status(500).json({ message: "Failed", error: String(error) });
  }
}
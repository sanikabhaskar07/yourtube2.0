import connectDB from "@/lib/mongodb";
import Subscription from "@/models/Subscription";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  try {
    await connectDB();
    const { userId } = req.query;
    const sub = await Subscription.findOne({ userId }).sort({ createdAt: -1 });
    return res.status(200).json({ result: sub });
  } catch (error) {
    return res.status(500).json({ message: "Failed", error: String(error) });
  }
}
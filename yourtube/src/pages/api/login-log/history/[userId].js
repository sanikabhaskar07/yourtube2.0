import connectDB from "@/lib/mongodb";
import LoginLog from "@/models/LoginLog";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  try {
    await connectDB();
    const { userId } = req.query;
    const logs = await LoginLog.find({ userId }).sort({ loginTime: -1 }).limit(20);
    return res.status(200).json({ result: logs });
  } catch (error) {
    return res.status(500).json({ message: "Failed", error: String(error) });
  }
}
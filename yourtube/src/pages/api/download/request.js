import connectDB from "@/lib/mongodb";
import Download from "@/models/Download";

const PLAN_LIMITS = {
  Free: 1,
  Bronze: 5,
  Silver: 10,
  Gold: 20,
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await connectDB();
    const { userId, videoId, plan } = req.body;
    const userPlan = plan || "Free";
    const limit = PLAN_LIMITS[userPlan] ?? 1;

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const todayCount = await Download.countDocuments({
      userId,
      downloadedAt: { $gte: startOfDay },
    });

    if (todayCount >= limit) {
      return res.status(403).json({
        message: `Daily download limit reached for ${userPlan} plan (${limit}/day).`,
      });
    }

    const download = await Download.create({ userId, videoId, plan: userPlan });

    return res.status(200).json({ result: download, remaining: limit - todayCount - 1 });
  } catch (error) {
    console.error("Download error:", error);
    return res.status(500).json({ message: "Download failed", error: String(error) });
  }
}
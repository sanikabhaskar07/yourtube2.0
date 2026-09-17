import connectDB from "@/lib/mongodb";
import Subscription from "@/models/Subscription";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await connectDB();
    const { userId, plan, amount, paymentId, orderId } = req.body;

    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + 1);

    const subscription = await Subscription.create({
      userId,
      plan,
      amount,
      paymentId,
      orderId,
      status: "active",
      expiryDate,
    });

    return res.status(200).json({ result: subscription });
  } catch (error) {
    console.error("Verify error:", error);
    return res.status(500).json({ message: "Verification failed", error: String(error) });
  }
}
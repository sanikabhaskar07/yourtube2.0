import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: "rzp_test_Tc80zyiRXREkbZ",
  key_secret: "ycGgcaTBugaPBwLAuMCWHu7g",
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { amount } = req.body;

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    return res.status(200).json({ order });
  } catch (error) {
    console.error("Order creation error:", error);
    return res.status(500).json({ message: "Order creation failed", error: String(error) });
  }
}
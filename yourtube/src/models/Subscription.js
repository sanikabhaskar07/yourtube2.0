import mongoose from "mongoose";

const SubscriptionSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    plan: { type: String, enum: ["Free", "Bronze", "Silver", "Gold"], default: "Free" },
    amount: { type: Number },
    paymentId: { type: String },
    orderId: { type: String },
    status: { type: String, default: "active" },
    startDate: { type: Date, default: Date.now },
    expiryDate: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.models.Subscription || mongoose.model("Subscription", SubscriptionSchema);
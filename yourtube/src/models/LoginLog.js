import mongoose from "mongoose";

const LoginLogSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    email: { type: String },
    ip: { type: String },
    browser: { type: String },
    os: { type: String },
    device: { type: String },
    loginTime: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.LoginLog || mongoose.model("LoginLog", LoginLogSchema);
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import LoginLog from "@/models/LoginLog";
import { UAParser } from "ua-parser-js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await connectDB();
    const { email, name, image } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        email,
        name,
        photoURL: image,
        firebaseUid: email,
      });
    }

    const ua = req.headers["user-agent"] || "";
    const parser = new UAParser(ua);
    const parsed = parser.getResult();

    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.socket?.remoteAddress ||
      "unknown";

    await LoginLog.create({
      userId: user._id,
      email: user.email,
      ip,
      browser: `${parsed.browser.name || "Unknown"} ${parsed.browser.version || ""}`,
      os: `${parsed.os.name || "Unknown"} ${parsed.os.version || ""}`,
      device: parsed.device.type || "Desktop",
    });

    return res.status(200).json({ result: user });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Login failed", error: String(error) });
  }
}
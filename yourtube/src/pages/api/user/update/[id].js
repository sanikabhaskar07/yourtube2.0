import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export default async function handler(req, res) {
  if (req.method !== "PATCH") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await connectDB();
    const { id } = req.query;
    const { channelname, description } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { channelname, description },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Update error:", error);
    return res.status(500).json({ message: "Update failed", error: String(error) });
  }
}
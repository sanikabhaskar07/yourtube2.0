import connectDB from "@/lib/mongodb";
import Video from "@/models/Video";
import formidable from "formidable";
import fs from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await connectDB();

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const form = formidable({
      uploadDir,
      keepExtensions: true,
      maxFileSize: 100 * 1024 * 1024,
    });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("Upload parse error:", err);
        return res.status(500).json({ message: "Upload failed", error: String(err) });
      }

      const file = Array.isArray(files.file) ? files.file[0] : files.file;
      const videotitle = Array.isArray(fields.videotitle) ? fields.videotitle[0] : fields.videotitle;
      const videochanel = Array.isArray(fields.videochanel) ? fields.videochanel[0] : fields.videochanel;
      const uploader = Array.isArray(fields.uploader) ? fields.uploader[0] : fields.uploader;

      const filename = path.basename(file.filepath);
      const filepath = `/uploads/${filename}`;

      const video = await Video.create({
        videotitle,
        filepath,
        videochanel,
        uploader,
      });

      return res.status(200).json({ result: video });
    });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({ message: "Upload failed", error: String(error) });
  }
}
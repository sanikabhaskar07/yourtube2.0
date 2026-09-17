import React, { useState } from "react";
import { Button } from "./ui/button";
import { Download } from "lucide-react";
import { toast } from "sonner";
import axiosInstance from "@/lib/axiosinstance";
import { useUser } from "@/lib/AuthContext";

const DownloadButton = ({ video }: any) => {
  const { user } = useUser();
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    if (!user) {
      toast.error("Please sign in to download videos.");
      return;
    }
    setDownloading(true);
    try {
      const res = await axiosInstance.post("/api/download/request", {
        userId: user._id,
        videoId: video._id,
        plan: "Free",
      });
      toast.success(`Download started. ${res.data.remaining} downloads left today.`);
      const link = document.createElement("a");
      link.href = video.filepath;
      link.download = video.videotitle || "video";
      link.click();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Download failed.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className="bg-gray-100 rounded-full"
      onClick={handleDownload}
      disabled={downloading}
    >
      <Download className="w-5 h-5 mr-2" />
      {downloading ? "Downloading..." : "Download"}
    </Button>
  );
};

export default DownloadButton;
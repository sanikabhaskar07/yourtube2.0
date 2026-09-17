"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { MoreVertical, X, Clock, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import axiosInstance from "@/lib/axiosinstance";
import { useUser } from "@/lib/AuthContext";

type WatchLaterItem = {
  _id: string;
  createdAt?: string;
  videoid?: Video;
  videoId?: Video;
};

type Video = {
  _id: string;
  filepath?: string;
  videotitle?: string;
  videochanel?: string;
  uploader?: string;
  views?: number;
  createdAt?: string;
};

export default function WatchLaterContent() {
  const [watchLater, setWatchLater] = useState<WatchLaterItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    if (user?._id) {
      loadWatchLater();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadWatchLater = async () => {
    if (!user?._id) return;

    try {
      setLoading(true);

      const response = await axiosInstance.get(`/watch/${user._id}`);

      const data = response.data;

      // Convert different possible API responses into an array.
      const watchLaterList = Array.isArray(data)
        ? data
        : Array.isArray(data.watchLater)
          ? data.watchLater
          : Array.isArray(data.videos)
            ? data.videos
            : Array.isArray(data.data)
              ? data.data
              : [];

      setWatchLater(watchLaterList);
    } catch (error) {
      console.error("Error loading watch later videos:", error);
      setWatchLater([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWatchLater = async (watchLaterId: string) => {
    try {
      console.log("Removing from watch later:", watchLaterId);

      // Temporarily remove from the screen.
      // Add your delete API here later if your backend has one.
      setWatchLater((previousVideos) =>
        previousVideos.filter((item) => item._id !== watchLaterId)
      );
    } catch (error) {
      console.error("Error removing from watch later:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <p>Loading watch later...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <Clock className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold mb-2">
          Save videos for later
        </h2>
        <p className="text-gray-600">
          Sign in to access your Watch later playlist.
        </p>
      </div>
    );
  }

  if (watchLater.length === 0) {
    return (
      <div className="text-center py-12">
        <Clock className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold mb-2">No videos saved</h2>
        <p className="text-gray-600">
          Videos you save for later will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600">
          {watchLater.length} videos
        </p>

        <Button className="flex items-center gap-2">
          <Play className="w-4 h-4" />
          Play all
        </Button>
      </div>

      <div className="space-y-4">
        {watchLater.map((item) => {
          // Support both possible property names.
          const video = item.videoid || item.videoId;

          // Skip invalid records instead of crashing the page.
          if (!video?._id) {
            return null;
          }

          return (
            <div key={item._id} className="flex gap-4 group">
              <Link
                href={`/watch/${video._id}`}
                className="flex-shrink-0"
              >
                <div className="relative w-40 aspect-video bg-gray-100 rounded overflow-hidden">
                  <video
                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL || ""}/${video.filepath || ""}`}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
                    muted
                    preload="metadata"
                  />
                </div>
              </Link>

              <div className="flex-1 min-w-0">
                <Link href={`/watch/${video._id}`}>
                  <h3 className="font-medium text-sm line-clamp-2 group-hover:text-blue-600 mb-1">
                    {video.videotitle || "Untitled video"}
                  </h3>
                </Link>

                <p className="text-sm text-gray-600">
                  {video.videochanel ||
                    video.uploader ||
                    "Unknown channel"}
                </p>

                <p className="text-sm text-gray-600">
                  {(video.views || 0).toLocaleString()} views{" "}
                  {video.createdAt &&
                    `• ${formatDistanceToNow(new Date(video.createdAt))} ago`}
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  Added{" "}
                  {item.createdAt
                    ? `${formatDistanceToNow(new Date(item.createdAt))} ago`
                    : "recently"}
                </p>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() =>
                      handleRemoveFromWatchLater(item._id)
                    }
                  >
                    <X className="w-4 h-4 mr-2" />
                    Remove from Watch later
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        })}
      </div>
    </div>
  );
}
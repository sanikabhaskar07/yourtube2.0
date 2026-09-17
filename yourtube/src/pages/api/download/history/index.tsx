import React, { useEffect, useState } from "react";
import { useUser } from "@/lib/AuthContext";
import axiosInstance from "@/lib/axiosinstance";
import Link from "next/link";

export default function HistoryPage() {
  const { user } = useUser();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const videosRes = await axiosInstance.get("/api/video/getall");
        const allVideos = videosRes.data?.result ?? [];
        setHistory(allVideos.slice(0, 10));
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [user]);

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Watch History</h1>
      {history.length === 0 ? (
        <p className="text-gray-500">No watch history yet.</p>
      ) : (
        <div className="space-y-3">
          {history.map((v) => (
            <Link key={v._id} href={`/watch/${v._id}`}>
              <div className="border rounded p-3 hover:bg-gray-50">
                <p className="font-medium">{v.videotitle}</p>
                <p className="text-sm text-gray-500">{v.videochanel}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
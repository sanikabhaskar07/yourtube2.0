import React, { useEffect, useState } from "react";
import { useUser } from "@/lib/AuthContext";
import axiosInstance from "@/lib/axiosinstance";

export default function DownloadsPage() {
  const { user } = useUser();
  const [downloads, setDownloads] = useState<any[]>([]);

  useEffect(() => {
    const fetch = async () => {
      if (!user) return;
      try {
        const res = await axiosInstance.get(`/api/download/history/${user._id}`);
        setDownloads(res.data?.result ?? []);
      } catch (e) {
        console.log(e);
      }
    };
    fetch();
  }, [user]);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">My Downloads</h1>
      {downloads.length === 0 ? (
        <p className="text-gray-500">No downloads yet.</p>
      ) : (
        <div className="space-y-3">
          {downloads.map((d) => (
            <div key={d._id} className="border rounded p-3 flex justify-between">
              <span>Video ID: {d.videoId}</span>
              <span className="text-sm text-gray-500">
                {d.plan} plan • {new Date(d.downloadedAt).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
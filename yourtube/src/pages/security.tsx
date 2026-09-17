import React, { useEffect, useState } from "react";
import { useUser } from "@/lib/AuthContext";
import axiosInstance from "@/lib/axiosinstance";

export default function SecurityPage() {
  const { user } = useUser();
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    const fetch = async () => {
      if (!user) return;
      try {
        const res = await axiosInstance.get(`/api/login-log/history/${user._id}`);
        setLogs(res.data?.result ?? []);
      } catch (e) {
        console.log(e);
      }
    };
    fetch();
  }, [user]);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Login Activity</h1>
      {logs.length === 0 ? (
        <p className="text-gray-500">No login records yet.</p>
      ) : (
        <div className="space-y-3">
          {logs.map((log) => (
            <div key={log._id} className="border rounded p-3">
              <p className="text-sm">
                <strong>{log.browser}</strong> on {log.os} ({log.device})
              </p>
              <p className="text-xs text-gray-500">
                IP: {log.ip} • {new Date(log.loginTime).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
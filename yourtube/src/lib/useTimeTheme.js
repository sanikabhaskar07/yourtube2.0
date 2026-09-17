import { useEffect } from "react";

export function useTimeTheme() {
  useEffect(() => {
    const applyTheme = () => {
      const now = new Date();

      const indiaTime = new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Kolkata",
        hour: "numeric",
        minute: "numeric",
        hour12: false,
      }).formatToParts(now);

      const hour = Number(
        indiaTime.find((part) => part.type === "hour")?.value
      );

      const minute = Number(
        indiaTime.find((part) => part.type === "minute")?.value
      );

      const totalMinutes = hour * 60 + minute;

      // Light: 5:00 AM to 11:59 AM
      // Dark: 12:00 PM to 4:59 AM
      const isLightTime =
        totalMinutes >= 300 && totalMinutes < 720;

      document.documentElement.classList.toggle("dark", !isLightTime);

      console.log(
        `India time: ${hour}:${String(minute).padStart(2, "0")}`,
        isLightTime ? "LIGHT" : "DARK"
      );
    };

    applyTheme();

    const interval = setInterval(applyTheme, 60000);

    return () => clearInterval(interval);
  }, []);
}
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Toaster } from "@/components/ui/sonner";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { UserProvider } from "../lib/AuthContext";
import { useTimeTheme } from "../lib/useTimeTheme";

export default function App({ Component, pageProps }: AppProps) {
  useTimeTheme();

  return (
    <UserProvider>
      <div className="min-h-screen bg-white text-black dark:bg-black dark:text-white">
        <title>Your-Tube Clone</title>
        <Header />
        <Toaster />
        <div className="flex">
          <Sidebar />
          <Component {...pageProps} />
        </div>
      </div>
    </UserProvider>
  );
}
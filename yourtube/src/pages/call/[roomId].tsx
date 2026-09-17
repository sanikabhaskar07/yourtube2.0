import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import io, { Socket } from "socket.io-client";
import Peer from "simple-peer";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Video, VideoOff, PhoneOff } from "lucide-react";

export default function CallRoom() {
  const router = useRouter();
  const { roomId } = router.query;
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const peerRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!roomId) return;

    const init = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      streamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      await fetch("/api/socket");
      const socket = io({ path: "/api/socket" });
      socketRef.current = socket;

      socket.emit("join-room", roomId);

      socket.on("user-joined", (userId: string) => {
        const peer = new Peer({ initiator: true, trickle: false, stream });

        peer.on("signal", (signal) => {
          socket.emit("signal", { to: userId, signal });
        });

        peer.on("stream", (remoteStream) => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStream;
          }
          setConnected(true);
        });

        peerRef.current = peer;
      });

      socket.on("signal", (data: any) => {
        if (!peerRef.current) {
          const peer = new Peer({ initiator: false, trickle: false, stream });

          peer.on("signal", (signal) => {
            socket.emit("signal", { to: data.from, signal });
          });

          peer.on("stream", (remoteStream) => {
            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = remoteStream;
            }
            setConnected(true);
          });

          peer.signal(data.signal);
          peerRef.current = peer;
        } else {
          peerRef.current.signal(data.signal);
        }
      });

      socket.on("user-left", () => {
        setConnected(false);
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = null;
        }
        if (peerRef.current) {
          peerRef.current.destroy();
          peerRef.current = null;
        }
      });
    };

    init();

    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      socketRef.current?.disconnect();
      peerRef.current?.destroy();
    };
  }, [roomId]);

  const toggleMic = () => {
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach((t) => (t.enabled = !micOn));
      setMicOn(!micOn);
    }
  };

  const toggleCam = () => {
    if (streamRef.current) {
      streamRef.current.getVideoTracks().forEach((t) => (t.enabled = !camOn));
      setCamOn(!camOn);
    }
  };

  const leaveCall = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    socketRef.current?.disconnect();
    peerRef.current?.destroy();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4 p-4">
      <p className="text-white">Room ID: {roomId}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl">
        <div className="bg-gray-900 rounded-lg overflow-hidden aspect-video">
          <video ref={localVideoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
          <p className="text-white text-xs p-1">You</p>
        </div>
        <div className="bg-gray-900 rounded-lg overflow-hidden aspect-video">
          {connected ? (
            <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white">
              Waiting for participant...
            </div>
          )}
        </div>
      </div>
      <div className="flex gap-4">
        <Button variant="ghost" className="bg-gray-800 text-white rounded-full" onClick={toggleMic}>
          {micOn ? <Mic /> : <MicOff />}
        </Button>
        <Button variant="ghost" className="bg-gray-800 text-white rounded-full" onClick={toggleCam}>
          {camOn ? <Video /> : <VideoOff />}
        </Button>
        <Button variant="destructive" className="rounded-full" onClick={leaveCall}>
          <PhoneOff />
        </Button>
      </div>
    </div>
  );
}
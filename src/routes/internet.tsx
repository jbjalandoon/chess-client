import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { io } from "socket.io-client";
import InternetChess from "../InternetChess";

export const Route = createFileRoute("/internet")({
  component: RouteComponent,
});

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// eslint-disable-next-line react-refresh/only-export-components
export const internetSocket = io(API_URL + "/internet", {
  reconnection: false,
  autoConnect: false,
  protocols: ["websocket"],
  timeout: 1500,
});

function RouteComponent() {
  useEffect(() => {
    if (!internetSocket.connected) {
      internetSocket.connect();
    }

    return () => {
      internetSocket.disconnect();
    };
  }, []);

  return <InternetChess />;
}

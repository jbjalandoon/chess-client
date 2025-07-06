import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { io } from "socket.io-client";
import InternetChess from "../InternetChess";

export const Route = createFileRoute("/internet")({
  component: RouteComponent,
});

// eslint-disable-next-line react-refresh/only-export-components
export const internetSocket = io("http://localhost:3000/internet", {
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

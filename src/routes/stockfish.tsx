import { createFileRoute } from "@tanstack/react-router";
import StockfishChess from "../StockfishChess";
import { io } from "socket.io-client";
import { useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// eslint-disable-next-line react-refresh/only-export-components
export const stockfishSocket = io(API_URL + "/stockfish", {
  reconnection: false,
  autoConnect: false,
  protocols: ["websocket"],
  timeout: 1500,
});

export const Route = createFileRoute("/stockfish")({
  component: Stockfish,
});

function Stockfish() {
  useEffect(() => {
    if (!stockfishSocket.connected) {
      stockfishSocket.connect();
    }

    return () => {
      stockfishSocket.disconnect();
    };
  }, []);

  return <StockfishChess />;
}

import { createFileRoute } from "@tanstack/react-router";
import StockfishChess from "../StockfishChess";
import { io } from "socket.io-client";
import { useEffect } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const stockfishSocket = io("http://localhost:3000/stockfish", {
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

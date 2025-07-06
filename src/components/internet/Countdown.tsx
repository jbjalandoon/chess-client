import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { internetSocket } from "../../routes/internet";
import type { Color } from "chess.js";

export default function Countdown({
  vote,
  setStartVoting,
  setVote,
  pov,
  turn,
}: {
  pov: "black" | "white" | null;
  turn: Color;
  vote: string | null;
  setStartVoting: Dispatch<SetStateAction<boolean>>;
  setVote: Dispatch<SetStateAction<string | null>>;
}) {
  const [ms, setMs] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    const handleStartVoting = (serverTime: number, until: number) => {
      const t1 = Date.now();
      const serverOffset = serverTime - t1;
      const now = Date.now() + serverOffset;
      let diff = until - now;
      if (diff < 0) diff = 0;
      setMs(diff);

      setStartVoting(true);
      setVote(null);

      interval = setInterval(() => {
        setMs((prev) => prev - 1000);
      }, 1000);
    };

    const handleEndVoting = () => {
      setMs(0);
      clearInterval(interval);
    };

    internetSocket.on("start-voting", handleStartVoting);
    internetSocket.on("end-voting", handleEndVoting);
    return () => {
      internetSocket.off("start-voting", handleStartVoting);
      internetSocket.off("end-voting", handleEndVoting);
      clearInterval(interval);
    };
  }, [setStartVoting, setVote]);

  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg px-4">
      <div className="flex rounded-lg bg-[rgb(33,32,31)] p-3 font-mono text-2xl">
        <span>00</span>
        <span>:</span>
        <span>{(ms / 1000).toFixed(0).padStart(2, "0")}</span>
      </div>
      <span className="text-center text-lg">
        {pov == null ? (
          `${turn === "b" ? "Black" : "White"}'s turn`
        ) : (pov === "black" ? "b" : "w") === turn ? (
          <>
            {vote != null ? (
              <>
                <b>{vote}</b>
              </>
            ) : (
              "Vote..."
            )}
          </>
        ) : (
          "Waiting..."
        )}
      </span>
    </div>
  );
}

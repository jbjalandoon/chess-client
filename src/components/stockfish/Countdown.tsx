import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { stockfishSocket } from "../../routes/stockfish";

export default function Countdown({
  vote,
  setStartVoting,
  setVote,
}: {
  vote: string | null;
  setStartVoting: Dispatch<SetStateAction<boolean>>;
  setVote: Dispatch<SetStateAction<string | null>>;
}) {
  const [ms, setMs] = useState(0);
  const [computerThinking, setComputerThinking] = useState(false);

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
      setComputerThinking(false);
      setVote(null);

      interval = setInterval(() => {
        setMs((prev) => prev - 1000);
      }, 1000);
    };

    const handleEndVoting = () => {
      setMs(0);
      clearInterval(interval);
    };

    const handleComputerThinking = () => {
      setComputerThinking(true);
    };

    stockfishSocket.on("start-voting", handleStartVoting);
    stockfishSocket.on("end-voting", handleEndVoting);
    stockfishSocket.on("computer-thinking", handleComputerThinking);
    return () => {
      stockfishSocket.off("start-voting", handleStartVoting);
      stockfishSocket.off("end-voting", handleEndVoting);
      stockfishSocket.off("computer-thinking", handleComputerThinking);
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
      {!computerThinking && (
        <span className="text-center text-lg">
          {vote ? (
            <>
              <b>{vote}</b>
            </>
          ) : (
            "Start Voting"
          )}
        </span>
      )}
      <button
        className="cursor-pointer rounded-lg bg-blue-700/80 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:bg-gray-500"
        disabled={vote !== null}
        onClick={() => {
          stockfishSocket.emit("resign");
          setStartVoting(false);
          setVote("resign");
        }}
      >
        Resign
      </button>
      {computerThinking && (
        <span className="text-center text-lg">Waiting...</span>
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import { PulseLoader } from "react-spinners";
import internet from "../../assets/internet.png";
import stockfish from "../../assets/stockfish.png";
import { stockfishSocket } from "../../routes/stockfish";

export default function Score() {
  const [score, setScore] = useState<{
    internet: number;
    stockfish: number;
  } | null>(null);
  const handleUpdateScore = (internet: number, stockfish: number) => {
    setScore({ internet, stockfish });
  };

  useEffect(() => {
    stockfishSocket.on("update-score", handleUpdateScore);

    return () => {
      stockfishSocket.off("update-score", handleUpdateScore);
    };
  }, []);

  return (
    <>
      <div className="flex w-fit items-center justify-center gap-4 md:min-h-40">
        {score ? (
          <>
            <div className="flex flex-col items-center">
              <img src={internet} className="aspect-square w-24" />
              <span>Internet</span>
              <span className="text-sm text-gray-400">(1500)</span>
            </div>
            <div className="flex w-20 justify-between text-2xl">
              <span>{score.internet}</span>
              <span>-</span>
              <span>{score.stockfish}</span>
            </div>
            <div className="flex flex-col items-center">
              <img src={stockfish} className="aspect-square w-24" />
              <span>Stockfish</span>
              <span className="text-sm text-gray-400">(2200)</span>
            </div>
          </>
        ) : (
          <PulseLoader color="#ffffff" />
        )}
      </div>
    </>
  );
}

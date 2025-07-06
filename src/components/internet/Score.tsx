import { useEffect, useState } from "react";
import { PulseLoader } from "react-spinners";
import { internetSocket } from "../../routes/internet";

export default function Score() {
  const [score, setScore] = useState<{
    black: number;
    white: number;
  } | null>(null);
  const handleUpdateScore = (white: number, black: number) => {
    setScore({ black, white });
  };

  useEffect(() => {
    internetSocket.on("update-score", handleUpdateScore);

    return () => {
      internetSocket.off("update-score", handleUpdateScore);
    };
  }, []);

  return (
    <>
      <div className="flex w-fit items-center justify-center gap-4 lg:min-h-40">
        {score ? (
          <>
            <div className="flex flex-col items-center">
              <div className="aspect-square w-20 rounded-lg bg-black"></div>
              <span>Black</span>
              <span className="text-sm text-gray-400">(1500)</span>
            </div>
            <div className="flex w-20 justify-between text-2xl">
              <span>{score.black}</span>
              <span>-</span>
              <span>{score.white}</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="aspect-square w-20 rounded-lg bg-white"></div>
              <span>White</span>
              <span className="text-sm text-gray-400">(1500)</span>
            </div>
          </>
        ) : (
          <PulseLoader color="#ffffff" />
        )}
      </div>
    </>
  );
}

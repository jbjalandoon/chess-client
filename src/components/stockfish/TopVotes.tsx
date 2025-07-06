import { useEffect, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { stockfishSocket } from "../../routes/stockfish";

export default function TopVotes() {
  const [topVotes, setTopVotes] = useState<{ [key in string]: number }>({});
  const sortedTopVotes = Object.entries(topVotes);
  const totalVotes = sortedTopVotes.reduce((a, [, b]) => a + b, 0);
  sortedTopVotes.sort(([, valA], [, valB]) => valB - valA);

  useEffect(() => {
    const handleUpdateVotes = (votes: { [key in string]: number }) => {
      setTopVotes(votes);
    };

    const handleResetVotes = () => {
      setTopVotes({});
    };

    stockfishSocket.on("update-votes", handleUpdateVotes);
    stockfishSocket.on("reset-votes", handleResetVotes);

    return () => {
      stockfishSocket.off("update-votes", handleUpdateVotes);
      stockfishSocket.off("reset-votes", handleResetVotes);
    };
  }, []);

  return (
    <>
      <div className="flex h-full w-full flex-col items-center justify-start px-4">
        <h1 className="text-2xl">Votes</h1>
        <div className="custom-scroll h-auto w-full overflow-auto">
          <LayoutGroup>
            <ul className="max-h-auto mt-5 flex w-full flex-col gap-5">
              {sortedTopVotes.length > 0 ? (
                sortedTopVotes.map(([move, votes], idx) => {
                  return (
                    <AnimatePresence key={move}>
                      <motion.li
                        className="flex w-full gap-2 px-5"
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <span className="flex whitespace-nowrap">
                            <span className="w-[4ch] text-gray-400">
                              {idx + 1}.
                            </span>
                            <span className="w-[8ch] font-bold">{move}</span>
                          </span>
                        </div>
                        <motion.div
                          layout // animate width changes smoothly
                          initial={{ width: 0 }}
                          animate={{ width: `${(votes / totalVotes) * 100}%` }}
                          transition={{ duration: 0.5 }}
                          className="flex min-w-[12ch] items-center rounded-lg bg-blue-900 px-3"
                        >
                          <span>{votes} votes</span>
                        </motion.div>
                      </motion.li>
                    </AnimatePresence>
                  );
                })
              ) : (
                <span className="text-center">No votes cast yet</span>
              )}
            </ul>
          </LayoutGroup>
        </div>
      </div>
    </>
  );
}

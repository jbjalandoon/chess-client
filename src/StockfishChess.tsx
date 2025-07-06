import { useEffect, useRef, useState } from "react";
import { Chess, type Color } from "chess.js";
import { Chessboard, type PieceDropHandlerArgs } from "react-chessboard";
import Countdown from "./components/stockfish/Countdown";
import TopVotes from "./components/stockfish/TopVotes";
import Score from "./components/stockfish/Score";
import { stockfishSocket } from "./routes/stockfish";
import Online from "./components/stockfish/Online";
import { toast } from "react-toastify";

export default function StockfishChess() {
  const chessGameRef = useRef(new Chess("8/8/8/4k3/4K3/8/8/8 w - - 0 1"));
  const chessGame = chessGameRef.current;

  const [startVoting, setStartVoting] = useState(false);
  const [vote, setVote] = useState<null | string>(null);
  const [chessPosition, setChessPosition] = useState(chessGame.fen());
  const [pov, setPov] = useState<"black" | "white">("white");
  const [winner, setWinner] = useState<"black" | "white" | null>(null);
  const [isDraw, setIsDraw] = useState(false);
  const [customSquareStyles, setCustomSquareStyles] = useState({});

  useEffect(() => {
    const handleBoardUpdate = (move: string) => {
      chessGame.move(move);
      const history = chessGame.history({ verbose: true });
      const last = history[history.length - 1];

      const highlight: Record<string, React.CSSProperties> = {};

      highlight[last.to] = { backgroundColor: "rgba(255, 255, 0, 0.6)" };
      highlight[last.from] = { backgroundColor: "rgba(255, 255, 0, 0.6)" };
      setCustomSquareStyles(highlight);

      if (
        chessGame.isStalemate() ||
        chessGame.isThreefoldRepetition() ||
        chessGame.isDraw()
      ) {
        setIsDraw(true);
      }
      if (chessGame.isCheckmate()) {
        setWinner(chessGame.turn() === "w" ? "black" : "white");
      }
      setChessPosition(chessGame.fen());
    };

    stockfishSocket.on("board-update", handleBoardUpdate);
    return () => {
      stockfishSocket.off("board-update", handleBoardUpdate);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleSyncBoard = (
      fen: string,
      forVote: boolean,
      color: "white" | "black",
    ) => {
      chessGame.load(fen);
      setChessPosition(fen);
      setPov(color);
      if (forVote) {
        setStartVoting(true);
        setVote(null);
      }
    };

    const handleBoardReset = (color: Color) => {
      chessGame.reset();
      setChessPosition(chessGame.fen());
      setIsDraw(false);
      setWinner(null);
      setCustomSquareStyles({});
      setPov(color === "w" ? "white" : "black");
    };

    stockfishSocket.on("board-reset", handleBoardReset);
    stockfishSocket.on("sync-board", handleSyncBoard);

    return () => {
      stockfishSocket.off("sync-board", handleSyncBoard);
      stockfishSocket.off("board-reset", handleBoardReset);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function isLegal(fen: string, from: string, to: string) {
    const tmp = new Chess(fen); // clone current position
    const moveResult = tmp.move({ from, to });
    return moveResult !== null;
  }

  function onPieceDrop({ sourceSquare, targetSquare }: PieceDropHandlerArgs) {
    // type narrow targetSquare potentially being null (e.g. if dropped off board)
    if (!targetSquare) {
      return false;
    }

    if (!startVoting || vote) {
      toast.warn("Wait for your turn", {
        toastId: "warning",
      });
      return false;
    }

    // validate if valid move
    try {
      const allowed = isLegal(chessGame.fen(), sourceSquare, targetSquare);
      if (!allowed) {
        toast.warn("Invalid move", {
          toastId: "warning",
        });
        return false;
      }

      stockfishSocket.emit("vote", sourceSquare, targetSquare);
      setStartVoting(false);
      setVote(sourceSquare + "-" + targetSquare);

      const highlight: Record<string, React.CSSProperties> = {};
      highlight[sourceSquare] = { backgroundColor: "rgba(255, 255, 0, 0.6)" };
      highlight[targetSquare] = { backgroundColor: "rgba(255, 255, 0, 0.6)" };
      setCustomSquareStyles(highlight);
    } catch {
      toast.warn("Invalid move", {
        toastId: "warning",
      });
    } finally {
      // eslint-disable-next-line no-unsafe-finally
      return false;
    }
  }

  const chessboardOptions = {
    position: chessPosition,
    onPieceDrop,
    boardOrientation: pov,
    squareStyles: customSquareStyles,
    id: "internet-vs-stockfish",
  };

  return (
    <div className="bg flex h-full w-full flex-col items-center justify-center gap-1 lg:h-[80vh] lg:flex-row lg:gap-10">
      <Online />
      <div className="flex h-full w-fit scale-75 flex-row items-center justify-center rounded-2xl py-0 lg:h-full lg:w-80 lg:scale-100 lg:flex-col lg:justify-between lg:bg-black/10 lg:py-3 lg:shadow-xl lg:shadow-black">
        <Score />
        <Countdown
          vote={vote}
          setStartVoting={setStartVoting}
          setVote={setVote}
        />
        <div className="hidden h-1/2 lg:inline">
          <TopVotes />
        </div>
      </div>
      <div className="relative aspect-square max-h-[80vh]">
        {isDraw && (
          <div className="absolute z-999 flex h-full w-full items-center justify-center bg-black/80 text-center">
            <h1 className="text-3xl">DRAW</h1>
          </div>
        )}
        {winner != null && (
          <div className="absolute z-999 flex h-full w-full items-center justify-center bg-black/80 text-center">
            <h1 className="text-3xl">
              {winner === pov ? "Internet Won" : "Stockfish Won"}
            </h1>
          </div>
        )}
        <Chessboard options={chessboardOptions} />
      </div>
      <div className="mt-5 h-1/2 lg:hidden">
        <TopVotes />
      </div>
    </div>
  );
}

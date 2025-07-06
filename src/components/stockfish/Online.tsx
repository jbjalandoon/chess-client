import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { stockfishSocket } from "../../routes/stockfish";

export default function Online() {
  const [usersCount, setUsersCount] = useState(0);

  useEffect(() => {
    const handleUpdateUsersCount = (count: number) => {
      setUsersCount(count);
    };

    stockfishSocket.on("update-users-count", handleUpdateUsersCount);

    return () => {
      stockfishSocket.off("update-users-count", handleUpdateUsersCount);
    };
  }, []);

  return createPortal(
    <span className="font-lexend absolute top-0 right-0 hidden p-5 text-xl text-white md:inline-block">
      {usersCount} Online
    </span>,
    document.body,
  );
}

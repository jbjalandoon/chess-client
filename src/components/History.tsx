export default function History({ history }: { history: string[] }) {
  const rows = [];
  for (let i = 0; i < history.length; i += 2) {
    rows.push({
      move: i / 2 + 1,
      white: history[i],
      black: history[i + 1] || "",
    });
  }
  return (
    <>
      <div className="h-full w-full">
        <div className="grid-col-3 grid">
          {history.map((move, idx) => {
            return (
              <>
                <span>{idx + 1}.</span>
                <span>{move}.</span>
              </>
            );
          })}
        </div>
      </div>
    </>
  );
}

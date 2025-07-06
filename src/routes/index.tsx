import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col justify-start gap-5 text-4xl">
      <div
        onClick={() => {
          navigate({ to: "/stockfish" });
        }}
        className="relative flex cursor-pointer items-center justify-center gap-3 after:absolute after:-bottom-1 after:h-1 after:w-full after:scale-0 after:bg-white after:transition-transform after:duration-500 after:content-[''] hover:after:scale-100"
      >
        <span>STOCKFISH VS INTERNET</span>
      </div>
      <div
        onClick={() => {
          navigate({ to: "/internet" });
        }}
        className="relative flex cursor-pointer items-center justify-center gap-3 after:absolute after:-bottom-1 after:h-1 after:w-full after:scale-0 after:bg-white after:transition-transform after:duration-500 after:content-[''] hover:after:scale-100"
      >
        <span>INTERNET VS INTERNET</span>
      </div>
    </div>
  );
}

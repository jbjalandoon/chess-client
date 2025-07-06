import { createRootRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { createPortal } from "react-dom";
import { ToastContainer } from "react-toastify";

export const Route = createRootRoute({
  component: Root,
});

function Root() {
  const navigate = useNavigate();

  return (
    <div className="font-lexend flex min-h-screen min-w-screen flex-col items-center justify-start gap-10 py-3 text-white lg:justify-center">
      <div className="w-full">
        <h1
          className="cursor-pointer text-center text-3xl italic underline"
          onClick={() => {
            navigate({ to: "/" });
          }}
        >
          People's Gambit
        </h1>
      </div>
      {createPortal(
        <ToastContainer
          position="top-center"
          autoClose={1000}
          hideProgressBar={true}
          closeButton={false}
          newestOnTop={false}
          theme="dark"
        />,
        document.body,
      )}
      <Outlet />
    </div>
  );
}

import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 - PAGE NOT FOUND", location.pathname);
  }, [location.pathname]);

  return (
    <>
      <style>{`
        @keyframes shake {
          0% {
            transform: translateY(-10px);
          }
          50% {
            transform: translateY(10px);
          }
          100% {
            transform: translateY(-10px);
          }
        }
      `}</style>
      <a
        href="/"
        className="block bg-black min-h-screen flex items-center justify-center"
      >
        <img
          src="/enhancediamge.png"
          alt="Astronaut shaking"
          style={{
            width: "500px",
            height: "auto",
            animation: "shake 1s infinite",
          }}
          draggable={false}
          onContextMenu={(e) => e.preventDefault()}
          onDragStart={(e) => e.preventDefault()}
        />
      </a>
    </>
  );
};

export default NotFound;
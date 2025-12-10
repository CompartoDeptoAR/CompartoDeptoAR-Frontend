import React from "react";
import { useGlobalLoader } from "../../hooks/sistema/useGlobalLoader";
import emblema from "../../assets/digimon.svg";

const GlobalLoader: React.FC = () => {
  const { loading } = useGlobalLoader();

  if (!loading) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(255,255,255,0.8)",
        backdropFilter: "blur(3px)",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Loader con imagen */}
      <img
        src={emblema}
        alt="Cargando..."
        style={{
          width: "200px",
          height: "auto",
          animation: "rotate 1.5s linear infinite",
        }}
      />
      <p className="mt-3 text-secondary">Cargando...</p>

      {/* Animación embebida */}
      <style>{`
        @keyframes rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default GlobalLoader;

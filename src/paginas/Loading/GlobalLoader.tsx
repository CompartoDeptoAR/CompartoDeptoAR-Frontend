import React from "react";
import { useGlobalLoader } from "../../hooks/sistema/useGlobalLoader";

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
      <div className="spinner-border text-primary" style={{ width: "3rem", height: "3rem" }} role="status">
        <span className="visually-hidden">Loading...</span>
      </div>

      <p className="mt-3 text-secondary">Cargando...</p>
    </div>
  );
};

export default GlobalLoader;

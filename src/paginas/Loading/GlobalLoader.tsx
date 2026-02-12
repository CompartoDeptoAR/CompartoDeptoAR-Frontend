import React from "react";
import { motion } from "framer-motion";
import { useGlobalLoader } from "../../hooks/sistema/useGlobalLoader";

const GlobalLoader: React.FC = () => {
  const { loading } = useGlobalLoader();

  if (!loading) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(4px)",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "30px",
      }}
    >
 
      <motion.svg
        width="60"
        height="60"
        viewBox="0 0 60 60"
        fill="none"
        animate={{ y: [-4, 0] }}
        transition={{
          repeat: Infinity,
          repeatType: "reverse",
          duration: 1.5,
        }}
      >

        <path
          d="M30 10 L50 30 L45 30 L45 45 L15 45 L15 30 L10 30 Z"
          stroke="#3b82f6"
          strokeWidth="2"
          fill="none"
        />
        {/* Puerta */}
        <rect x="26" y="35" width="8" height="10" stroke="#3b82f6" strokeWidth="2" fill="none" />
        {/* Ventana */}
        <rect x="18" y="25" width="8" height="8" stroke="#3b82f6" strokeWidth="1.5" fill="none" />
      </motion.svg>


      <div style={{ display: "flex", gap: "12px" }}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            style={{
              width: "10px",
              height: "10px",
              background: "#3b82f6",
              borderRadius: "50%",
            }}
            animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
            transition={{
              repeat: Infinity,
              duration: 1.2,
              delay: i * 0.15,
            }}
          />
        ))}
      </div>


      <motion.p
        style={{
          fontSize: "16px",
          fontWeight: 500,
          color: "#6b7280",
          margin: 0,
        }}
        initial={{ opacity: 0.4 }}
        animate={{ opacity: 1 }}
        transition={{
          repeat: Infinity,
          repeatType: "reverse",
          duration: 1.2,
        }}
      >
        Buscando compañeros ideales...
      </motion.p>
    </div>
  );
};

export default GlobalLoader;
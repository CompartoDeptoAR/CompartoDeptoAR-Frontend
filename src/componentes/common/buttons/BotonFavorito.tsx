import React from "react";

interface BotonFavoritoProps {
  esFavorito: boolean;
  onToggle: () => void;
  className?: string;
  size?: "sm" | "md";
}

function BotonFavorito({
  esFavorito,
  onToggle,
  className = "",
  size = "md",
}: BotonFavoritoProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggle();
  };

  const sizeMap = {
    sm: "1.5rem",
    md: "2rem",
  };

  return (
    <button
      type="button"
      style={{
        background: "none",
        border: "none",
        padding: "0",
        margin: "0",
        cursor: "pointer",
        fontSize: sizeMap[size],
        lineHeight: "1",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "transform 0.2s ease",
        minWidth: "auto",
        minHeight: "auto",
        width: "auto",
        height: "auto",
      }}
      onClick={handleClick}
      className={className}
      aria-label={esFavorito ? "Sacar de favoritos" : "Agregar a favoritos"}
    >
      {esFavorito ? "❤️" : "🤍"}
    </button>
  );
}

export default BotonFavorito;
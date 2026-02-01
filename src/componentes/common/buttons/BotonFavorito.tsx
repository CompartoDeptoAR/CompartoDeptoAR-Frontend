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

  return (
    <button
      type="button"
      className={`btn btn-light boton-favorito boton-favorito--${size} ${className}`}
      onClick={handleClick}
      aria-label={esFavorito ? "Quitar de favoritos" : "Agregar a favoritos"}
    >
      {esFavorito ? "❤️" : "🤍"}
    </button>
  );
}

export default BotonFavorito;

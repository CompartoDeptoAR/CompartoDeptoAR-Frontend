import React, { useEffect, useState } from "react";

import type { PublicacionResumida } from "../../../modelos/Publicacion";
import { useToast } from "../../../hooks/useToast";
import apiPublicacion from "../../../api/endpoints/publicaciones";
import ListarPublicaciones from "../../../componentes/Publicacion/ListarPublicacion/ListarPublicacion";
import ToastNotification from "../../../componentes/ToastNotification/ToastNotification";


const MisFavoritos: React.FC = () => {
  const [publicaciones, setPublicaciones] = useState<PublicacionResumida[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [favoritos, setFavoritos] = useState<string[]>([]);

  const { toast, showSuccess, showError, hideToast } = useToast();

  useEffect(() => {
    cargarFavoritos();
  }, []);

  const cargarFavoritos = async () => {
    setLoading(true);
    setError("");

    try {
      // Obtener IDs de favoritos desde localStorage
      const favoritosGuardados = localStorage.getItem("favoritos");
      
      if (!favoritosGuardados) {
        setPublicaciones([]);
        setFavoritos([]);
        setLoading(false);
        return;
      }

      const favoritosIds: string[] = JSON.parse(favoritosGuardados);
      setFavoritos(favoritosIds);

      if (favoritosIds.length === 0) {
        setPublicaciones([]);
        setLoading(false);
        return;
      }

      // Cargar cada publicación individualmente
      const promesas = favoritosIds.map((id) =>
        apiPublicacion.publicacion.obtener(id)
          .catch((err) => {
            console.error(`Error al cargar publicación ${id}:`, err);
            return null;
          })
      );

      const resultados = await Promise.all(promesas);
      const publicacionesValidas = resultados.filter(
        (pub): pub is PublicacionResumida => pub !== null
      );

      setPublicaciones(publicacionesValidas);

      // Si algunas publicaciones no existen, actualizar favoritos
      if (publicacionesValidas.length !== favoritosIds.length) {
        const idsValidos = publicacionesValidas.map((pub) => pub.id);
        setFavoritos(idsValidos);
        localStorage.setItem("favoritos", JSON.stringify(idsValidos));
        
        const eliminadas = favoritosIds.length - publicacionesValidas.length;
        if (eliminadas > 0) {
          showError(
            `⚠️ ${eliminadas} publicación${eliminadas > 1 ? "es" : ""} ya no ${eliminadas > 1 ? "están" : "está"} disponible${eliminadas > 1 ? "s" : ""}`
          );
        }
      }
    } catch (err: any) {
      console.error("Error al cargar favoritos:", err);
      setError(err.message || "Error al cargar tus favoritos");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = (id: string) => {
    // Eliminar de favoritos
    const nuevosFavoritos = favoritos.filter((fav) => fav !== id);
    setFavoritos(nuevosFavoritos);
    localStorage.setItem("favoritos", JSON.stringify(nuevosFavoritos));

    // Eliminar de la lista visual
    setPublicaciones((prev) => prev.filter((pub) => pub.id !== id));

    showSuccess("💔 Eliminado de favoritos");
  };

  const handleLimpiarTodo = () => {
    const confirmar = window.confirm(
      `¿Estás seguro de que deseas eliminar todos tus ${favoritos.length} favoritos? Esta acción no se puede deshacer.`
    );

    if (!confirmar) return;

    setFavoritos([]);
    setPublicaciones([]);
    localStorage.removeItem("favoritos");
    showSuccess("🗑️ Todos los favoritos han sido eliminados");
  };



  return (
    <>
      <div className="container mt-4 mb-5">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
          <div>
            <h2 className="mb-1">❤️ Mis Favoritos</h2>
            <p className="text-muted mb-0">
              {loading
                ? "Cargando..."
                : publicaciones.length === 0
                ? "No tienes favoritos guardados"
                : `${publicaciones.length} publicación${publicaciones.length !== 1 ? "es" : ""} guardada${publicaciones.length !== 1 ? "s" : ""}`}
            </p>
          </div>
          <div className="d-flex gap-2">
            {publicaciones.length > 0 && (
              <button
                className="btn btn-outline-danger"
                onClick={handleLimpiarTodo}
              >
                🗑️ Limpiar todo
              </button>
            )}
            
          </div>
        </div>

        <ListarPublicaciones
          publicaciones={publicaciones}
          loading={loading}
          error={error}
          emptyMessage="Aún no tienes favoritos. ¡Explora publicaciones y guarda las que te gusten!"
          showActions={false}
          onToggleFavorite={handleToggleFavorite}
          favoriteIds={favoritos}
        />
      </div>

      <ToastNotification
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={hideToast}
      />
    </>
  );
};

export default MisFavoritos;
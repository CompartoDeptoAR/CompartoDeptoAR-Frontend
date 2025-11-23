import React, { useEffect, useState } from "react";
import type { PublicacionResumida } from "../../modelos/Publicacion";
import { useToast } from "../../hooks/useToast";
import apiPublicacion from "../../api/endpoints/publicaciones";
import MiniListarPublicaciones from "../../componentes/Publicacion/ListarPublicacion/MiniListarPublicaciones";

type TipoListado = "publicaciones" | "favoritos";

const Configuracion: React.FC = () => {
  const [tipoListado, setTipoListado] = useState<TipoListado>("publicaciones");
  const [misPublicaciones, setMisPublicaciones] = useState<PublicacionResumida[]>([]);
  const [misFavoritos, setMisFavoritos] = useState<PublicacionResumida[]>([]);
  const [favoritosIds, setFavoritosIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { showError, showSuccess } = useToast();

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      // Mis Publicaciones
      const publicacionesData = await apiPublicacion.publicacion.misPublicaciones();
      const publicacionesResumidas: PublicacionResumida[] = publicacionesData.map((pub: any) => ({
        id: pub.id,
        titulo: pub.titulo,
        precio: pub.precio,
        foto: Array.isArray(pub.foto) && pub.foto.length > 0 ? pub.foto[0] : pub.foto || null,
        estado: pub.estado || "activa",
        createdAt: pub.createdAt || new Date().toISOString(),
      }));
      setMisPublicaciones(publicacionesResumidas);

      // Mis Favoritos
      const favGuardados = localStorage.getItem("favoritos");
      if (favGuardados) {
        const favIds: string[] = JSON.parse(favGuardados);
        setFavoritosIds(favIds);

        const promesas = favIds.map((id) =>
          apiPublicacion.publicacion.obtener(id)
            .then((pub: any) => ({
              id: pub.id,
              titulo: pub.titulo,
              precio: pub.precio,
              foto: Array.isArray(pub.foto) && pub.foto.length > 0 ? pub.foto[0] : pub.foto || null,
              estado: pub.estado || "activa",
              createdAt: pub.createdAt || new Date().toISOString(),
            }))
            .catch(() => null)
        );
        const resultados = await Promise.all(promesas);
        setMisFavoritos(resultados.filter(Boolean) as PublicacionResumida[]);
      }
    } catch (err: any) {
      console.error(err);
      showError("Error al cargar publicaciones y favoritos");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = (id: string) => {
    const nuevosFavoritos = favoritosIds.includes(id)
      ? favoritosIds.filter((f) => f !== id)
      : [...favoritosIds, id];

    setFavoritosIds(nuevosFavoritos);
    localStorage.setItem("favoritos", JSON.stringify(nuevosFavoritos));
    showSuccess(favoritosIds.includes(id) ? "💔 Eliminado de favoritos" : "❤️ Agregado a favoritos");
  };

  return (
    <div className="container mt-4 mb-5">
      <h2>Configuración del Home</h2>

      <div className="mb-3">
        <label className="form-label me-3">Mostrar listado:</label>
        <div className="form-check form-check-inline">
          <input
            className="form-check-input"
            type="radio"
            name="tipoListado"
            id="radioPublicaciones"
            checked={tipoListado === "publicaciones"}
            onChange={() => setTipoListado("publicaciones")}
          />
          <label className="form-check-label" htmlFor="radioPublicaciones">
            Mis Publicaciones
          </label>
        </div>
        <div className="form-check form-check-inline">
          <input
            className="form-check-input"
            type="radio"
            name="tipoListado"
            id="radioFavoritos"
            checked={tipoListado === "favoritos"}
            onChange={() => setTipoListado("favoritos")}
          />
          <label className="form-check-label" htmlFor="radioFavoritos">
            Mis Favoritos
          </label>
        </div>
      </div>

      {loading ? (
        <p>Cargando...</p>
      ) : tipoListado === "publicaciones" ? (
        <MiniListarPublicaciones publicaciones={misPublicaciones} />
      ) : (
        <MiniListarPublicaciones
          publicaciones={misFavoritos}
          favoriteIds={favoritosIds}
          onToggleFavorite={handleToggleFavorite}
        />
      )}
    </div>
  );
};

export default Configuracion;

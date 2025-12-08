import React, { useEffect, useState } from "react";
import type { PublicacionResumida } from "../../modelos/Publicacion";
import { useToast } from "../../hooks/useToast";
import apiPublicacion from "../../api/endpoints/publicaciones";
import apiUsuario from "../../api/endpoints/usuario";
import { TokenService } from "../../services/auth/tokenService";
import { Navegar } from "../../navigation/navigationService";
import MiniListarPublicaciones from "../../componentes/Publicacion/ListarPublicacion/MiniListarPublicaciones";
import { Modal, Button, Alert } from "react-bootstrap";
import { Trash2, AlertTriangle } from "lucide-react";

type TipoListado = "publicaciones" | "favoritos";

const Configuracion: React.FC = () => {
  const [tipoListado, setTipoListado] = useState<TipoListado>("publicaciones");
  const [misPublicaciones, setMisPublicaciones] = useState<PublicacionResumida[]>([]);
  const [misFavoritos, setMisFavoritos] = useState<PublicacionResumida[]>([]);
  const [favoritosIds, setFavoritosIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModalEliminar, setShowModalEliminar] = useState(false);
  const [confirmacionTexto, setConfirmacionTexto] = useState("");
  const [eliminando, setEliminando] = useState(false);
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
        foto:
          Array.isArray(pub.foto) && pub.foto.length > 0
            ? pub.foto[0]
            : pub.foto || null,
        estado: pub.estado || "activa",
        ubicacion:
          pub.localidad && pub.provincia
            ? `${pub.localidad}, ${pub.provincia}`
            : "",
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
              foto:
                Array.isArray(pub.foto) && pub.foto.length > 0
                  ? pub.foto[0]
                  : pub.foto || null,
              estado: pub.estado || "activa",
              ubicacion:
                pub.localidad && pub.provincia
                  ? `${pub.localidad}, ${pub.provincia}`
                  : "",
              createdAt: pub.createdAt || new Date().toISOString(),
            }))
            .catch(() => null)
        );

        const resultados = await Promise.all(promesas);
        setMisFavoritos(
          resultados.filter((r) => r !== null) as PublicacionResumida[]
        );
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
    showSuccess(
      favoritosIds.includes(id)
        ? "💔 Eliminado de favoritos"
        : "❤️ Agregado a favoritos"
    );
  };

  const handleEliminarCuenta = async () => {
    if (confirmacionTexto !== "ELIMINAR") {
      showError("Debes escribir ELIMINAR para confirmar");
      return;
    }

    setEliminando(true);
    try {
      await apiUsuario.usuario.eliminarMiCuenta();
      
      localStorage.removeItem("favoritos");
      localStorage.clear();
      
      showSuccess("Tu cuenta ha sido eliminada exitosamente");
      
      // Redirigir al home después de un breve delay
      setTimeout(() => {
        Navegar.home();
        window.location.reload();
      }, 1500);
      
    } catch (error: any) {
      console.error("Error al eliminar cuenta:", error);
      showError(error.message || "Error al eliminar la cuenta");
      setEliminando(false);
    }
  };

  const abrirModalEliminar = () => {
    setConfirmacionTexto("");
    setShowModalEliminar(true);
  };

  const cerrarModalEliminar = () => {
    if (!eliminando) {
      setShowModalEliminar(false);
      setConfirmacionTexto("");
    }
  };

  return (
    <div className="container mt-4 mb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Configuración del Home</h2>
      </div>

      <div className="mb-4">
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

      {/* Zona de Peligro */}
      <div className="mt-5 pt-4 border-top">
        <div className="card border-danger">
          <div className="card-header bg-danger text-white">
            <h5 className="mb-0 d-flex align-items-center">
              <AlertTriangle size={20} className="me-2" />
              Zona de Peligro
            </h5>
          </div>
          <div className="card-body">
            <h6 className="card-title">Eliminar Cuenta</h6>
            <p className="card-text text-muted mb-3">
              Esta acción eliminará permanentemente tu cuenta y todas tus publicaciones. 
              No podrás recuperar tu información.
            </p>
            <Button 
              variant="danger" 
              onClick={abrirModalEliminar}
              className="d-flex align-items-center"
            >
              <Trash2 size={18} className="me-2" />
              Eliminar mi cuenta
            </Button>
          </div>
        </div>
      </div>

      {/* Modal de Confirmación */}
      <Modal 
        show={showModalEliminar} 
        onHide={cerrarModalEliminar}
        backdrop={eliminando ? "static" : true}
        keyboard={!eliminando}
      >
        <Modal.Header closeButton={!eliminando}>
          <Modal.Title className="text-danger d-flex align-items-center">
            <AlertTriangle size={24} className="me-2" />
            ¿Eliminar tu cuenta?
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="danger">
            <strong>⚠️ Esta acción es permanente e irreversible</strong>
          </Alert>
          
          <p>Se eliminarán permanentemente:</p>
          <ul>
            <li>Tu perfil y datos personales</li>
            <li>Todas tus publicaciones ({misPublicaciones.length})</li>
            <li>Tus mensajes y conversaciones</li>
            <li>Tus favoritos y preferencias</li>
          </ul>

          <p className="mt-3 mb-2">
            Para confirmar, escribe <strong>ELIMINAR</strong> en el campo a continuación:
          </p>
          <input
            type="text"
            className="form-control"
            placeholder="Escribe ELIMINAR"
            value={confirmacionTexto}
            onChange={(e) => setConfirmacionTexto(e.target.value)}
            disabled={eliminando}
            autoFocus
          />
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={cerrarModalEliminar}
            disabled={eliminando}
          >
            Cancelar
          </Button>
          <Button 
            variant="danger" 
            onClick={handleEliminarCuenta}
            disabled={confirmacionTexto !== "ELIMINAR" || eliminando}
          >
            {eliminando ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                Eliminando...
              </>
            ) : (
              <>
                <Trash2 size={18} className="me-2" />
                Eliminar mi cuenta
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Configuracion;
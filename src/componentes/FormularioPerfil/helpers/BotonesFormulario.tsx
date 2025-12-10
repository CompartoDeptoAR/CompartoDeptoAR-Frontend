import { useState } from "react";
import { Modal, Button, Alert } from "react-bootstrap";
import { Trash2, AlertTriangle } from "lucide-react";
import { Navegar } from "../../../navigation/navigationService";
import apiUsuario from "../../../api/endpoints/usuario";
import { useToast } from "../../../hooks/useToast";

interface BotonesFormularioProps {
  modo: "view" | "editar" | "verOtro";
}

const BotonesFormulario: React.FC<BotonesFormularioProps> = ({ modo }) => {
  const [showModalEliminar, setShowModalEliminar] = useState(false);
  const [confirmacionTexto, setConfirmacionTexto] = useState("");
  const [eliminando, setEliminando] = useState(false);
  const { showError, showSuccess } = useToast();

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

  if (modo === "view") {
    return (
      <>
        <div className="mt-3 d-flex justify-content-between align-items-center flex-wrap gap-2">
          <button 
            type="button" 
            className="btn btn-primary" 
            onClick={() => Navegar.editarPerfil()}
          >
            Editar Perfil
          </button>
          
          <button
            type="button"
            className="btn btn-outline-danger d-flex align-items-center gap-2"
            onClick={abrirModalEliminar}
          >
            <Trash2 size={18} />
            <span className="d-none d-md-inline">Eliminar cuenta</span>
            <span className="d-inline d-md-none">Eliminar</span>
          </button>
        </div>

        {/* Modal de Confirmación */}
        <Modal 
          show={showModalEliminar} 
          onHide={cerrarModalEliminar}
          backdrop={eliminando ? "static" : true}
          keyboard={!eliminando}
          centered
        >
          <Modal.Header closeButton={!eliminando}>
            <Modal.Title className="text-danger d-flex align-items-center gap-2">
              <AlertTriangle size={24} />
              ¿Eliminar tu cuenta?
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Alert variant="danger" className="mb-3">
              <strong>⚠️ Esta acción es permanente e irreversible</strong>
            </Alert>
            
            <p className="mb-2">Se eliminarán permanentemente:</p>
            <ul className="mb-3">
              <li>Tu perfil y datos personales</li>
              <li>Todas tus publicaciones</li>
              <li>Tus mensajes y conversaciones</li>
              <li>Tus favoritos y preferencias</li>
            </ul>

            <p className="mb-2">
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
              className="d-flex align-items-center gap-2"
            >
              {eliminando ? (
                <>
                  <span className="spinner-border spinner-border-sm" />
                  Eliminando...
                </>
              ) : (
                <>
                  <Trash2 size={18} />
                  Eliminar mi cuenta
                </>
              )}
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }

  if (modo === "editar") {
    return (
      <div className="mt-3 d-flex justify-content-between">
        <button type="submit" className="btn btn-success">
          Guardar Cambios
        </button>
        <button 
          type="button" 
          className="btn btn-secondary" 
          onClick={() => Navegar.volverAtras()}
        >
          Cancelar
        </button>
      </div>
    );
  }

  if (modo === "verOtro") {
    return (
      <div className="mt-3 d-flex justify-content-between">
        <button 
          type="button" 
          className="btn btn-outline-secondary" 
          onClick={() => Navegar.volverAtras()}
        >
          Volver
        </button>
      </div>
    );
  }

  return null;
};

export default BotonesFormulario;
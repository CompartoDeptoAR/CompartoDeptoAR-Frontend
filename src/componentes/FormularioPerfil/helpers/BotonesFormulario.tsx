import { useState } from "react";
import { Modal, Button, Alert } from "react-bootstrap";
import { Trash2, AlertTriangle } from "lucide-react";
import { Navegar } from "../../../navigation/navigationService";
import apiUsuario from "../../../services/api/endpoints/usuario";
import { useToast } from "../../../hooks/useToast";

import "@/styles/BotonesFormulario.css";
import { BotonVolver } from "@/componentes/common/buttons";

interface BotonesFormularioProps {
  modo: "view" | "editar" | "verOtro";
  isMobile?: boolean;
}

const BotonesFormulario: React.FC<BotonesFormularioProps> = ({
  modo,
  isMobile = false,
}) => {
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
      localStorage.clear();
      showSuccess("Tu cuenta ha sido eliminada exitosamente");

      setTimeout(() => {
        Navegar.home();
        window.location.reload();
      }, 1500);
    } catch (error: any) {
      showError(error.message || "Error al eliminar la cuenta");
      setEliminando(false);
    }
  };

  /* ===================== VIEW ===================== */
  if (modo === "view") {
    return (
      <>
        <div className={`botones-formulario ${isMobile ? "mobile" : ""}`}>
          <button
            type="button"
            className="btn btn-primary boton-form"
            onClick={Navegar.editarPerfil}
          >
            ✏️ {isMobile ? "Editar" : "Editar Perfil"}
          </button>

          <button
            type="button"
            className="btn btn-outline-danger boton-form"
            onClick={abrirModalEliminar}
          >
            <Trash2 size={isMobile ? 16 : 18} />
            Eliminar cuenta
          </button>
        </div>

        {/* MODAL */}
        <Modal
          show={showModalEliminar}
          onHide={cerrarModalEliminar}
          backdrop={eliminando ? "static" : true}
          keyboard={!eliminando}
          centered
          size={isMobile ? "sm" : "lg"}
        >
          <Modal.Header closeButton={!eliminando}>
            <Modal.Title className="modal-title-danger">
              <AlertTriangle size={20} />
              ¿Eliminar tu cuenta?
            </Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Alert variant="danger">
              <strong>⚠️ Esta acción es permanente e irreversible</strong>
            </Alert>

            <p>Para confirmar, escribe <strong>ELIMINAR</strong>:</p>

            <input
              type="text"
              className={`form-control input-confirmacion ${isMobile ? "mobile" : ""}`}
              value={confirmacionTexto}
              onChange={(e) => setConfirmacionTexto(e.target.value)}
              disabled={eliminando}
            />
          </Modal.Body>

          <Modal.Footer
            className={`modal-footer-responsive ${isMobile ? "mobile" : ""}`}
          >
            {/* 🔁 BOTÓN VOLVER */}
            <BotonVolver disabled={eliminando} />

            <Button
              variant="danger"
              onClick={handleEliminarCuenta}
              disabled={confirmacionTexto !== "ELIMINAR" || eliminando}
            >
              {eliminando ? "Eliminando..." : "Eliminar mi cuenta"}
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }

  /* ===================== EDITAR ===================== */
  if (modo === "editar") {
    return (
      <div className={`botones-formulario ${isMobile ? "mobile" : ""}`}>
        <button type="submit" className="btn btn-success boton-form boton-guardar">
          💾 Guardar Cambios
        </button>

        {/* Cancelar */}
        <BotonVolver className="btn btn-cancel boton-form boton-cancelar" texto="❌ Cancelar"/>
      </div>
    );
  }

  return null;
};

export default BotonesFormulario;

import { useState } from "react";
import { Modal, Button, Alert } from "react-bootstrap";
import { Trash2, AlertTriangle } from "lucide-react";
import { Navegar } from "../../../navigation/navigationService";
import apiUsuario from "../../../api/endpoints/usuario";
import { TokenService } from "../../../services/auth/tokenService";
import { useToast } from "../../../hooks/useToast";

interface BotonesFormularioProps {
  modo: "view" | "editar" | "verOtro";
  isMobile?: boolean; // Nueva prop para responsive
}

const BotonesFormulario: React.FC<BotonesFormularioProps> = ({ modo, isMobile = false }) => {
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

  if (modo === "view") {
    return (
      <>
        <div style={{ 
          marginTop: isMobile ? "20px" : "25px",
          display: "flex", 
          flexDirection: isMobile ? "column" : "row",
          gap: isMobile ? "12px" : "15px",
          alignItems: isMobile ? "stretch" : "center"
        }}>
          <button 
            type="button" 
            className="btn btn-primary" 
            onClick={() => Navegar.editarPerfil()}
            style={{
              padding: isMobile ? "12px 20px" : "12px 25px",
              fontSize: isMobile ? "15px" : "16px",
              borderRadius: "6px",
              flex: isMobile ? "1" : "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px"
            }}
          >
            <span>✏️</span>
            <span>{isMobile ? "Editar" : "Editar Perfil"}</span>
          </button>
          
          <button
            type="button"
            className="btn btn-outline-danger"
            onClick={abrirModalEliminar}
            style={{
              padding: isMobile ? "12px 20px" : "12px 25px",
              fontSize: isMobile ? "15px" : "16px",
              borderRadius: "6px",
              flex: isMobile ? "1" : "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px"
            }}
          >
            <Trash2 size={isMobile ? 16 : 18} />
            <span>{isMobile ? "Eliminar Cuenta" : "Eliminar cuenta"}</span>
          </button>
        </div>

        {/* Modal de Confirmación - Responsive */}
        <Modal 
          show={showModalEliminar} 
          onHide={cerrarModalEliminar}
          backdrop={eliminando ? "static" : true}
          keyboard={!eliminando}
          centered
          size={isMobile ? "sm" : "lg"}
          dialogClassName={isMobile ? "m-2" : ""}
        >
          <Modal.Header closeButton={!eliminando} style={{ 
            padding: isMobile ? "15px" : "20px",
            borderBottom: "1px solid #dee2e6"
          }}>
            <Modal.Title style={{ 
              fontSize: isMobile ? "18px" : "20px",
              color: "#dc3545",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontWeight: "600"
            }}>
              <AlertTriangle size={isMobile ? 20 : 24} />
              {isMobile ? "Eliminar cuenta" : "¿Eliminar tu cuenta?"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ padding: isMobile ? "15px" : "20px" }}>
            <Alert variant="danger" style={{ 
              marginBottom: "15px",
              padding: isMobile ? "10px" : "12px",
              fontSize: isMobile ? "14px" : "15px"
            }}>
              <strong>⚠️ Esta acción es permanente e irreversible</strong>
            </Alert>
            
            <div style={{ 
              fontSize: isMobile ? "14px" : "15px",
              color: "#495057",
              marginBottom: "15px"
            }}>
              <p style={{ marginBottom: "10px", fontWeight: "500" }}>
                Se eliminarán permanentemente:
              </p>
              <ul style={{ 
                paddingLeft: "20px", 
                marginBottom: "15px",
                listStyleType: "disc"
              }}>
                <li>Tu perfil y datos personales</li>
                <li>Todas tus publicaciones</li>
                <li>Tus mensajes y conversaciones</li>
                <li>Tus favoritos y preferencias</li>
              </ul>

              <p style={{ marginBottom: "10px" }}>
                Para confirmar, escribe <strong>ELIMINAR</strong>:
              </p>
            </div>
            
            <input
              type="text"
              className="form-control"
              placeholder={isMobile ? "Escribe: ELIMINAR" : "Escribe ELIMINAR"}
              value={confirmacionTexto}
              onChange={(e) => setConfirmacionTexto(e.target.value)}
              disabled={eliminando}
              autoFocus
              style={{
                padding: isMobile ? "10px" : "12px",
                fontSize: isMobile ? "14px" : "15px",
                border: "1px solid #dc3545",
                borderRadius: "6px"
              }}
            />
          </Modal.Body>
          <Modal.Footer style={{ 
            padding: isMobile ? "15px" : "20px",
            borderTop: "1px solid #dee2e6",
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            gap: isMobile ? "10px" : "10px"
          }}>
            <Button 
              variant="secondary" 
              onClick={cerrarModalEliminar}
              disabled={eliminando}
              style={{
                padding: isMobile ? "10px 20px" : "10px 20px",
                fontSize: isMobile ? "14px" : "15px",
                borderRadius: "6px",
                flex: isMobile ? "1" : "none",
                width: isMobile ? "100%" : "auto"
              }}
            >
              Cancelar
            </Button>
            <Button 
              variant="danger" 
              onClick={handleEliminarCuenta}
              disabled={confirmacionTexto !== "ELIMINAR" || eliminando}
              style={{
                padding: isMobile ? "10px 20px" : "10px 20px",
                fontSize: isMobile ? "14px" : "15px",
                borderRadius: "6px",
                flex: isMobile ? "1" : "none",
                width: isMobile ? "100%" : "auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px"
              }}
            >
              {eliminando ? (
                <>
                  <span 
                    className="spinner-border spinner-border-sm" 
                    style={{ width: "14px", height: "14px" }}
                  />
                  <span>{isMobile ? "Eliminando..." : "Eliminando..."}</span>
                </>
              ) : (
                <>
                  <Trash2 size={isMobile ? 16 : 18} />
                  <span>{isMobile ? "Eliminar cuenta" : "Eliminar mi cuenta"}</span>
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
      <div style={{ 
        marginTop: isMobile ? "20px" : "25px",
        display: "flex", 
        flexDirection: isMobile ? "column" : "row",
        gap: isMobile ? "12px" : "15px",
        alignItems: isMobile ? "stretch" : "center"
      }}>
        <button 
          type="submit" 
          className="btn btn-success"
          style={{
            padding: isMobile ? "12px 20px" : "14px 30px",
            fontSize: isMobile ? "15px" : "16px",
            borderRadius: "6px",
            flex: isMobile ? "1" : "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            fontWeight: "600"
          }}
        >
          <span>💾</span>
          <span>{isMobile ? "Guardar" : "Guardar Cambios"}</span>
        </button>
        <button 
          type="button" 
          className="btn btn-secondary"
          onClick={() => Navegar.volverAtras()}
          style={{
            padding: isMobile ? "12px 20px" : "14px 30px",
            fontSize: isMobile ? "15px" : "16px",
            borderRadius: "6px",
            flex: isMobile ? "1" : "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px"
          }}
        >
          <span>❌</span>
          <span>{isMobile ? "Cancelar" : "Cancelar"}</span>
        </button>
      </div>
    );
  }

  if (modo === "verOtro") {
    return (
      <div style={{ 
        marginTop: isMobile ? "20px" : "25px",
        display: "flex",
        justifyContent: "center"
      }}>
        <button 
          type="button" 
          className="btn btn-outline-secondary"
          onClick={() => Navegar.volverAtras()}
          style={{
            padding: isMobile ? "12px 30px" : "12px 40px",
            fontSize: isMobile ? "15px" : "16px",
            borderRadius: "6px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px"
          }}
        >
          <span>←</span>
          <span>Volver</span>
        </button>
      </div>
    );
  }

  return null;
};

export default BotonesFormulario;
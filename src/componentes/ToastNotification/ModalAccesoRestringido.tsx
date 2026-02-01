import "@/styles/interno/modalAccesoRestringido.css";
import imagen from "@/assets/accion_restringida.svg";
interface ModalAccesoRestringidoProps {
  visible: boolean;
  onLogin: () => void;
  onClose: () => void;
}

export const ModalAccesoRestringido: React.FC<ModalAccesoRestringidoProps> = ({
  visible,
  onLogin,
  onClose,
}) => {
  if (!visible) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-restringido">
        <img
          src={imagen}
          alt="Acción restringida"
          className="modal-robot-img"
        />

        <h2>Acción restringida</h2>
        <p>Solo para usuarios registrados</p>

        <div className="modal-actions">
          <button className="btn-login" onClick={onLogin}>
            Iniciar sesión
          </button>

          <button className="btn-cancelar" onClick={onClose}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

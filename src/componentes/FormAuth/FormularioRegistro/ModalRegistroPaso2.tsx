import { createPortal } from "react-dom";
import "./ModalRegistroPaso2.css";

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
}

const ModalRegistroPaso2: React.FC<ModalProps> = ({ children, onClose }) => {
  const modalRoot = document.getElementById("modal-root");

  if (!modalRoot) return null;

  return createPortal(
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-card">
        <button
          className="modal-close"
          onClick={onClose}
          aria-label="Cerrar"
        >
          ✕
        </button>
        {children}
      </div>
    </div>,
    modalRoot
  );
};

export default ModalRegistroPaso2;

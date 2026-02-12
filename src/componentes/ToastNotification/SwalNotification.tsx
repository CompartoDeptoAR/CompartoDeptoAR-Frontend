import { useEffect } from "react";
import Swal from "sweetalert2";

export type SwalType = "success" | "error" | "info" | "warning" | "loading";

interface SwalNotificationProps {
  show: boolean;
  type: SwalType;
  message: string;
  onClose?: () => void;
}

const SwalNotification: React.FC<SwalNotificationProps> = ({
  show,
  type,
  message,
  onClose,
}) => {
  useEffect(() => {
    if (!show) return;

    if (type === "loading") {
      Swal.fire({
        title: "Procesando...",
        text: message,
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      return;
    }

    // 🔥 cerrar loading si estaba abierto
    Swal.close();

    Swal.fire({
      icon: type as any,
      title:
        type === "success"
          ? "¡Registro exitoso!"
          : type === "error"
          ? "Error"
          : "Información",
      text: message,
      confirmButtonColor: "#6366f1",
    }).then(() => {
      if (onClose) onClose();
    });

  }, [show, type, message, onClose]);

  return null;
};

export default SwalNotification;
       
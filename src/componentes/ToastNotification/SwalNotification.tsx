import { useEffect } from "react";
import Swal from "sweetalert2";

export type SwalType = "success" | "error" | "info" | "warning" | "loading";

interface SwalNotificationProps {
  show: boolean;
  type: SwalType;
  message: string;
  title?: string;
  imageUrl?: string;
  onClose?: () => void;
}


const SwalNotification: React.FC<SwalNotificationProps> = ({
  show,
  type,
  message,
  title,
  imageUrl,
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

    Swal.close();

    Swal.fire({
      icon: imageUrl ? undefined : (type as any),
      title:
        title ||
        (type === "success"
          ? "Operación exitosa"
          : type === "error"
          ? "Error"
          : "Información"),
      text: message,
      imageUrl,
      imageWidth: 120,
      imageHeight: 120,
      confirmButtonColor: "#6366f1",
    }).then(() => {
      onClose?.();
    });

  }, [show, type, message, onClose]);

  return null;
};

export default SwalNotification;
       
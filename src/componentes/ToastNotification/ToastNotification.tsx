import React, { useEffect } from "react";

export type ToastType = "success" | "error" | "info" | "warning";

interface ToastNotificationProps {
  show: boolean;
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
}

const ToastNotification: React.FC<ToastNotificationProps> = ({
  show,
  message,
  type,
  onClose,
  duration = 3000,
}) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  if (!show) return null;

  const getToastStyles = () => {
    switch (type) {
      case "success":
        return {
          bg: "bg-success",
          icon: "✓",
          title: "¡Éxito!",
        };
      case "error":
        return {
          bg: "bg-danger",
          icon: "✕",
          title: "Error",
        };
      case "warning":
        return {
          bg: "bg-warning",
          icon: "⚠",
          title: "Advertencia",
        };
      case "info":
        return {
          bg: "bg-info",
          icon: "ℹ",
          title: "Información",
        };
      default:
        return {
          bg: "bg-primary",
          icon: "ℹ",
          title: "Notificación",
        };
    }
  };

  const styles = getToastStyles();

  return (
    <div
      className="position-fixed top-0 end-0 p-3"
      style={{ zIndex: 9999 }}
    >
      <div
        className={`toast show ${styles.bg} text-white`}
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        <div className="toast-header">
          <strong className="me-auto">
            <span className="me-2">{styles.icon}</span>
            {styles.title}
          </strong>
          <button
            type="button"
            className="btn-close"
            onClick={onClose}
            aria-label="Close"
          ></button>
        </div>
        <div className="toast-body">{message}</div>
      </div>
    </div>
  );
};

export default ToastNotification;
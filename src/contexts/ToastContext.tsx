import React, { createContext, useContext, useState, useCallback } from "react";
import type { ToastType } from "../componentes/ToastNotification/ToastNotification";
import ToastNotification from "../componentes/ToastNotification/ToastNotification";


interface ToastContextType {
  showToast: (message: string, type: ToastType) => void;
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showWarning: (message: string) => void;
  showInfo: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "info" as ToastType,
  });

  const showToast = useCallback((message: string, type: ToastType = "info") => {
    setToast({ show: true, message, type });
  }, []);

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, show: false }));
  }, []);

  const showSuccess = useCallback((message: string) => showToast(message, "success"), [showToast]);
  const showError = useCallback((message: string) => showToast(message, "error"), [showToast]);
  const showWarning = useCallback((message: string) => showToast(message, "warning"), [showToast]);
  const showInfo = useCallback((message: string) => showToast(message, "info"), [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, showSuccess, showError, showWarning, showInfo }}>
      {children}
      <ToastNotification
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={hideToast}
      />
    </ToastContext.Provider>
  );
};

export const useGlobalToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useGlobalToast debe usarse dentro de ToastProvider");
  }
  return context;
};
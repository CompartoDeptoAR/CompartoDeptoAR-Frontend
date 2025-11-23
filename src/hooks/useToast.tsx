import { useState, useCallback } from "react";
import type { ToastType } from "../componentes/ToastNotification/ToastNotification";


interface Toast {
  show: boolean;
  message: string;
  type: ToastType;
  actionLabel?: string;
  onAction?: () => void;
}

export const useToast = () => {
  const [toast, setToast] = useState<Toast>({
    show: false,
    message: "",
    type: "info",
  });

  const showToast = useCallback((message: string, type: ToastType = "info") => {
    setToast({
      show: true,
      message,
      type,
    });
  }, []);

  const hideToast = useCallback(() => {
    setToast((prev) => ({
      ...prev,
      show: false,
    }));
  }, []);

  const showSuccess = useCallback((message: string) => {
    showToast(message, "success");
  }, [showToast]);

  const showError = useCallback((message: string) => {
    showToast(message, "error");
  }, [showToast]);

  const showWarning = useCallback((message: string) => {
    showToast(message, "warning");
  }, [showToast]);

  const showInfo = useCallback((message: string) => {
    showToast(message, "info");
  }, [showToast]);

  const showToastWithAction = useCallback((message: string, type: ToastType, actionLabel: string,
    onAction: () => void ) => {
    setToast({
      show: true,
      message,
      type,
      actionLabel,
      onAction,
    });
  },
  []
);

  return {
    toast,
    showToast,
    hideToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showToastWithAction,
  };
};
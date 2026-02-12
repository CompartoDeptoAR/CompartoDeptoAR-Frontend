import { useState, useCallback } from "react";

export type ToastType = "success" | "error" | "info" | "warning" | "loading";

interface Toast {
  show: boolean;
  message: string;
  type: ToastType;
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
    setToast(prev => ({
      ...prev,
      show: false,
    }));
  }, []);

  const showSuccess = (message: string) => showToast(message, "success");
  const showError = (message: string) => showToast(message, "error");
  const showWarning = (message: string) => showToast(message, "warning");
  const showInfo = (message: string) => showToast(message, "info");

  return {
    toast,
    setToast,
    hideToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
};

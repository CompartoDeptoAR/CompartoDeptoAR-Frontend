import { useState, useEffect } from "react";
import apiChat from "../../api/endpoints/chat";

export const useNotificaciones = () => {
  const [count, setCount] = useState(0);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    // Cargar count inicial
    fetchCount();

    // Polling cada 10 segundos
    const interval = setInterval(fetchCount, 10000);

    return () => clearInterval(interval);
  }, []);

  const fetchCount = async () => {
    try {
      setCargando(true);
      const data = await apiChat.contarNoLeidos();
      setCount(data.count);
    } catch (err: any) {
      console.error("Error al obtener notificaciones:", err);
    } finally {
      setCargando(false);
    }
  };

  const resetCount = () => {
    setCount(0);
  };

  return {
    count,
    cargando,
    refetch: fetchCount,
    resetCount,
  };
};
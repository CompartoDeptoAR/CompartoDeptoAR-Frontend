import { useState, useEffect } from "react";
import chatService from "../../services/chat/chatService";

export const useNotificaciones = (idUsuario: string | null) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!idUsuario) {
      setCount(0);
      return;
    }

    // Escuchar cambios en tiempo real
    const unsubscribe = chatService.escucharNoLeidos(idUsuario, (nuevoCount) => {
      setCount(nuevoCount);
    });

    return () => unsubscribe();
  }, [idUsuario]);

  return { count };
};
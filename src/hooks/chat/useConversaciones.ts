import { useEffect, useState } from "react";
import chatService from "../../services/chat/chatService";
import { ConversacionUI } from "../../services/chat/types";

export const useConversaciones = (idUsuario: string | null) => {
  const [conversaciones, setConversaciones] = useState<ConversacionUI[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!idUsuario) return;

    const unsubscribe = chatService.escucharConversaciones(idUsuario, (convs) => {
      setConversaciones(convs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [idUsuario]);

  return { conversaciones, loading };
};

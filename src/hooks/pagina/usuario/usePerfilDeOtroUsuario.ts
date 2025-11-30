import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import type { UsuarioPerfil } from "../../../modelos/Usuario";

export const usePerfilDeOtroUsuario = () => {
  const { id } = useParams();
  const [perfil, setPerfil] = useState<UsuarioPerfil | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchPerfil = async () => {
      try {
        const res = await fetch(`/api/usuarios/perfil/${id}`); // tu endpoint nuevo
        const data = await res.json();
        setPerfil(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPerfil();
  }, [id]);

  return { perfil };
};

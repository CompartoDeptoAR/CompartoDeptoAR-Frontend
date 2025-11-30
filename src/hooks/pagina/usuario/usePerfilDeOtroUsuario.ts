import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import type { UsuarioPerfil } from "../../../modelos/Usuario";
import apiUsuario from "../../../api/endpoints/usuario";


export const usePerfilDeOtroUsuario = () => {
  const { id } = useParams(); 
  const [perfil, setPerfil] = useState<UsuarioPerfil | null>(null);

  useEffect(() => {
    if (!id) return;

    const obtenerPerfil = async () => {
      try {
        const result = await apiUsuario.usuario.obtenerPerfilPorId(Number(id));
        setPerfil(result);
      } catch (error) {
        console.error("Error obteniendo perfil:", error);
      }
    };

    obtenerPerfil();
  }, [id]);

  return { perfil };
};

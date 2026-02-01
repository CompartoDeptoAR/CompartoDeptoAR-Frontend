import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import type { UsuarioPerfil } from "../../../modelos/Usuario";
import apiUsuario from "../../../services/api/endpoints/usuario";
import { useGlobalLoader } from "../../sistema/useGlobalLoader";

export const usePerfilDeOtroUsuario = () => {
  const { id } = useParams(); 
  const [perfil, setPerfil] = useState<UsuarioPerfil>();
  const [usuarioId, setUsuarioId] = useState<string | undefined>();
  const { showLoader, hideLoader } = useGlobalLoader();

  useEffect(() => {
    if (!id) return;

    const obtenerPerfil = async () => {
      try {
         showLoader();
        const result = await apiUsuario.usuario.obtenerPerfilPorId(id);
        setPerfil(result);
        setUsuarioId(id);
      } catch (error) {
        console.error("Error obteniendo perfil:", error);
      } finally {
        hideLoader();
      }
    };

    obtenerPerfil();
  }, [id]);

  return { perfil, usuarioId };
};
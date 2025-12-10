import { useEffect, useState } from "react";
import type { UsuarioPerfil } from "../../../modelos/Usuario";
import apiUsuario from "../../../api/endpoints/usuario";
import { TokenService } from "../../../services/auth/tokenService";
import { useGlobalLoader } from "../../sistema/useGlobalLoader";

export const usePerfilView = () => {
  const userId = TokenService.getUserId();
  const [perfil, setPerfil] = useState<UsuarioPerfil | null>(null);

  const { showLoader, hideLoader } = useGlobalLoader();

  useEffect(() => {
    if (!userId) return;

    const fetchPerfil = async () => {
      try {
        showLoader();
        const data = await apiUsuario.usuario.perfil();
        setPerfil(data);

      } catch (error) {
        console.error("Error al cargar perfil:", error);
      } finally {
        hideLoader();
      }
    };

    fetchPerfil();
  }, [userId]);

  return { perfil };
};

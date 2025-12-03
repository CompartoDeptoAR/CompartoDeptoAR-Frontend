import { useEffect, useState } from "react";
import type { UsuarioPerfil } from "../../../modelos/Usuario";
import { LocalStorageService, STORAGE_KEYS } from "../../../services/storage/localStorage.service";
import { useToast } from "../../useToast";
import apiUsuario from "../../../api/endpoints/usuario";
import { Navegar } from "../../../navigation/navigationService";


export const usePerfilEdit = () => {
  const [perfil, setPerfil] = useState<UsuarioPerfil>();

  const [loading, setLoading] = useState(!perfil);
  const { toast, showSuccess, showError, hideToast } = useToast();


  useEffect(() => {
    if (!perfil) {
      const token = LocalStorageService.get(STORAGE_KEYS.FTOKEN);
      const userId = LocalStorageService.get(STORAGE_KEYS.USER_ID);

      if (!userId || !token) {
        showError("No se encontró la sesión del usuario");
        setLoading(false);
        return;
      }

      const fetchData = async () => {
        try {
          const data = await apiUsuario.usuario.perfil();
          setPerfil(data);

        } catch (error: any) {
          console.error("Error al traer perfil:", error);
          showError(error.message || "Error al cargar el perfil");
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    } else {
      setLoading(false);
    }
  }, [perfil, showError]);


  const handleSave = async (nuevoPerfil: UsuarioPerfil): Promise<void> => {
    try {
      const token = LocalStorageService.get(STORAGE_KEYS.FTOKEN);
      if (!token) throw new Error("Token no encontrado");

      const res = await apiUsuario.usuario.editarPerfil(nuevoPerfil);

      setPerfil(res);

      showSuccess("¡Perfil actualizado correctamente!");

      setTimeout(() => {
        Navegar.miPerfil();
      }, 1000);
    } catch (error: any) {
      showError(error.message || "Error al guardar el perfil");
      throw error;
    }
  };

  return {
    perfil,
    loading,
    toast,
    hideToast,
    handleSave
  };
};

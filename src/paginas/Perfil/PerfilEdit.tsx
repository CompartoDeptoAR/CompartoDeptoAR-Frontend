import React, { useEffect, useState } from "react";
import type { UsuarioPerfil } from "../../modelos/Usuario";
import FormularioPerfil from "../../componentes/FormularioPerfil/FormularioPerfil";

import { LocalStorageService, STORAGE_KEYS } from "../../services/storage/localStorage.service";
import apiUsuario from "../../api/endpoints/usuario";
import { useToast } from "../../componentes/ToastNotification/useToast";
import ToastNotification from "../../componentes/ToastNotification/ToastNotification";
import { useNavigate } from "react-router-dom";

const PerfilEdit: React.FC = () => {
  const [perfil, setPerfil] = useState<UsuarioPerfil | null>(
    LocalStorageService.getObject<UsuarioPerfil>(STORAGE_KEYS.PREFERENCES)
  );
  const [loading, setLoading] = useState(!perfil);
  const { toast, showSuccess, showError, hideToast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!perfil) {
      const token = LocalStorageService.get(STORAGE_KEYS.TOKEN);
      const userId = LocalStorageService.get(STORAGE_KEYS.USER_ID);

      if (!userId || !token) {
        showError("No se encontró la sesión del usuario");
        return;
      }

      const fetchData = async () => {
        try {
          const data = await apiUsuario.usuario.perfil();
          setPerfil(data);
          LocalStorageService.setObject(STORAGE_KEYS.PREFERENCES, data);
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
      const token = LocalStorageService.get(STORAGE_KEYS.TOKEN);
      if (!token) throw new Error("Token no encontrado");

      const res = await apiUsuario.usuario.editarPerfil(nuevoPerfil);

      LocalStorageService.setObject(STORAGE_KEYS.PREFERENCES, res);
      setPerfil(res);
      
      showSuccess("¡Perfil actualizado correctamente!");
      setTimeout(() => {
      navigate("/mi-perfil"); 
    }, 1000);
    } catch (error: any) {
      showError(error.message || "Error al guardar el perfil");
      throw error; 
    }
  };

  if (loading) return <div>Cargando perfil...</div>;
  if (!perfil) return <div>No se encontró el perfil del usuario.</div>;

  return (
    <>
      <FormularioPerfil
        perfil={perfil}
        modo="editar"
        onSubmit={handleSave}
      />
      <ToastNotification
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={hideToast}
      />
    </>
  );
};

export default PerfilEdit;
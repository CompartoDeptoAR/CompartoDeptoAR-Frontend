import React, { useEffect, useState } from "react";
import type { UsuarioPerfil } from "../../modelos/Usuario";
import FormularioPerfil from "../../componentes/FormularioPerfil/FormularioPerfil";
import { LocalStorageService, STORAGE_KEYS } from "../../services/storage/localStorage.service";
import apiUsuario from "../../api/endpoints/usuario";

const PerfilEdit: React.FC = () => {
  const [perfil, setPerfil] = useState<UsuarioPerfil | null>(
    LocalStorageService.getObject<UsuarioPerfil>(STORAGE_KEYS.PREFERENCES)
  );
  const [loading, setLoading] = useState(!perfil);

  useEffect(() => {
    if (!perfil) {
      const token = LocalStorageService.get(STORAGE_KEYS.TOKEN);
      const userId = LocalStorageService.get(STORAGE_KEYS.USER_ID);

      if (!userId || !token) return;

      const fetchData = async () => {
        try {
          const data = await apiUsuario.usuario.perfil();
          setPerfil(data);
          LocalStorageService.setObject(STORAGE_KEYS.PREFERENCES, data);
        } catch (error) {
          console.error("Error al traer perfil:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    } else {
      setLoading(false);
    }
  }, [perfil]);

  const handleSave = async (nuevoPerfil: UsuarioPerfil): Promise<void> => {  // 👈 Agregá Promise<void>
    const token = LocalStorageService.get(STORAGE_KEYS.TOKEN);
    if (!token) throw new Error("Token no encontrado");

    const res = await apiUsuario.usuario.editarPerfil(nuevoPerfil);

    LocalStorageService.setObject(STORAGE_KEYS.PREFERENCES, res);
    setPerfil(res);

    console.log("Perfil actualizado correctamente");
  };

  if (loading) return <div>Cargando perfil...</div>;
  if (!perfil) return <div>No se encontró el perfil del usuario.</div>;

  return (
    <FormularioPerfil
      perfil={perfil}
      modo="editar"
      onSubmit={handleSave}
    />
  );
};

export default PerfilEdit;
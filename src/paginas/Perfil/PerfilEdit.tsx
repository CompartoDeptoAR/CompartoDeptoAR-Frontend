import React from "react";
import FormularioPerfil from "../../componentes/FormularioPerfil/FormularioPerfil";
import ToastNotification from "../../componentes/ToastNotification/ToastNotification";
import { usePerfilEdit } from "../../hooks/usuario/usePerfilEdit";



const PerfilEdit: React.FC = () => {
  const { perfil, loading, toast, hideToast, handleSave } = usePerfilEdit();

  if (loading) return null;
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

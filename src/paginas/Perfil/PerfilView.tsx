import React from "react";
import FormularioPerfil from "../../componentes/FormularioPerfil/FormularioPerfil";
import { usePerfilView } from "../../hooks/pagina/usuario/usePerfilView";

const PerfilView: React.FC = () => {
  const { perfil, userId } = usePerfilView();

  if (!perfil || !userId) return null;
  
  return <FormularioPerfil perfil={perfil} modo="view" usuarioId={userId} />;
};

export default PerfilView;
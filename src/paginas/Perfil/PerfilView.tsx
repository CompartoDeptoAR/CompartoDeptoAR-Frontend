import React from "react";
import FormularioPerfil from "../../componentes/FormularioPerfil/FormularioPerfil";
import { usePerfilView } from "../../hooks/pagina/usuario/usePerfilView";

const PerfilView: React.FC = () => {
  const { perfil } = usePerfilView();

  if (!perfil) return null;

  return <FormularioPerfil perfil={perfil} modo="view" />;
};

export default PerfilView;

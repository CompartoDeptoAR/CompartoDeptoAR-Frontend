import React from "react";
import FormularioPerfil from "../../componentes/FormularioPerfil/FormularioPerfil";
import { usePerfilDeOtroUsuario } from "../../hooks/pagina/usuario/usePerfilDeOtroUsuario";

const PerfilOtroUsuarioView: React.FC = () => {
  const { perfil, usuarioId } = usePerfilDeOtroUsuario();

  if (!perfil) return null;

  return <FormularioPerfil perfil={perfil} modo="verOtro" usuarioId={usuarioId} />;
};

export default PerfilOtroUsuarioView;
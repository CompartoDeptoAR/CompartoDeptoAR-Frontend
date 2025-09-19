import type { UsuarioPerfil } from "../../modelos/Usuario";
import FormularioPerfil from "../../componentes/FormularioPerfil/FormularioPerfil";
import { useUsuario } from "../../contexts/UsuarioContext";


const PerfilEdit = () => {
  const { perfil, setPerfil } = useUsuario();

  const handleSave = (nuevoPerfil: UsuarioPerfil) => {
    console.log("Guardar en backend:", nuevoPerfil);
    setPerfil(nuevoPerfil);
  };

  if (!perfil) return <div>Cargando...</div>;

  return (
    <FormularioPerfil perfil={perfil} modo="editar" onSubmit={handleSave} />
  );
};



export default PerfilEdit;
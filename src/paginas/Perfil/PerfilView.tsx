import { useEffect, useState } from "react";
import api from "../../api/endpoints/usuario";
import FormularioPerfil from "../../componentes/FormularioPerfil/FormularioPerfil";
import { useUser } from "../../contexts/UsuarioContext"
import type { UsuarioPerfil } from "../../modelos/Usuario";

const PerfilView: React.FC = () => {
  const { id: userId } = useUser();  
  const [perfil, setPerfil] = useState<UsuarioPerfil>();

  useEffect(() => {
    if (!userId) return; 

    const fetchData = async () => {
      try {
        const data = await api.usuario.perfil(userId); 
        setPerfil(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [userId]);

  if (!perfil) return <div>Cargando...</div>;

  return <FormularioPerfil perfil={perfil} modo="view" />;
};

export default PerfilView;

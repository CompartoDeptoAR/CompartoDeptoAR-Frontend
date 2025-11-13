import { useEffect, useState } from "react";
import api from "../../api/endpoints/usuario";
import FormularioPerfil from "../../componentes/FormularioPerfil/FormularioPerfil";

import type { UsuarioPerfil } from "../../modelos/Usuario";
import { TokenService } from "../../services/auth/tokenService";

const PerfilView: React.FC = () => {
  const  userId  = TokenService.getUserId();  
  const [perfil, setPerfil] = useState<UsuarioPerfil>();

  useEffect(() => {
    if (!userId) return; 

    const fetchData = async () => {
      try {
        const data = await api.usuario.perfil(); 
        setPerfil(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  if (!perfil) return <div>Cargando...</div>;

  return <FormularioPerfil perfil={perfil} modo="view" />;
};

export default PerfilView;

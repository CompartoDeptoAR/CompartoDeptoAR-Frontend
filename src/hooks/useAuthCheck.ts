
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { estaTokenExpirado, getTiempoRestante } from '../utils/jwtUtils';
import apiAuth from '../api/endpoints/auth';


export const useAuthCheck = () => {
  const navigate = useNavigate();
  const [advertenciaExpiracion, setAdvertenciaExpiracion] = useState(false);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const verificarToken = () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }

      if (estaTokenExpirado(token)) {
        console.log('Token expirado, cerrando sesión...');
        apiAuth.auth.logout(true); 
        sessionStorage.setItem('mensajeSesion', 'Tu sesión ha expirado.');
        navigate('/login');
        return;
      }

      const tiempoRestante = getTiempoRestante(token);
      

      if (tiempoRestante < 5 * 60 * 1000 && tiempoRestante > 0) {
        setAdvertenciaExpiracion(true);
      } else {
        setAdvertenciaExpiracion(false);
      }

      timeoutId = setTimeout(verificarToken, 30000);
    };

    verificarToken();
    
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  return { advertenciaExpiracion };
};
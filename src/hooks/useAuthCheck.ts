
import { useEffect, useState } from 'react';
import { estaTokenExpirado, getTiempoRestante } from '../utils/jwtUtils';
import apiAuth from '../api/endpoints/auth';
import { Navigation } from '../navigation/navigationService';


export const useAuthCheck = () => {
  const [advertenciaExpiracion, setAdvertenciaExpiracion] = useState(false);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const verificarToken = () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        Navigation.auth;
        return;
      }

      if (estaTokenExpirado(token)) {
        console.log('Token expirado, cerrando sesión...');
        apiAuth.auth.logout(true); 
        sessionStorage.setItem('mensajeSesion', 'Tu sesión ha expirado.');
        Navigation.auth;
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
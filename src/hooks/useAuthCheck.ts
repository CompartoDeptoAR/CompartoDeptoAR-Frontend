import { useEffect, useState } from 'react';
import { estaTokenExpirado, getTiempoRestante } from '../utils/firebaseTokenUtils'; // Cambiar aquí
//import apiAuth from '../api/endpoints/auth';
import { Navegar } from '../navigation/navigationService';
import { TokenService } from '../services/auth/tokenService';

export const useAuthCheck = () => {
  const [advertenciaExpiracion, setAdvertenciaExpiracion] = useState(false);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const verificarToken = () => {
      const token = TokenService.getToken();
      
      if (!token) {
        Navegar.auth();
        return;
      }

      if (estaTokenExpirado(token)) {
        console.log('Token expirado, cerrando sesión...');
        TokenService.clearAuthData();
        sessionStorage.setItem('mensajeSesion', 'Tu sesión ha expirado.');
        Navegar.auth();
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
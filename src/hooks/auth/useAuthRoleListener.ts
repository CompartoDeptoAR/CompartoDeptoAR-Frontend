// hooks/useAuthRoleListener.ts
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { TokenService } from '../../services/auth/tokenService';
import { Rol } from '../../modelos/Roles';

export function useAuthRoleListener() {
  const navigate = useNavigate();

  useEffect(() => {
    const usuarioId = TokenService.getUserId();
    
    if (!usuarioId) {
      console.warn('No hay usuario autenticado');
      return;
    }

    console.log('Escuchando cambios de rol para usuario:', usuarioId);

    const docRef = doc(db, 'usuarios', usuarioId);
    
    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (!docSnap.exists()) {
          console.log('Usuario eliminado de Firestore');
          handleLogout('Tu cuenta ha sido eliminada');
          return;
        }

        const userData = docSnap.data();
        const rolesActuales = userData?.roles || userData?.rol || [];
        
        console.log('Roles actuales en Firestore:', rolesActuales);
        
        const esAdmin = Array.isArray(rolesActuales) && 
                       rolesActuales.some((r: string) => {
                         return r === Rol.ADMIN || r === 'ADMIN_ROLE';
                       });
        
        if (!esAdmin) {
          console.log('Usuario ya no es admin, cerrando sesión');
          handleLogout('Tus permisos de administrador han sido revocados');
        }
      },
      (error) => {
        console.error('Error escuchando cambios de rol:', error);
      }
    );

    return () => {
      console.log('Deteniendo listener de rol');
      unsubscribe();
    };
  }, [navigate]);

  function handleLogout(mensaje: string) {
    console.log('Cerrando sesión:', mensaje);
    TokenService.clearAuthData();
    sessionStorage.clear();
    alert(mensaje);
    navigate('/login', { replace: true });
  }
}
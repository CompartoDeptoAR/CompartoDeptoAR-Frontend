import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { TokenService } from '../../services/auth/tokenService';
import { Rol } from '../../modelos/Roles';

const RUTAS_ADMIN = [
  '/admin',
  '/admin/reportes',
];

function esRutaDeAdmin(pathname: string): boolean {
  return RUTAS_ADMIN.some(ruta => pathname.startsWith(ruta));
}

export function useAuthRoleListener() {
  const navigate = useNavigate();
  const location = useLocation();
  const inicializado = useRef(false);
  const eraAdminAntes = useRef<boolean | null>(null);

  useEffect(() => {
    const usuarioId = TokenService.getUserId();

    if (!usuarioId) {
      console.warn('No hay usuario autenticado');
      return;
    }
    //console.log('Escuchando cambios de rol para usuario:', usuarioId);
    const docRef = doc(db, 'usuarios', usuarioId);

    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (!docSnap.exists()) {
          //console.log('Usuario eliminado de Firestore');
          handleLogout('Tu cuenta fue eliminada');
          return;
        }
        const userData = docSnap.data();
        const rolesActuales = userData?.roles || userData?.rol || [];

        //console.log('Roles actuales:', rolesActuales);
        //console.log('Tipo de roles:', typeof rolesActuales, Array.isArray(rolesActuales));
       //console.log('Primer elemento:', rolesActuales[0]);
        //console.log('Ruta actual:', location.pathname);

        const esAdminAhora =
          Array.isArray(rolesActuales) &&
          rolesActuales.some((r: any) => {
            if (typeof r === 'string') {
              const rolNormalizado = r.toUpperCase();
              return (
                rolNormalizado === Rol.ADMIN ||
                rolNormalizado === 'ADMIN_ROLE' ||
                rolNormalizado === 'ADMIN'
              );
            }

            if (typeof r === 'object' && r !== null) {
              const valorRol = (
                r.rol ||
                r.nombre ||
                r._id ||
                r.name ||
                r.rolId ||
                ''
              )
                .toString()
                .toUpperCase();

              return (
                valorRol === Rol.ADMIN ||
                valorRol === 'ADMIN_ROLE' ||
                valorRol === 'ADMIN'
              );
            }

            return false;
          });

        //console.log('Es admin ahora?', esAdminAhora);
        if (!inicializado.current) {
          eraAdminAntes.current = esAdminAhora;
          inicializado.current = true;
          //console.log('Estado inicial guardado. Es admin:', esAdminAhora);

          if (!esAdminAhora && esRutaDeAdmin(location.pathname)) {
            //console.log('No es admin pero esta en una ruta para admin. Cerrando sesion.');
            handleLogout('No tenes permisos para entrar a esta seccion');
          }

          return;
        }

        if (eraAdminAntes.current === true && esAdminAhora === false) {
         // console.log('Usuario perdió rol de admin');

          if (esRutaDeAdmin(location.pathname)) {
            //console.log('Está en ruta admin, cerrando sesión...');
            handleLogout('Tus permisos d administrador fueron sacados');
          } else {
           //console.log('ℹNo está en ruta admin, solo alerta');
            alert('Tus permisos de administrador fueron sacados');
          }
        }
        eraAdminAntes.current = esAdminAhora;
      },
      (error) => {
       // console.error('Error escuchando cambios de rol:', error);
      }
    );

    return () => {
      //console.log('Parando el listener de rol');
      unsubscribe();
      inicializado.current = false;
      eraAdminAntes.current = null;
    };
  }, [navigate, location.pathname]);

  function handleLogout(mensaje: string) {
    //console.log('Cerrando sesiin completa:', mensaje);
    TokenService.clearAuthData();
    sessionStorage.clear();
    alert(mensaje);
    navigate('/login', { replace: true });
  }
}
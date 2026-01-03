import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { TokenService } from '../../services/auth/tokenService';
import { Rol } from '../../modelos/Roles';
import { ADMIN_ROUTES } from '../../routers/Routes';

// Este listener "escuch(je) " cambios de rol del usuario en tiempo real.
// Sirve para reaccionar si se agregan o sacan permisos sin recargar la app.
// Si perdes el rol admin y estas en una ruta protegida, puuuum,te saca.
// Si te ponen el rol admin, se fuerza salida de la vista para q te des cuenta...
// Todito sincronizado...

const RUTAS_ADMIN: string[] = [
  ADMIN_ROUTES.PANEL,
  ADMIN_ROUTES.REPORTE_DETALLE(),
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

    const docRef = doc(db, 'usuarios', usuarioId);

    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (!docSnap.exists()) {
          handleLogout('Tu cuenta fue eliminada');
          return;
        }

        const userData = docSnap.data();
        const rolesActuales = userData?.roles || userData?.rol || [];

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

        if (!inicializado.current) {
          eraAdminAntes.current = esAdminAhora;
          inicializado.current = true;

          if (!esAdminAhora && esRutaDeAdmin(location.pathname)) {
            handleLogout('No tenes permisos para entrar a esta seccion');
          }

          return;
        }

        if (eraAdminAntes.current === true && esAdminAhora === false) {
          if (esRutaDeAdmin(location.pathname)) {
            handleLogout('Tus permisos d administrador fueron sacados');
          } else {
            alert('Tus permisos de administrador fueron sacados');
          }
        }

        if (eraAdminAntes.current === false && esAdminAhora === true) {
          alert('Se actualizaron tus permisos. Volve a Entrar😎.');
          navigate('/', { replace: true });
        }

        eraAdminAntes.current = esAdminAhora;
      },
      () => {}
    );

    return () => {
      unsubscribe();
      inicializado.current = false;
      eraAdminAntes.current = null;
    };
  }, [navigate, location.pathname]);

  function handleLogout(mensaje: string) {
    TokenService.clearAuthData();
    sessionStorage.clear();
    alert(mensaje);
    navigate('/login', { replace: true });
  }
}
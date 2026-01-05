import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { TokenService } from '../../services/auth/tokenService';
import { Rol } from '../../modelos/Roles';
import { ADMIN_ROUTES } from '../../routers/Routes';

// Ponele q "escucha(je) " cambios de rol del usuario en tiempo real.
// Deberia reaccionar si se agregan o sacan permisos sin recargar la app.
// Si perdes el rol admin y estas en una ruta protegida, puuuum,te saca.
// Si te ponen el rol admin, se fuerza salida de la vista para q te des cuenta...
// Todito sincronizado...en teoria...

const RUTAS_ADMIN: string[] = [
  ADMIN_ROUTES.PANEL,
  ADMIN_ROUTES.REPORTE_DETALLE(),
];

function esRutaDeAdmin(pathname: string): boolean {
  return RUTAS_ADMIN.some(ruta => pathname.startsWith(ruta));
}

function verificarSiEsAdmin(rolesActuales: any): boolean {
  if (!Array.isArray(rolesActuales) || rolesActuales.length === 0) {
    return false;
  }

  return rolesActuales.some((r: any) => {
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
}

function mostrarModalNotificacion(titulo: string, mensaje: string, tipo: 'exito' | 'error'): Promise<void> {
  return new Promise((resolve) => {
    const modal = document.createElement('div');
    modal.id = 'notificacion-rol-modal';
    
    const estilos = {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: '9999',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    };

    Object.assign(modal.style, estilos);

    const contenedor = document.createElement('div');
    const colorFondo = tipo === 'exito' ? '#10b981' : '#ef4444';
    const colorBorde = tipo === 'exito' ? '#059669' : '#dc2626';

    const estilosContenedor = {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '40px',
      maxWidth: '500px',
      textAlign: 'center',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
      borderTop: `6px solid ${colorFondo}`
    };

    Object.assign(contenedor.style, estilosContenedor);

    const iconoDiv = document.createElement('div');
    const estilosIcono = {
      fontSize: '60px',
      marginBottom: '20px',
      lineHeight: '1'
    };
    Object.assign(iconoDiv.style, estilosIcono);
    iconoDiv.textContent = tipo === 'exito' ? '✓' : '⚠';
    iconoDiv.style.color = colorFondo;

    const tituloEl = document.createElement('h2');
    const estilosTitulo = {
      margin: '0 0 15px 0',
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#111827'
    };
    Object.assign(tituloEl.style, estilosTitulo);
    tituloEl.textContent = titulo;

    const mensajeEl = document.createElement('p');
    const estilosMensaje = {
      margin: '0 0 30px 0',
      fontSize: '16px',
      color: '#6b7280',
      lineHeight: '1.5'
    };
    Object.assign(mensajeEl.style, estilosMensaje);
    mensajeEl.textContent = mensaje;

    const boton = document.createElement('button');
    const estilosBoton = {
      backgroundColor: colorFondo,
      color: 'white',
      border: 'none',
      padding: '12px 30px',
      fontSize: '16px',
      fontWeight: 'bold',
      borderRadius: '6px',
      cursor: 'pointer',
      transition: 'background-color 0.3s'
    };
    Object.assign(boton.style, estilosBoton);
    boton.textContent = 'Entendido';

    boton.onmouseover = () => {
      boton.style.backgroundColor = colorBorde;
    };
    boton.onmouseout = () => {
      boton.style.backgroundColor = colorFondo;
    };

    boton.onclick = () => {
      modal.remove();
      resolve();
    };

    contenedor.appendChild(iconoDiv);
    contenedor.appendChild(tituloEl);
    contenedor.appendChild(mensajeEl);
    contenedor.appendChild(boton);
    modal.appendChild(contenedor);
    document.body.appendChild(modal);
  });
}

export function useAuthRoleListener() {
  const navigate = useNavigate();
  const location = useLocation();
  const inicializado = useRef(false);
  const eraAdminAntes = useRef<boolean | null>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const usuarioId = TokenService.getUserId();

    if (!usuarioId) {
      console.warn('No hay usuario autenticado');
      return;
    }

    const docRef = doc(db, 'usuarios', usuarioId);

    unsubscribeRef.current = onSnapshot(
      docRef,
      async (docSnap) => {
        if (!docSnap.exists()) {
          mostrarModalNotificacion(
            'Cuenta Eliminada',
            'Tu cuenta fue eliminada del sistema',
            'error'
          );
          setTimeout(() => {
            handleLogout('Tu cuenta fue eliminada');
          }, 3000);
          return;
        }

        const userData = docSnap.data();
        const rolesActuales = userData?.roles || userData?.rol || [];
        const esAdminAhora = verificarSiEsAdmin(rolesActuales);

    
        if (!inicializado.current) {
          eraAdminAntes.current = esAdminAhora;
          inicializado.current = true;

        
          if (!esAdminAhora && esRutaDeAdmin(location.pathname)) {
            mostrarModalNotificacion(
              'Acceso Denegado',
              'No tenes permisos para acceder a esta seccion',
              'error'
            );
            setTimeout(() => {
              handleLogout('No tenes permisos para acceder a esta seccion');
            }, 3000);
          }

          return;
        }

   
        if (eraAdminAntes.current === true && esAdminAhora === false) {
          mostrarModalNotificacion(
            'Permisos Revocados',
            'Tus permisos de Admin fueron sacados',
            'error'
          );
          setTimeout(() => {
            handleLogout('Tus permisos de administrador fueron revocados');
          }, 3000);
        }

        if (eraAdminAntes.current === false && esAdminAhora === true) {
          mostrarModalNotificacion(
            'Bienvenido Admin',
            'Felicitaciones sos Admin! Todas tus funciones estan habilitadas',
            'exito'
          );
          setTimeout(() => {
            handleLogout('Te promovieron a Admin');
          }, 3000);
        }

        eraAdminAntes.current = esAdminAhora;
      },
      (error) => {
        console.error('Error escuchando cambios de rol:', error);
      }
    );

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
      inicializado.current = false;
      eraAdminAntes.current = null;
    };
  }, [navigate, location.pathname]);

  function handleLogout(mensaje: string) {
    TokenService.clearAuthData();
    sessionStorage.clear();
    localStorage.clear();
    navigate('/login', { replace: true });
  }
}
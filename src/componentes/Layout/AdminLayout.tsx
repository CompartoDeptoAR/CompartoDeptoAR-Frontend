// components/AdminLayout.tsx
import { useAuthRoleListener } from '../../hooks/auth/useAuthRoleListener';
import { TokenService } from '../../services/auth/tokenService';
import { Navigate } from 'react-router-dom';

export function AdminLayout({ children }: { children: React.ReactNode }) {
  useAuthRoleListener();
  
  // ✅ Verificar autenticación inicial
  if (!TokenService.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  
  // ✅ Verificar si tiene rol admin
  const roles = TokenService.getUserRol();
  const esAdmin = roles.some((rol) => {
    if (typeof rol === 'string') {
      return rol.toLowerCase() === 'admin';
    }
    return rol === 'admin';
  });
  
  if (!esAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="admin-layout">
      <header>Panel de Administración</header>
      <main>{children}</main>
    </div>
  );
}
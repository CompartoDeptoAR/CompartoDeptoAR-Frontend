import { useEffect } from "react";
import { useUsuariosRoles } from "../../../hooks/pagina/admin/useUsuariosRoles";
import { Rol } from "../../../modelos/Roles";

const UsuariosRolesPage = () => {
  const {
    usuarios,
    busqueda,
    setBusqueda,
    cargando,
    error,
    cargarUsuarios,
    toggleRol,
    tieneRol,
  } = useUsuariosRoles();

  useEffect(() => {
    cargarUsuarios();
  }, [cargarUsuarios]);

  if (cargando && usuarios.length === 0) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>👥 Gestionar roles</h2>
        <button 
          className="btn btn-outline-primary btn-sm" 
          onClick={cargarUsuarios}
          disabled={cargando}
        >
          🔄 Actualizar
        </button>
      </div>
      
      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          <strong>Error:</strong> {error}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => {}}
          ></button>
        </div>
      )}

      <div className="mb-4">
        <input 
          type="text"
          className="form-control"
          placeholder="🔍 Buscar usuario por nombre o email..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      {usuarios.length === 0 ? (
        <div className="alert alert-info">
          {busqueda ? "No se encontraron usuarios con ese criterio" : "No hay usuarios para mostrar"}
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Usuario</th>
                <th>Email</th>
                <th>Fecha Creación</th>
                <th>Roles</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map(usuario => (
                <tr key={usuario.id}>
                  <td>
                    <div className="d-flex align-items-center">
                      <div className="avatar-circle me-2 bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" 
                           style={{width: '40px', height: '40px'}}>
                        {(usuario.perfil?.nombreCompleto?.[0] || usuario.correo[0]).toUpperCase()}
                      </div>
                      <div className="fw-semibold">
                        {usuario.perfil?.nombreCompleto || "Sin nombre"}
                      </div>
                    </div>
                  </td>
                  <td>{usuario.correo}</td>
                  <td>
                    <small className="text-muted">
                      {new Date(usuario.fechaCreacion).toLocaleDateString('es-AR')}
                    </small>
                  </td>
                  <td>
                    <div className="d-flex gap-1 flex-wrap">
                      {usuario.rol.map(rol => (
                        <span 
                          key={rol}
                          className={`badge ${
                            rol === Rol.ADMIN ? 'bg-danger' : 'bg-secondary'
                          }`}
                        >
                          {rol === Rol.ADMIN ? '👑 Admin' : '👤 Usuario'}
                        </span>
                      ))}
                      {usuario.rol.length === 0 && (
                        <span className="badge bg-light text-dark">Sin roles</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="btn-group btn-group-sm">
                      <button 
                        className={`btn ${
                          tieneRol(usuario, Rol.ADMIN) 
                            ? 'btn-danger' 
                            : 'btn-outline-danger'
                        }`}
                        onClick={() => toggleRol(usuario.id!, Rol.ADMIN)}
                        disabled={cargando}
                        title={
                          tieneRol(usuario, Rol.ADMIN) 
                            ? 'Quitar rol de Admin' 
                            : 'Asignar rol de Admin'
                        }
                      >
                        {tieneRol(usuario, Rol.ADMIN) ? '✓ Admin' : '+ Admin'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Información sobre roles */}
      <div className="card mt-4">
        <div className="card-body">
          <h6 className="card-title">ℹ️ Información sobre roles</h6>
          <ul className="mb-0">
            <li>
              <strong>👤 Usuario (USER_ROLE):</strong> Rol básico, todos los usuarios lo tienen por defecto.
            </li>
            <li>
              <strong>👑 Admin (ADMIN_ROLE):</strong> Acceso al panel de administración, puede gestionar reportes y usuarios.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UsuariosRolesPage;
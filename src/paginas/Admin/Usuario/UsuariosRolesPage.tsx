import React, { useEffect } from "react";
import { useUsuariosRoles } from "../../../hooks/pagina/admin/useUsuariosRoles";
import { Rol } from "../../../modelos/Roles";
import apiAdmin from "../../../api/endpoints/admin";
import { Navegar } from "../../../navigation/navigationService";

const UsuariosRolesPage = () => {
  const {
    usuarios,
    busqueda,
    setBusqueda,
    cargando,
    error,
    cargarUsuarios,
    toggleRol,
    tieneRol
  } = useUsuariosRoles();

  useEffect(() => {
    cargarUsuarios();
  }, []);

  return (
    <div className="container">

      <h3 className="fw-bold mb-3">👥 Gestión de usuarios y roles</h3>

      {/* BUSCADOR */}
      <div className="mb-3">
        <input
          type="text"
          placeholder="Buscar por nombre o correo..."
          className="form-control"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      {/* ERRORES */}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* LOADING */}
      {cargando && <p>Cargando usuarios...</p>}

      {/* TABLA DE USUARIOS */}
      {!cargando && usuarios.length === 0 && (
        <p className="text-muted">No hay usuarios para mostrar.</p>
      )}

      {!cargando && usuarios.length > 0 && (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Rol Actual</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario.id}>
                  <td>{usuario.perfil?.nombreCompleto || "Sin nombre"}</td>
                  <td>{usuario.correo}</td>
                  <td>
                    {tieneRol(usuario, Rol.ADMIN)
                      ? "Administrador"
                      : "Usuario"}
                  </td>

                  {/* BOTONES */}
                  <td>
                    <div className="d-flex gap-2">

                      {/* VER PERFIL */}
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => Navegar.usuarioPerfil(usuario.id!)}
                      >
                        👁️ Ver
                      </button>

                      {/* ASIGNAR / QUITAR ADMIN */}
                      <button
                        className={`btn btn-sm ${
                          tieneRol(usuario, Rol.ADMIN)
                            ? "btn-danger"
                            : "btn-outline-danger"
                        }`}
                        onClick={() => toggleRol(usuario.id!, Rol.ADMIN)}
                      >
                        {tieneRol(usuario, Rol.ADMIN)
                          ? "✓ Admin"
                          : "+ Admin"}
                      </button>

                      {/* ELIMINAR */}
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={async () => {
                          if (
                            window.confirm(
                              `¿Eliminar a ${
                                usuario.perfil?.nombreCompleto ||
                                usuario.correo
                              }?`
                            )
                          ) {
                            try {
                              await apiAdmin.eliminarUsuario(usuario.id!);
                              cargarUsuarios();
                              alert("Usuario eliminado");
                            } catch (err: any) {
                              alert(`Error: ${err.message}`);
                            }
                          }
                        }}
                      >
                        🗑️
                      </button>

                    </div>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      )}
    </div>
  );
};

export default UsuariosRolesPage;

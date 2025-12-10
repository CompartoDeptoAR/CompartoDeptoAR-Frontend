import { useState, useCallback } from "react";
import { Usuario } from "../../../modelos/Usuario";
import apiAdmin from "../../../api/endpoints/admin";
import { Rol } from "../../../modelos/Roles";

export const useUsuariosRoles = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string>("");


  const normalizarRoles = (rol: any): any[] => {
    if (Array.isArray(rol)) return rol;
    if (rol) return [rol];
    return [];
  };


  const getRolId = (rol: any): string => {
    if (typeof rol === 'string') return rol;
    if (rol?.rolId) return rol.rolId;
    return '';
  };


  const usuariosFiltrados = usuarios.filter(u => 
    u.perfil?.nombreCompleto?.toLowerCase().includes(busqueda.toLowerCase()) ||
    u.correo.toLowerCase().includes(busqueda.toLowerCase())
  );

  const tieneRol = (usuario: Usuario, rol: Rol): boolean => {
    const roles = normalizarRoles(usuario.rol);
    return roles.some(r => getRolId(r) === rol);
  };


  const cargarUsuarios = useCallback(async () => {
    try {
      setCargando(true);
      setError("");
      
      const data = await apiAdmin.listarUsuarios();
      
 
      const usuariosNormalizados = data.map(u => ({
        ...u,
        rol: normalizarRoles(u.rol)
      }));
      
      setUsuarios(usuariosNormalizados);
    } catch (err: any) {
      console.error("Error cargando usuarios:", err);
      setError(err.message || "Error al cargar usuarios");
    } finally {
      setCargando(false);
    }
  }, []);


  const obtenerRolesTexto = (usuario: Usuario): string => {
    const roles = normalizarRoles(usuario.rol);
    if (roles.length === 0) return "Sin rol";
    

    const roleIds = Array.from(new Set(roles.map(r => getRolId(r))));
    
    return roleIds.map(rolId => 
      rolId === Rol.ADMIN ? "Administrador" : "Usuario"
    ).join(", ");
  };


  const obtenerRolPrincipal = (usuario: Usuario): string => {
    return tieneRol(usuario, Rol.ADMIN)
      ? "Administrador"
      : "Usuario";
  };


  const asignarRol = useCallback(async (usuarioId: string, rol: Rol) => {
    const usuario = usuarios.find(u => u.id === usuarioId);
    
    if (!usuario) return;

    if (tieneRol(usuario, rol)) {
      alert("El usuario ya tiene este rol");
      return;
    }

    const rolTexto = rol === Rol.ADMIN ? "Administrador" : "Usuario";
    const confirmado = window.confirm(
      `¿Asignar rol de "${rolTexto}" a ${usuario.perfil?.nombreCompleto || usuario.correo}?`
    );

    if (!confirmado) return;

    try {
      setCargando(true);
      setError("");

      await apiAdmin.asignarRol(usuarioId, rol);

      const data = await apiAdmin.listarUsuarios();
      const usuariosNormalizados = data.map(u => ({
        ...u,
        rol: normalizarRoles(u.rol)
      }));
      setUsuarios(usuariosNormalizados);

      alert(`Rol de "${rolTexto}" asignado exitosamente`);
    } catch (err: any) {
      console.error("Error asignando rol:", err);
      setError(err.message || "Error al asignar el rol");
      alert(`Error: ${err.message || "No se pudo asignar el rol"}`);
    } finally {
      setCargando(false);
    }
  }, [usuarios]);


  const quitarRol = useCallback(async (usuarioId: string, rol: Rol) => {
    const usuario = usuarios.find(u => u.id === usuarioId);
    if (!usuario) return;

    if (!tieneRol(usuario, rol)) {
      alert("El usuario no tiene este rol");
      return;
    }

    const rolTexto = rol === Rol.ADMIN ? "Administrador" : "Usuario";
    const confirmado = window.confirm(
      `¿Quitar rol de "${rolTexto}" a ${usuario.perfil?.nombreCompleto || usuario.correo}?`
    );

    if (!confirmado) return;

    try {
      setCargando(true);
      setError("");

      await apiAdmin.sacarRol(usuarioId, rol);

      const data = await apiAdmin.listarUsuarios();
      const usuariosNormalizados = data.map(u => ({
        ...u,
        rol: normalizarRoles(u.rol)
      }));
      setUsuarios(usuariosNormalizados);

      alert(`Rol de "${rolTexto}" quitado exitosamente`);
    } catch (err: any) {
      console.error("Error quitando rol:", err);
      setError(err.message || "Error al quitar el rol");
      alert(`Error: ${err.message || "No se pudo quitar el rol"}`);
    } finally {
      setCargando(false);
    }
  }, [usuarios]);


  const toggleRol = useCallback(async (usuarioId: string, rol: Rol) => {
    const usuario = usuarios.find(u => u.id === usuarioId);
    if (!usuario) return;

    if (tieneRol(usuario, rol)) {
      await quitarRol(usuarioId, rol);

 
      setUsuarios(prev =>
        prev.map(u =>
          u.id === usuarioId
            ? { ...u, roles: u.rol.filter(r => r !== rol) }
            : u
        )
      );

    } else {
      await asignarRol(usuarioId, rol);


      setUsuarios(prev =>
        prev.map(u =>
          u.id === usuarioId
            ? { ...u, roles: [...u.rol, rol] }
            : u
        )
      );
    }
  }, [usuarios, asignarRol, quitarRol]);


  return {
    usuarios: usuariosFiltrados,
    busqueda,
    setBusqueda,
    cargando,
    error,
    cargarUsuarios,
    asignarRol,
    quitarRol,
    toggleRol,
    tieneRol,
    obtenerRolPrincipal,
    obtenerRolesTexto
  };
};
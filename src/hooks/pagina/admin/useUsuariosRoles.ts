
import { useState, useCallback } from "react";
import { Usuario } from "../../../modelos/Usuario";
import apiAdmin from "../../../api/endpoints/admin";
import { Rol } from "../../../modelos/Roles";


export const useUsuariosRoles = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string>("");

  // Filtrar usuarios por búsqueda
  const usuariosFiltrados = usuarios.filter(u => 
    u.perfil?.nombreCompleto?.toLowerCase().includes(busqueda.toLowerCase()) ||
    u.correo.toLowerCase().includes(busqueda.toLowerCase())
  );

  // Cargar usuarios
  const cargarUsuarios = useCallback(async () => {
    try {
      setCargando(true);
      setError("");
      
      //const data = await apiAdmin.listarUsuarios();
      //setUsuarios(data);
    } catch (err: any) {
      console.error("Error cargando usuarios:", err);
      setError(err.message || "Error al cargar usuarios");
    } finally {
      setCargando(false);
    }
  }, []);

  // Verificar si el usuario tiene un rol específico
  const tieneRol = (usuario: Usuario, rol: Rol): boolean => {
    return usuario.rol.includes(rol);
  };

  // Obtener texto del rol principal (para mostrar en la UI)
  const obtenerRolPrincipal = (usuario: Usuario): string => {
    if (tieneRol(usuario, Rol.ADMIN)) return "Administrador";
    return "Usuario";
  };

  // Asignar rol a usuario
  const asignarRol = useCallback(async (usuarioId: string, rol: Rol) => {
    const usuario = usuarios.find(u => u.id === usuarioId);
    if (!usuario) return;

    // Si ya tiene el rol, no hacer nada
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

      // Actualizar la lista local
      setUsuarios(prevUsuarios => 
        prevUsuarios.map(u => 
          u.id === usuarioId 
            ? { ...u, rol: [...u.rol, rol] } 
            : u
        )
      );

      alert(`Rol de "${rolTexto}" asignado exitosamente`);
    } catch (err: any) {
      console.error("Error asignando rol:", err);
      setError(err.message || "Error al asignar el rol");
      alert(`Error: ${err.message || "No se pudo asignar el rol"}`);
    } finally {
      setCargando(false);
    }
  }, [usuarios]);

  // Quitar rol de usuario
  const quitarRol = useCallback(async (usuarioId: string, rol: Rol) => {
    const usuario = usuarios.find(u => u.id === usuarioId);
    if (!usuario) return;

    // Si no tiene el rol, no hacer nada
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

      // Actualizar la lista local
      setUsuarios(prevUsuarios => 
        prevUsuarios.map(u => 
          u.id === usuarioId 
            ? { ...u, rol: u.rol.filter(r => r !== rol) } 
            : u
        )
      );

      alert(`Rol de "${rolTexto}" quitado exitosamente`);
    } catch (err: any) {
      console.error("Error quitando rol:", err);
      setError(err.message || "Error al quitar el rol");
      alert(`Error: ${err.message || "No se pudo quitar el rol"}`);
    } finally {
      setCargando(false);
    }
  }, [usuarios]);

  // Toggle rol (asignar si no tiene, quitar si tiene)
  const toggleRol = useCallback(async (usuarioId: string, rol: Rol) => {
    const usuario = usuarios.find(u => u.id === usuarioId);
    if (!usuario) return;

    if (tieneRol(usuario, rol)) {
      await quitarRol(usuarioId, rol);
    } else {
      await asignarRol(usuarioId, rol);
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
    obtenerRolPrincipal
  };
};

export const registrarUsuario = async (nombre: string, correo: string, password: string) => {
  const res = await fetch("http://localhost:8080/api/usuarios/registrar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre, correo, password }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Error al registrarse");
  }

  return await res.json(); 
};

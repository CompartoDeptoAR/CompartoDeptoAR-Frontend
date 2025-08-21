
export const loginUsuario = async (email: string, password: string) => {
  const res = await fetch("http://localhost:8080/api/usuario/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Usuario o contraseña incorrectos");
  }

  return await res.json(); // Devuelve { token, role, ... }
};

export const decodificarJWT = (token: string): any => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error al decodificar JWT:', error);
    return null;
  }
};


export const estaTokenExpirado = (token: string): boolean => {
  const payload = decodificarJWT(token);
  if (!payload || !payload.exp) {
    return true;
  }

  const fechaExpiracion = payload.exp * 1000;
  const ahora = Date.now();
  return ahora >= (fechaExpiracion - 30000);
};


export const getTiempoRestante = (token: string): number => {
  const payload = decodificarJWT(token);
  if (!payload || !payload.exp) {
    return 0;
  }

  const fechaExpiracion = payload.exp * 1000;
  const ahora = Date.now();
  const tiempoRestante = fechaExpiracion - ahora;

  return tiempoRestante > 0 ? tiempoRestante : 0;
};
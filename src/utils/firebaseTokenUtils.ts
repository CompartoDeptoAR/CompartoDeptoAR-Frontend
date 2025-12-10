export const decodificarFirebaseToken = (token: string): any => {
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
    console.error('Error al decodificar token Firebase:', error);
    return null;
  }
};

export const estaTokenExpirado = (token: string): boolean => {
  const payload = decodificarFirebaseToken(token);
  if (!payload || !payload.exp) {
    return true;
  }

  const fechaExpiracion = payload.exp * 1000;
  const ahora = Date.now();
  return ahora >= fechaExpiracion;
};

export const getTiempoRestante = (token: string): number => {
  const payload = decodificarFirebaseToken(token);
  if (!payload || !payload.exp) {
    return 0;
  }

  const fechaExpiracion = payload.exp * 1000;
  const ahora = Date.now();
  return Math.max(0, fechaExpiracion - ahora);
};
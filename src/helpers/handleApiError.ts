export function handleApiError(error: any, fallbackMessage: string): never {
  if (error?.response?.data?.message) {
    throw new Error(error.response.data.message);
  }
  if (error?.response?.status) {
    throw new Error(`Error ${error.response.status}: ${fallbackMessage}`);
  }
  throw new Error("Error de conexión con el servidor");
}

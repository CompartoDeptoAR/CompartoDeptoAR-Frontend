import axios from "axios";

const BASE_URL =
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_API_URL
    : import.meta.env.VITE_API_URL_RENDER;

if (!BASE_URL) {
  console.error("❌ ERROR: BASE_URL no está definida en las variables de entorno.");
}

const axiosApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 45000,
});

export default axiosApi;


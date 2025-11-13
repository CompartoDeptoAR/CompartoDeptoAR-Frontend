import axiosApi from "./axios.config";
import isPublicRoute from "./constants";

axiosApi.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    
    console.log("🔍 URL:", config.url);
    console.log("🔑 Token:", token ? "existe" : "NO EXISTE");
    console.log("🚪 Es ruta pública?", isPublicRoute(config.url || ""));
    
    if (token && config.url && !isPublicRoute(config.url)) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
      console.log("✅ Header agregado:", config.headers.Authorization);
    } else {
      console.log("❌ NO se agregó el header");
    }
    
    return config;
  }, function (error) {
    return Promise.reject(error);
  });
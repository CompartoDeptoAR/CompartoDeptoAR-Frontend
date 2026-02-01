import { FiltrosBusqueda, Publicacion } from "../../../modelos/Publicacion";
import axiosApi from "../config/axios.config";

const urlApi = import.meta.env.VITE_URL_PUBLICACION;

const apiBuscador = {

  buscar: async (texto: string): Promise<Publicacion[]> => {
    const textoLimpio = texto.trim();
    
    if (!textoLimpio) {
      throw new Error("Por favor, ingresá algo para buscar");
    }
    try {  
      const res = await axiosApi.get<Publicacion[]>(`${urlApi}/search`, {
        params: {
          q: textoLimpio
        }
      });
      return res.data;
      
    } catch (error: any) {
      if (error.response?.data?.mensaje) {
        throw new Error(error.response.data.mensaje);
      }
    
      if (error.response?.status === 404) {
        throw new Error("Servicio de búsqueda no disponible. Intenta más tarde.");
      }

      if (error.response?.status === 400) {
        throw new Error("Búsqueda inválida. Intenta con otras palabras.");
      }
 
      if (error.request) {
        throw new Error("No se pudo conectar con el servidor. Verifica tu conexión.");
      }
    
      throw new Error("Error al realizar la búsqueda. Intenta nuevamente.");
    }
  },

  buscarConFiltros: async (filtros: FiltrosBusqueda): Promise<Publicacion[]> => {
    console.log("🔍 Enviando filtros al backend:", filtros);
    
    try {
      const filtrosLimpios: Partial<FiltrosBusqueda> = {};
      
      (Object.keys(filtros) as Array<keyof FiltrosBusqueda>).forEach(key => {
        const valor = filtros[key];
        if (typeof valor === 'string' && valor.trim() !== '') {
          filtrosLimpios[key] = valor.trim() as any;
        }
        else if (typeof valor === 'number' && !isNaN(valor)) {
          filtrosLimpios[key] = valor as any;
        }
        else if (typeof valor === 'boolean' && valor === true) {
          filtrosLimpios[key] = true as any;
        }
      });
      
      console.log("🧹 Filtros limpios enviados:", filtrosLimpios);
      
      const url = `${urlApi}/buscarConFiltros`;
      console.log("📍 URL completa de filtros:", url);
      
      const res = await axiosApi.post<Publicacion[]>(url, filtrosLimpios);
      
      console.log(`✅ Resultados encontrados: ${res.data.length}`);
      return res.data;
      
    } catch (error: any) {
      console.error("❌ Error al aplicar filtros:", error);
      console.error("📍 URL intentada:", `${urlApi}/buscarConFiltros`);
      console.error("📍 Base URL de axios:", axiosApi.defaults.baseURL);
      
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      
      if (error.response?.data?.mensaje) {
        throw new Error(error.response.data.mensaje);
      }
      
      if (error.response?.status === 404) {
        throw new Error("Endpoint de filtros no encontrado. Verifica la configuración del backend.");
      }
      
      throw new Error("Error al aplicar los filtros. Intenta nuevamente.");
    }
  }
}

export default apiBuscador;
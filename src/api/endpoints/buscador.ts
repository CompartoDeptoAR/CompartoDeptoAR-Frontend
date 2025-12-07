import { Publicacion } from "../../modelos/Publicacion";
import axiosApi from "../config/axios.config";

const urlApi = import.meta.env.VITE_URL_PUBLICACION;

const apiBuscador = {
  // texto  solito
  buscar: async (texto: string): Promise<Publicacion[]> => {
    //onsole.log("Iniciando búsqueda con texto:", texto);
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
      //console.log("Búsqueda exitosa. Resultados:", res.data.length);
      return res.data;
      
    } catch (error: any) {
      //console.error(" Error en búsqueda:", error);
    
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

  //filtros, ver desp los filtros del modelo
  buscarConFiltros: async (filtros: any): Promise<Publicacion[]> => {
    console.log("🔍 Aplicando filtros:", filtros);
    
    try {
      
      const filtrosLimpios: any = {};
      Object.keys(filtros).forEach(key => {
        if (filtros[key] !== undefined && filtros[key] !== null && filtros[key] !== '') {
          filtrosLimpios[key] = filtros[key];
        }
      });
      
  
      const res = await axiosApi.post<Publicacion[]>(
        `${urlApi}/buscarConFiltros`, 
        filtrosLimpios
      );
      
     // console.log("Filtros aplicados. Resultados:", res.data.length);
      return res.data;
      
    } catch (error: any) {
     // console.error("Error al aplicar filtros:", error);
      
      if (error.response?.data?.mensaje) {
        throw new Error(error.response.data.mensaje);
      }
      
      throw new Error("Error al aplicar los filtros. Intenta nuevamente.");
    }
  }
};

export default apiBuscador;
import apiDenuncia from "../../../api/endpoints/denuncia";
import { useFormularioContacto } from "./useFormularioContacto";


export function useDenuncia() {
  return useFormularioContacto({
    enviarFn: apiDenuncia.denuncia.enviarDenuncia,
    maxPalabras: 500,
  });
}
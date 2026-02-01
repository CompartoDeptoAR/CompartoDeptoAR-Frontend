import apiContactanos from "../../../services/api/endpoints/contacto";
import { useFormularioContacto } from "./useFormularioContacto";

export function useContactanos() {
  return useFormularioContacto({
    enviarFn: apiContactanos.contacto.enviarMensaje,
    maxPalabras: 300,
  });
}
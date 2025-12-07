import apiContactanos from "../../../api/endpoints/contacto";
import { useFormularioContacto } from "./useFormularioContacto";

export function useContactanos() {
  return useFormularioContacto({
    enviarFn: apiContactanos.contacto.enviarMensaje,
    maxPalabras: 300,
  });
}
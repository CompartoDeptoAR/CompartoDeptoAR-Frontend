import { useToast } from "../../../useToast";
import { Navegar } from "../../../../navigation/navigationService";
import { LocalStorageService, STORAGE_KEYS } from "../../../../services/storage/localStorage.service";

export const useAccionesPublicacion = (publicacion: any) => {
  const usuarioActualId = LocalStorageService.get(STORAGE_KEYS.USER_ID);
  const { showInfo } = useToast();

  const handleContactar = () => {
    if (!usuarioActualId) {
      showInfo("Debes iniciar sesión para contactar al anunciante");
      setTimeout(() => Navegar.auth(), 1500);
      return;
    }

    if (publicacion?.usuarioId === usuarioActualId) {
      showInfo("No puedes contactarte a ti mismo");
      return;
    }

    Navegar.chat(publicacion?.usuarioId!);
  };

  return {
    usuarioActualId,
    handleContactar,
  };
};
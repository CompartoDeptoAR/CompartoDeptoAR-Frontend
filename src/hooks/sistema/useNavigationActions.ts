import { Navegar } from "../../navigation/navigationService";

export const useNavigationActions = () => {

  const handleCancel = () => {
    Navegar.volverAtras();
  };

  const goToMisPublicaciones = () => {
    Navegar.misPublicaciones();
  };

  const goToAuth = () => {
    Navegar.auth();
  };

  return {
    handleCancel,
    goToMisPublicaciones,
    goToAuth,
  };
};

import { Navigation } from "../../navigation/navigationService";

export const useNavigationActions = () => {

  const handleCancel = () => {
    Navigation.volverAtras();
  };

  const goToMisPublicaciones = () => {
    Navigation.misPublicaciones();
  };

  const goToAuth = () => {
    Navigation.auth();
  };

  return {
    handleCancel,
    goToMisPublicaciones,
    goToAuth,
  };
};

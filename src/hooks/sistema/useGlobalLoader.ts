import { useLoading } from "../../contexts/LoadingContext";


export const useGlobalLoader = () => {
  const { loading,showLoader, hideLoader } = useLoading();
  return { loading ,showLoader, hideLoader };
};

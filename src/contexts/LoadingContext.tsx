import { createContext, useContext, useState } from "react";

interface LoadingContextType {
  loading: boolean;
  showLoader: () => void;
  hideLoader: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const LoadingProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(false);

  const showLoader = () => setLoading(true);
  const hideLoader = () => setLoading(false);

  return (
    <LoadingContext.Provider value={{ loading, showLoader, hideLoader }}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const ctx = useContext(LoadingContext);
  if (!ctx) {
    throw new Error("useLoading debe usarse dentro de ");
  }
  return ctx;
};

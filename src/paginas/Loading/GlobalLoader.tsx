import React from "react";
import { useLoading } from "../../contexts/LoadingContext";


const GlobalLoader: React.FC = () => {
  const { loading } = useLoading();
  if (!loading) return null;

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-50">
      <div className="animate-spin border-4 border-gray-300 border-t-blue-500 rounded-full w-12 h-12 mb-3"></div>
      <p className="text-gray-600">Cargando...</p>
    </div>
  );
};

export default GlobalLoader;

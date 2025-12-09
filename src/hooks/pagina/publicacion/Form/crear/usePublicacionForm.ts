import { useCallback, useState } from "react";
import type { EstadoPublicacion, Publicacion } from "../../../../../modelos/Publicacion";
import { PreferenciasUsuario, HabitosUsuario } from "../../../../../modelos/Usuario";
const PublicacionNull:Publicacion={
    titulo: "",
    descripcion: "",
    precio: 0,
    provincia: "",
    localidad: "",
    calle: "",
    numeral:"",
    foto: [],
    reglas: [],      
    reglasTexto: "",   
    preferencias: {} as PreferenciasUsuario,
    habitos: {} as HabitosUsuario,
    estado: "activa" as EstadoPublicacion,
}
export const usePublicacionForm = () => {
  const [formData, setFormData] = useState<Publicacion>(PublicacionNull);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "reglasTexto") {
      setFormData((prev) => ({
        ...prev,
        reglasTexto: value,
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: name === "precio" ? Number(value) : value,
    }));
  };

  const handlePreferenciasChange = useCallback((preferencias: PreferenciasUsuario) => {
    setFormData(prev => ({ ...prev, preferencias }));
  }, []);

  const handleHabitosChange = useCallback((habitos: HabitosUsuario) => {
    setFormData(prev => ({ ...prev, habitos }));
  }, []);


  const handleProvinciaChange = (provincia: string) => {
    setFormData((prev) => ({ ...prev, provincia, localidad: "" }));
  };

  const handleLocalidadChange = (localidad: string) => {
    setFormData((prev) => ({ ...prev, localidad }));
  };

  const handleFotosChange = (fotos: string[]) => {
    setFormData((prev) => ({ ...prev, foto: fotos }));
  };
  const resetForm = () => {
  setFormData(PublicacionNull);
};

  return {
    formData,
    resetForm,
    setFormData,
    handleChange,
    handleProvinciaChange,
    handleLocalidadChange,
    handleFotosChange,
    handlePreferenciasChange,
    handleHabitosChange,
  };
};

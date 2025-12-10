import { useCallback, useState } from "react";
import type { EstadoPublicacion, Publicacion } from "../../../../../modelos/Publicacion";
import { PreferenciasUsuario, HabitosUsuario } from "../../../../../modelos/Usuario";

// 🔥 Función que genera un objeto completamente nuevo cada vez
const crearPublicacionVacia = (): Publicacion => ({
  titulo: "",
  descripcion: "",
  precio: 0,
  provincia: "",
  localidad: "",
  calle: "",
  numeral: "",
  foto: [],
  reglas: [],
  reglasTexto: "",
  preferencias: {},
  habitos: {},
  estado: "activa" as EstadoPublicacion,
});

export const usePublicacionForm = () => {
  const [formData, setFormData] = useState<Publicacion>(crearPublicacionVacia());

  const handleChange = useCallback((
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
  }, []);

  const handlePreferenciasChange = useCallback((preferencias: PreferenciasUsuario) => {
    console.log("📝 Actualizando preferencias:", preferencias);
    setFormData(prev => ({ 
      ...prev, 
      preferencias: { ...preferencias } 
    }));
  }, []);

  const handleHabitosChange = useCallback((habitos: HabitosUsuario) => {
    console.log("📝 Actualizando hábitos:", habitos);
    setFormData(prev => ({ 
      ...prev, 
      habitos: { ...habitos } 
    }));
  }, []);

  const handleProvinciaChange = useCallback((provincia: string) => {
    setFormData((prev) => ({ ...prev, provincia, localidad: "" }));
  }, []);

  const handleLocalidadChange = useCallback((localidad: string) => {
    setFormData((prev) => ({ ...prev, localidad }));
  }, []);

  const handleFotosChange = useCallback((fotos: string[]) => {
    setFormData((prev) => ({ ...prev, foto: [...fotos] }));
  }, []);

  const resetForm = useCallback(() => {
    console.log("🔄 Reseteando formulario completo");
    setFormData(crearPublicacionVacia());
  }, []);

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
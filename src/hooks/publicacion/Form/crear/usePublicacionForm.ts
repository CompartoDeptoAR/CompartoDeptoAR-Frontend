import { useState } from "react";
import type { EstadoPublicacion, Publicacion } from "../../../../modelos/Publicacion";
import { PreferenciasUsuario, HabitosUsuario } from "../../../../modelos/Usuario";

export const usePublicacionForm = () => {
  const [formData, setFormData] = useState<Publicacion>({
    titulo: "",
    descripcion: "",
    precio: 0,
    provincia: "",
    localidad: "",
    direccion: "",
    ubicacion: "", 
    foto: [],
    reglas: [],
    preferencias: {} as PreferenciasUsuario, 
    habitos: {} as HabitosUsuario,
    estado: "activa" as EstadoPublicacion,
  });


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "reglas") {
      const reglasArray = value
        .split("\n")
        .map((r) => r.trim())
        .filter((r) => r.length > 0);

      setFormData((prev) => ({ ...prev, reglas: reglasArray }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: name === "precio" ? Number(value) : value,
    }));
  };

  const handleProvinciaChange = (provincia: string) => {
    setFormData((prev) => ({ ...prev, provincia, localidad: "" }));
  };

  const handleLocalidadChange = (localidad: string) => {
    setFormData((prev) => ({ ...prev, localidad }));
  };

  const handleFotosChange = (fotos: string[]) => {
    setFormData((prev) => ({ ...prev, foto: fotos }));
  };


  return {
    formData,
    setFormData,
    handleChange,
    handleProvinciaChange,
    handleLocalidadChange,
    handleFotosChange,
  };
};

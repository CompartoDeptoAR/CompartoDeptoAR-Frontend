import { useState } from "react";
import FormularioPublicacion from "../../componentes/FormularioPublicacion/FormularioPublicacion";
import type { PreferenciasUsuario } from "../../modelos/Usuario";

const CrearPublicacion = () => {
  const [publicacion, setPublicacion] = useState({
    titulo: "",
    ubicacion: "",
    precio: 0,
    descripcion: "",
    foto: "",
    reglas: "",
    preferencia: {} as PreferenciasUsuario,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPublicacion((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones
    if (!publicacion.titulo || !publicacion.ubicacion || !publicacion.precio || !publicacion.descripcion) {
      alert("Por favor completa todos los campos requeridos.");
      return;
    }

    console.log("Publicación enviada:", publicacion);
    alert("¡Publicación creada exitosamente!");
    // Acá luego iría la conexión con el backend (POST)
  };

  return (
    <FormularioPublicacion
      publicacion={publicacion}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
    />
  );
};

export default CrearPublicacion;

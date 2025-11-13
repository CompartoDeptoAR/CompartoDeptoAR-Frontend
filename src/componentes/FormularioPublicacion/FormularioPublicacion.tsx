import type React from "react";
import type { PreferenciasUsuario } from "../../modelos/Usuario";

interface FormularioPublicacionProps {
  publicacion: {
    titulo: string;
    ubicacion: string;
    precio: number;
    descripcion: string;
    foto: string;
    reglas: string;
    preferencia: PreferenciasUsuario;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

const FormularioPublicacion: React.FC<FormularioPublicacionProps> = ({
  publicacion,
  handleChange,
  handleSubmit,
}) => {
  return (
    <form onSubmit={handleSubmit}>
      <label>
        Título del anuncio*:
        <input
          type="text"
          name="titulo"
          value={publicacion.titulo}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Ubicación*:
        <input
          type="text"
          name="ubicacion"
          value={publicacion.ubicacion}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Precio del alquiler*:
        <input
          type="number"
          name="precio"
          value={publicacion.precio}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Descripción de la vivienda*:
        <textarea
          name="descripcion"
          value={publicacion.descripcion}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Reglas o condiciones:
        <textarea
          name="reglas"
          value={publicacion.reglas}
          onChange={handleChange}
        />
      </label>

      <label>
        Foto:
        <input
          type="text"
          name="foto"
          placeholder="URL de la imagen"
          value={publicacion.foto}
          onChange={handleChange}
        />
      </label>

      <button type="submit">Publicar</button>
    </form>
  );
};

export default FormularioPublicacion;

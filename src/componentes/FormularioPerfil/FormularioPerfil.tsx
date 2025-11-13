import { useState, useEffect } from "react";
import type { UsuarioPerfil, HabitosUsuario, PreferenciasUsuario } from "../../modelos/Usuario";
import "../../styles/FormularioPerfil.css";
import { habitosConfig, opcionesGenero, preferenciasConfig } from "./helpers/config";
import CampoTexto from "./helpers/CampoTexto";
import CampoSelect from "./helpers/CampoSelect";
import CampoTextArea from "./helpers/CampoTextArea";
import BotonesFormulario from "./helpers/BotonesFormulario";
import SeccionCheckboxes from "./helpers/SeccionCheckboxes";

interface FormularioPerfilProps {
  perfil: UsuarioPerfil;
  modo: "view" | "editar" | "verOtro";
  onSubmit?: (usuario: UsuarioPerfil) => void;
}


const FormularioPerfil: React.FC<FormularioPerfilProps> = ({ perfil, modo, onSubmit }) => {
  const [formData, setFormData] = useState<UsuarioPerfil>(perfil);

  useEffect(() => {
    if (perfil) {
      setFormData(perfil);
    }
  }, [perfil]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "edad" ? parseInt(value) : value,
    }));
  };

  const toggleHabito = (key: keyof HabitosUsuario) => {
    setFormData((prev) => ({
      ...prev,
      habitos: {
        ...(prev.habitos ?? {}),
        [key]: !prev.habitos?.[key],
      },
    }));
  };

  const togglePreferencia = (key: keyof PreferenciasUsuario) => {
    setFormData((prev) => ({
      ...prev,
      preferencias: {
        ...(prev.preferencias ?? {}),
        [key]: !prev.preferencias?.[key],
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  const esSoloVista = modo === "view" || modo === "verOtro";

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <CampoTexto
        label="Nombre"
        name="nombreCompleto"
        value={formData.nombreCompleto}
        esSoloVista={esSoloVista}
        onChange={handleChange}
        required
      />

      <CampoTexto
        label="Edad"
        name="edad"
        value={formData.edad}
        type="number"
        esSoloVista={esSoloVista}
        onChange={handleChange}
        required
        min={18}
        max={100}
      />

      <CampoSelect
        label="Género"
        name="genero"
        value={formData.genero}
        opciones={opcionesGenero}
        esSoloVista={esSoloVista}
        onChange={handleChange}
        required
      />

      <CampoTextArea
        label="Descripción"
        name="descripcion"
        value={formData.descripcion || ""}
        esSoloVista={esSoloVista}
        onChange={handleChange}
        placeholder="Cuéntanos sobre ti..."
      />

      <SeccionCheckboxes<HabitosUsuario>
        titulo="Hábitos"
        config={habitosConfig}
        datos={formData.habitos}
        esSoloVista={esSoloVista}
        onToggle={toggleHabito}
        textoVacio="Sin hábitos especificados"
      />

      <SeccionCheckboxes<PreferenciasUsuario>
        titulo="Preferencias"
        config={preferenciasConfig}
        datos={formData.preferencias}
        esSoloVista={esSoloVista}
        onToggle={togglePreferencia}
        textoVacio="Sin preferencias especificadas"
      />

      <BotonesFormulario modo={modo} />
    </form>
  );
};

export default FormularioPerfil;
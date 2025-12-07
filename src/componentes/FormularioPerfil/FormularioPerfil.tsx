import { useState, useEffect } from "react";
import type { UsuarioPerfil, HabitosUsuario, PreferenciasUsuario } from "../../modelos/Usuario";
import "../../styles/FormularioPerfil.css";
import { habitosConfig, opcionesGenero, preferenciasConfig } from "./helpers/config";
import CampoTexto from "./helpers/CampoTexto";
import CampoSelect from "./helpers/CampoSelect";
import CampoTextArea from "./helpers/CampoTextArea";
import BotonesFormulario from "./helpers/BotonesFormulario";
import SeccionCheckboxes from "./helpers/SeccionCheckboxes";
import GestorFotos from "../Publicacion/componenteSecundario/Formulario/GestorFotos";
import axiosApi from "../../api/config/axios.config";

interface FormularioPerfilProps {
  perfil: UsuarioPerfil;
  modo: "view" | "editar" | "verOtro";
  onSubmit?: (usuario: UsuarioPerfil) => void;
}

interface SubirFotoResponse {
  mensaje: string;
  url: string;
}

const FormularioPerfil: React.FC<FormularioPerfilProps> = ({ perfil, modo, onSubmit }) => {
  const [formData, setFormData] = useState<UsuarioPerfil>(perfil);
  const [subiendo, setSubiendo] = useState(false);

  useEffect(() => {
    if (perfil) setFormData(perfil);
  }, [perfil]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "edad" ? parseInt(value) : value,
    }));
  };

  const toggleHabito = (key: keyof HabitosUsuario) => {
    setFormData(prev => ({
      ...prev,
      habitos: { ...(prev.habitos ?? {}), [key]: !prev.habitos?.[key] },
    }));
  };

  const togglePreferencia = (key: keyof PreferenciasUsuario) => {
    setFormData(prev => ({
      ...prev,
      preferencias: { ...(prev.preferencias ?? {}), [key]: !prev.preferencias?.[key] },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) onSubmit(formData);
  };

  const esSoloVista = modo === "view" || modo === "verOtro";

  return (
    <div className="perfil-wrapper">
      <div className="perfil-header">Mi Perfil 🤘🏻</div>

      <div className="perfil-card">

        {/* FOTO DE PERFIL */}
        <div className="perfil-foto-area">
          <img
            src={formData.fotoPerfil || "/default-user.jpg"}
            alt="foto usuario"
            className="perfil-foto"
          />

          {subiendo && <div className="subiendo-texto">Subiendo foto...</div>}
        </div>

        <form className="perfil-form" onSubmit={handleSubmit}>
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

          {/* SOLO MOSTRAR EL GESTOR DE FOTOS EN EDITAR */}
          {modo === "editar" && (
            <GestorFotos
              fotos={formData.fotoPerfil ? [formData.fotoPerfil] : []}
              onFotosChange={(nuevasFotos) =>
                setFormData(prev => ({
                  ...prev,
                  fotoPerfil: nuevasFotos[0] || "",
                }))
              }
              disabled={false}
              titulo="Foto de perfil"
            />
          )}

          <BotonesFormulario modo={modo} />
        </form>
      </div>
    </div>
  );
};

export default FormularioPerfil;

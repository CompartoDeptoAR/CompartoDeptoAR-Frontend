import { useState, useEffect } from "react";
import type { UsuarioPerfil, HabitosUsuario, PreferenciasUsuario } from "../../modelos/Usuario";
import "../../styles/FormularioPerfil.css";
import { habitosConfig, opcionesGenero, preferenciasConfig } from "./helpers/config";
import CampoTexto from "./helpers/CampoTexto";
import CampoSelect from "./helpers/CampoSelect";
import CampoTextArea from "./helpers/CampoTextArea";
import BotonesFormulario from "./helpers/BotonesFormulario";
import SeccionCheckboxes from "./helpers/SeccionCheckboxes";
import { Navegar } from "../../navigation/navigationService";


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
  const [preview, setPreview] = useState<string>(perfil.fotoPerfil || "");
  const [subiendo, setSubiendo] = useState(false);

  useEffect(() => {
    if (perfil) {
      setFormData(perfil);
      setPreview(perfil.fotoPerfil || "");
    }
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

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSubiendo(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreview(result);
        setFormData(prev => ({
          ...prev,
          fotoPerfil: result,
        }));
        setSubiendo(false);
      };
      reader.readAsDataURL(file);
    }
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
          <div className="perfil-foto-wrapper">
            <img
              src={preview || "/default-user.jpg"}
              alt="foto usuario"
              className="perfil-foto"
            />
            {subiendo && <div className="subiendo-spinner"></div>}
          </div>

          {!esSoloVista && modo === "editar" && (
            <label htmlFor="fotoPerfil" className="btn-cambiar-foto">
              📷 Cambiar foto
            </label>
          )}
          <input
            type="file"
            id="fotoPerfil"
            className="input-foto-hidden"
            accept="image/*"
            onChange={handleFotoChange}
            disabled={subiendo}
          />
          {subiendo && <div className="subiendo-texto">Subiendo foto...</div>}
        </div>

        <form className="perfil-form" onSubmit={handleSubmit}>
          <CampoTexto
            label="Nombre"
            name="nombreCompleto"
            value={formData.nombreCompleto || "Usuario"}
            esSoloVista={esSoloVista}
            onChange={handleChange}
            required
          />

          <div className="campos-fila">
            <div className="campo-grupo">
              <CampoTexto
                label="Edad"
                name="edad"
                value={formData.edad || "No se pudo obtener la edad"}
                type="number"
                esSoloVista={esSoloVista}
                onChange={handleChange}
                required
                min={18}
                max={100}
              />
            </div>
            <div className="campo-grupo">
              <CampoSelect
                label="Género"
                name="genero"
                value={formData.genero}
                opciones={opcionesGenero}
                esSoloVista={esSoloVista}
                onChange={handleChange}
                required
              />
            </div>
          </div>

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

          {modo === "view" && (
            <button 
              type="button"
              className="btn-volver-atras-perfil"
              onClick={() => Navegar.volverAtras()}
            >
              Volver
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default FormularioPerfil;
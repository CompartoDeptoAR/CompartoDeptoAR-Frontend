import { useState, useEffect } from "react";
import type { UsuarioPerfil, HabitosUsuario, PreferenciasUsuario, Genero } from "../../modelos/Usuario";
import "../../styles/FormularioPerfil.css";
import { habitosConfig, opcionesGenero, preferenciasConfig } from "./helpers/config";
import CampoTexto from "./helpers/CampoTexto";
import CampoSelect from "./helpers/CampoSelect";
import CampoTextArea from "./helpers/CampoTextArea";
import BotonesFormulario from "./helpers/BotonesFormulario";
import SeccionCheckboxes from "./helpers/SeccionCheckboxes";
import { Navegar } from "../../navigation/navigationService";
import PerfilGrafico from "../Calificacion/PerfilGrafico";
import imageCompression from 'browser-image-compression';

interface FormularioPerfilProps {
  perfil?: UsuarioPerfil; 
  modo: "view" | "editar" | "verOtro";
  onSubmit?: (usuario: UsuarioPerfil) => void;
}

const FormularioPerfil: React.FC<FormularioPerfilProps> = ({ perfil, modo, onSubmit }) => {
  const [formData, setFormData] = useState<UsuarioPerfil>({
    nombreCompleto: perfil?.nombreCompleto ?? "",
    edad: perfil?.edad ?? 18,
    genero: perfil?.genero,
    descripcion: perfil?.descripcion ?? "",
    fotoPerfil: perfil?.fotoPerfil ?? "",
    habitos: perfil?.habitos ?? {},
    preferencias: perfil?.preferencias ?? {},
  });

  const [preview, setPreview] = useState<string>(perfil?.fotoPerfil ?? "");
  const [subiendo, setSubiendo] = useState(false);

  useEffect(() => {
    if (perfil) {
      setFormData({
        nombreCompleto: perfil.nombreCompleto ?? "",
        edad: perfil.edad ?? 18,
        genero: perfil.genero,
        descripcion: perfil.descripcion ?? "",
        fotoPerfil: perfil.fotoPerfil ?? "",
        habitos: perfil.habitos ?? {},
        preferencias: perfil.preferencias ?? {},
      });
      setPreview(perfil.fotoPerfil ?? "");
    }
  }, [perfil]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "edad" ? parseInt(value) || 0 : value,
    }));
  };
// Le puse para comprimir imagen porq a veces bugeaba por eso y ni te avisaba
 const handleFotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    setSubiendo(true);
    try {
      const comprimida = await imageCompression(file, {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 800,
        useWebWorker: true
      });

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
      reader.readAsDataURL(comprimida);
    } catch (error) {
      console.error("Error comprimiendo imagen:", error);
      setSubiendo(false);
    }
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
            value={formData.nombreCompleto ?? ""}
            esSoloVista={esSoloVista}
            onChange={handleChange}
            required
          />

          {/* FILA DE EDAD + GÉNERO */}
          <div className="campos-fila" style={{ position: "relative", alignItems: "center" }}>
            <div className="campo-grupo" style={{ flex: 1 }}>
              <CampoTexto
                label="Edad"
                name="edad"
                value={formData.edad ?? 0}
                type="number"
                esSoloVista={esSoloVista}
                onChange={handleChange}
                required
                min={18}
                max={100}
              />
            </div>
            <div className="campo-grupo" style={{ flex: 1 }}>
              <CampoSelect
                label="Género"
                name="genero"
                value={formData.genero ?? undefined}
                opciones={opcionesGenero}
                esSoloVista={esSoloVista}
                onChange={handleChange}
                required
              />
            </div>

            {/* Gráfico al lado derecho del género */}
            {modo === "view" && perfil?.nombreCompleto && (
              <div style={{
                position: "absolute",
                right: 0,
                top: "50%",
                transform: "translateY(-50%)",
                width: "150px"
              }}>
                <PerfilGrafico idUsuario={perfil.nombreCompleto} /> {/* idUsuario real */}
              </div>
            )}
          </div>

          <CampoTextArea
            label="Descripción"
            name="descripcion"
            value={formData.descripcion ?? ""}
            esSoloVista={esSoloVista}
            onChange={handleChange}
            placeholder="Cuéntanos sobre ti..."
          />

          <SeccionCheckboxes<HabitosUsuario>
            titulo="Hábitos"
            config={habitosConfig}
            datos={formData.habitos ?? {}}
            esSoloVista={esSoloVista}
            onToggle={toggleHabito}
            textoVacio="Sin hábitos especificados"
          />

          <SeccionCheckboxes<PreferenciasUsuario>
            titulo="Preferencias"
            config={preferenciasConfig}
            datos={formData.preferencias ?? {}}
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

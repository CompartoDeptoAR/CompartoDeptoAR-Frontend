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
import PerfilCalificaciones from "../Calificacion/PerfilCalificaciones";
import imageCompression from 'browser-image-compression';
import { TokenService } from "../../services/auth/tokenService";
import { useMediaQuery } from "../../hooks/useMediaQuery"

interface FormularioPerfilProps {
  perfil?: UsuarioPerfil; 
  modo: "view" | "editar" | "verOtro";
  usuarioId?: string;
  onSubmit?: (usuario: UsuarioPerfil) => void;
}

const FormularioPerfil: React.FC<FormularioPerfilProps> = ({ perfil, modo, usuarioId, onSubmit }) => {
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

  const miUsuarioId = TokenService.getUserId();
  const esMiPerfil = usuarioId === miUsuarioId;
  const esSoloVista = modo === "view" || modo === "verOtro";

  const nombreUsuario = formData.nombreCompleto || "Usuario";

  // Detectar tamaño de pantalla
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(max-width: 1024px)');

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

  return (
    <div className="perfil-wrapper" style={{ padding: isMobile ? "10px" : "20px" }}>

      <div className="perfil-header" style={{ 
        fontSize: isMobile ? "18px" : "24px",
        padding: isMobile ? "15px" : "20px"
      }}>
        {modo === "verOtro" 
          ? `Perfil de ${nombreUsuario} 🤘🏻`
          : "Mi Perfil 🤘🏻"}
      </div>

      <div className="perfil-card" style={{ 
        padding: isMobile ? "15px" : "25px",
        margin: isMobile ? "10px 0" : "20px 0"
      }}>

        <div className="perfil-foto-area">
          <div className="perfil-foto-wrapper" style={{ 
            width: isMobile ? "120px" : "150px",
            height: isMobile ? "120px" : "150px"
          }}>
            <img
              src={preview || "/default-user.jpg"}
              alt={`Foto de ${nombreUsuario}`}
              className="perfil-foto"
              title={nombreUsuario}
              style={{
                width: isMobile ? "120px" : "150px",
                height: isMobile ? "120px" : "150px"
              }}
            />
            {subiendo && <div className="subiendo-spinner"></div>}
          </div>

          {modo === "verOtro" && (
            <div style={{
              marginTop: isMobile ? "5px" : "5px",
              textAlign: "center",
              fontWeight: "600",
              color: "#333",
              fontSize: isMobile ? "16px" : "18px"
            }}>
              {nombreUsuario}
            </div>
          )}

          {!esSoloVista && modo === "editar" && (
            <div style={{ marginTop: isMobile ? "10px" : "15px", width: "100%", maxWidth: "200px" }}>
              <label htmlFor="fotoPerfil" className="btn-cambiar-foto">
                📷 Cambiar foto
              </label>
            </div>
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

        <form className="perfil-form" onSubmit={handleSubmit} style={{ position: "relative" }}>
          {/* Solo mostrar campo Nombre en modo edición */}
          {modo === "editar" && (
            <CampoTexto
              label="Nombre"
              name="nombreCompleto"
              value={formData.nombreCompleto ?? ""}
              esSoloVista={esSoloVista}
              onChange={handleChange}
              required
            />
          )}

          {/* CONTENEDOR PRINCIPAL - Responsive */}
          <div style={{ 
            display: "flex", 
            flexDirection: isMobile ? "column" : "row",
            gap: isMobile ? "20px" : "25px",
            marginBottom: isMobile ? "20px" : "25px"
          }}>
            {/* COLUMNA IZQUIERDA - Campos de formulario */}
            <div style={{ 
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: isMobile ? "12px" : "15px"
            }}>
              {/* Fila Edad + Género */}
              <div style={{ 
                display: "flex", 
                flexDirection: isMobile ? "column" : "row",
                gap: isMobile ? "12px" : "15px"
              }}>
                {/* Edad */}
                <div style={{ flex: 1, width: isMobile ? "100%" : "auto" }}>
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
                
                {/* Género */}
                <div style={{ flex: 1, width: isMobile ? "100%" : "auto" }}>
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
              </div>

              {/* Descripción */}
              <div>
                <CampoTextArea
                  label="Descripción"
                  name="descripcion"
                  value={formData.descripcion ?? ""}
                  esSoloVista={esSoloVista}
                  onChange={handleChange}
                  placeholder="Cuéntanos sobre ti..."
                  rows={isMobile ? 4 : 5}
                />
              </div>
            </div>

            {/* COLUMNA DERECHA - Gráfico (solo para view/verOtro) */}
            {(modo === "view" || modo === "verOtro") && usuarioId && (
              <div style={{
                width: isMobile ? "100%" : "280px",
                flexShrink: 0
              }}>
                <PerfilCalificaciones 
                  idUsuario={usuarioId} 
                  esMiPerfil={esMiPerfil && modo === "view"}
                  nombreUsuario={modo === "verOtro" ? nombreUsuario : undefined}
                  isMobile={isMobile}
                />
              </div>
            )}
          </div>

          {/* Secciones de Hábitos y Preferencias */}
          <SeccionCheckboxes<HabitosUsuario>
            titulo="Hábitos"
            config={habitosConfig}
            datos={formData.habitos ?? {}}
            esSoloVista={esSoloVista}
            onToggle={toggleHabito}
            textoVacio="Sin hábitos especificados"
            isMobile={isMobile}
          />

          <SeccionCheckboxes<PreferenciasUsuario>
            titulo="Preferencias"
            config={preferenciasConfig}
            datos={formData.preferencias ?? {}}
            esSoloVista={esSoloVista}
            onToggle={togglePreferencia}
            textoVacio="Sin preferencias especificadas"
            isMobile={isMobile}
          />

          <BotonesFormulario modo={modo} isMobile={isMobile} />

          {modo === "view" && (
            <button
              type="button"
              className="btn-volver-atras-perfil"
              onClick={() => Navegar.volverAtras()}
              style={{
                padding: isMobile ? "10px 20px" : "12px 25px",
                fontSize: isMobile ? "14px" : "16px",
                marginTop: isMobile ? "15px" : "20px"
              }}
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
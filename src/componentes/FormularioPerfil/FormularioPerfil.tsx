import  { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { UsuarioPerfil, HabitosUsuario, PreferenciasUsuario } from "../../modelos/Usuario";

interface FormularioPerfilProps {
  perfil: UsuarioPerfil;
  modo: "view" | "editar" | "verOtro";
  onSubmit?: (usuario: UsuarioPerfil) => void;
}

// Mapeo de labels legibles a las keys del objeto HabitosUsuario
const habitosConfig: { key: keyof HabitosUsuario; label: string }[] = [
  { key: "fumador", label: "Fumador" },
  { key: "mascotas", label: "Tengo mascotas" },
  { key: "musicaFuerte", label: "Escucho música fuerte" },
  { key: "horariosNocturno", label: "Me acuesto tarde" },
  { key: "visitas", label: "Recibo visitas seguido" },
  { key: "orden", label: "Soy ordenado" },
  { key: "tranquilo", label: "Soy tranquilo" },
  { key: "social", label: "Soy social" },
  { key: "cocino", label: "Cocino en casa" },
  { key: "ejercicio", label: "Hago ejercicio en casa" },
];

// Mapeo de labels legibles a las keys del objeto PreferenciasUsuario
const preferenciasConfig: { key: keyof PreferenciasUsuario; label: string }[] = [
  { key: "fumador", label: "No me molesta que fumen" },
  { key: "mascotas", label: "No me molestan las mascotas" },
  { key: "musicaFuerte", label: "Ok con música fuerte" },
  { key: "horariosNocturno", label: "Ok con horarios nocturnos" },
  { key: "visitas", label: "Ok con visitas frecuentes" },
  { key: "orden", label: "Prefiero alguien ordenado" },
  { key: "tranquilo", label: "Prefiero alguien tranquilo" },
  { key: "social", label: "Prefiero alguien social" },
];

const FormularioPerfil: React.FC<FormularioPerfilProps> = ({ perfil, modo, onSubmit }) => {
  const [formData, setFormData] = useState<UsuarioPerfil>(perfil);
  const navigate = useNavigate();

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
      <div>
        <label>Nombre</label>
        {esSoloVista ? (
          <p>{formData.nombreCompleto}</p>
        ) : (
          <input
            type="text"
            name="nombreCompleto"
            value={formData.nombreCompleto}
            onChange={handleChange}
            required
          />
        )}
      </div>

      <div>
        <label>Edad</label>
        {esSoloVista ? (
          <p>{formData.edad}</p>
        ) : (
          <input
            type="number"
            name="edad"
            value={formData.edad}
            onChange={handleChange}
            required
            min={18}
            max={100}
          />
        )}
      </div>

      <div>
        <label>Género</label>
        {esSoloVista ? (
          <p>{formData.genero || "No especificado"}</p>
        ) : (
          <select name="genero" value={formData.genero} onChange={handleChange} required>
            <option value="">Seleccione una opción</option>
            <option value="Masculino">Masculino</option>
            <option value="Femenino">Femenino</option>
            <option value="Prefiero no decir">Prefiero no decir</option>
          </select>
        )}
      </div>

      <div>
        <label>Descripción</label>
        {esSoloVista ? (
          <p>{formData.descripcion || "Sin descripción"}</p>
        ) : (
          <textarea 
            name="descripcion" 
            value={formData.descripcion || ""} 
            onChange={handleChange}
            placeholder="Cuéntanos sobre ti..."
          />
        )}
      </div>

      <div>
        <fieldset>
          <label>Hábitos</label>
          {esSoloVista ? (
            <ul>
              {habitosConfig.map(({ key, label }) => (
                formData.habitos?.[key] && (
                  <li key={key}>{label}</li>
                )
              ))}
              {(!formData.habitos || Object.values(formData.habitos).every(v => !v)) && (
                <li>Sin hábitos especificados</li>
              )}
            </ul>
          ) : (
            <div>
              {habitosConfig.map(({ key, label }) => (
                <div key={key}>
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.habitos?.[key] || false}
                      onChange={() => toggleHabito(key)}
                    />
                    {label}
                  </label>
                </div>
              ))}
            </div>
          )}
        </fieldset>
      </div>

      <div>
        <fieldset>
          <label>Preferencias</label>
          {esSoloVista ? (
            <ul>
              {preferenciasConfig.map(({ key, label }) => (
                formData.preferencias?.[key] && (
                  <li key={key}>{label}</li>
                )
              ))}
              {(!formData.preferencias || Object.values(formData.preferencias).every(v => !v)) && (
                <li>Sin preferencias especificadas</li>
              )}
            </ul>
          ) : (
            <div>
              {preferenciasConfig.map(({ key, label }) => (
                <div key={key}>
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.preferencias?.[key] || false}
                      onChange={() => togglePreferencia(key)}
                    />
                    {label}
                  </label>
                </div>
              ))}
            </div>
          )}
        </fieldset>  
      </div>

      <div>
        {modo === "view" && (
          <button type="button" onClick={() => navigate("/perfil-edit")}>
            Editar Perfil
          </button>
        )}
        {modo === "editar" && (
          <>
            <button type="submit">Guardar Cambios</button>
            <button type="button" onClick={() => navigate("/perfil")}>
              Cancelar
            </button>
          </>
        )}
        {modo === "verOtro" && (
          <button type="button" onClick={() => navigate(-1)}>
            Volver
          </button>
        )}
      </div>
    </form>
  );
};

export default FormularioPerfil;
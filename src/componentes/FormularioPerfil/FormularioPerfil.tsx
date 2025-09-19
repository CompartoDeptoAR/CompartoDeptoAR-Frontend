import React, { useState } from "react";
import { opcionesHabitos, opcionesPreferencias, type UsuarioPerfil } from "../../modelos/Usuario";
import { useNavigate } from "react-router-dom";

interface FormularioPerfilProps {
  perfil: UsuarioPerfil;
  modo: "view" | "editar"|"verOtro";
  onSubmit?: (usuario: UsuarioPerfil) => void;
}

const FormularioPerfil: React.FC<FormularioPerfilProps> = ({ perfil, modo, onSubmit }) => {
  const perfilDefault: UsuarioPerfil = {
    nombreCompleto: "",
    edad: 0,
    genero: "Prefiero no decir",
    descripcion: "",
    habitos: [],
    preferencias: [],
  };

  const [formData, setFormData] = useState<UsuarioPerfil>(perfil ?? perfilDefault);
  const navigate = useNavigate();

  React.useEffect(() => {
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

  const toggleCheckbox = (nombreCampo: "habitos" | "preferencias", valor: string) => {
    setFormData((prev) => {
      const actual = prev[nombreCampo] as string[];
      const nuevo = actual!.includes(valor)
        ? actual!.filter((item) => item !== valor)
        : [...actual!, valor];

      return {
        ...prev,
        [nombreCampo]: nuevo,
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <div>
        <label>Nombre</label>
        {modo === "view" ? (
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
        {modo === "view" ? (
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
        {modo === "view" ? (
          <p>{formData.genero}</p>
        ) : (
          <select name="genero" value={formData.genero} onChange={handleChange} required>
            <option value="Masculino">Masculino</option>
            <option value="Femenino">Femenino</option>
            <option value="Prefiero no decir">Prefiero no decir</option>
          </select>
        )}
      </div>

      <div>
        <label>Descripción</label>
        {modo === "view" ? (
          <p>{formData.descripcion}</p>
        ) : (
          <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} />
        )}
      </div>

      <div>
        <label>Hábitos</label>
        {modo === "view" ? (
          <ul>
              {formData.habitos!.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        ) : (
          opcionesHabitos.map((habito) => (
            <div key={habito}>
              <label>
                <input
                  type="checkbox"
                  checked={formData.habitos!.includes(habito)}
                  onChange={() => toggleCheckbox("habitos", habito)}
                />
                {habito}
              </label>
            </div>
          ))
        )}
      </div>

      <div>
        <label>Preferencias</label>
        {modo === "view" ? (
          <ul>
            {formData.preferencias!.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        ) : (
          opcionesPreferencias.map((pref) => (
            <div key={pref}>
              <label>
                <input
                  type="checkbox"
                  checked={formData.preferencias!.includes(pref)}
                  onChange={() => toggleCheckbox("preferencias", pref)}
                />
                {pref}
              </label>
            </div>
          ))
        )}
      </div>

      <div>
        {modo === "view" && (
          <button type="button" onClick={() => navigate("/perfil-edit")}>
            Editar Perfil
          </button>
        )}
      </div>
    </form>
  );
};

export default FormularioPerfil;

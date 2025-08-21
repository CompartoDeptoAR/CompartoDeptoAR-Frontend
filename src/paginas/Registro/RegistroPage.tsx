import React, { useState } from "react";

import RegistroFormOpcional from "../../componentes/FormularioRegistro/RegistroFormOpcional";
import { useNavigate } from "react-router-dom";
import { registrarUsuario } from "../../api/hoock/useRegistro";
import type { Genero, PreferenciasUsuario } from "../../modelos/Usuario";
import RegistroForm from "../../componentes/FormularioRegistro/RegistroForm";

const RegistroPage: React.FC = () => {
  // Primer formulario
  const [nombreCompleto, setNombre] = useState<string>("");
  const [correo, setCorreo] = useState<string>("");
  const [contraseña, setPassword] = useState<string>("");
  const [mostrarPassword, setMostrarPassword] = useState<boolean>(false);

  // Segundo formulario (opcional)
  const [edad, setEdad] = useState<number | undefined>(undefined);
  const [genero, setGenero] = useState<Genero>("Prefiero no decir");
  const [descripcion, setDescripcion] = useState<string>("");
  const [preferencia, setPreferencia] = useState<PreferenciasUsuario>({ opciones: [] });

  const [paso, setPaso] = useState<1 | 2>(1); // controla qué formulario mostrar
  const navigate = useNavigate();

  const togglePassword = () => setMostrarPassword(!mostrarPassword);

  // Paso 1: completar el primer formulario
  const handleSubmitPrimerForm = (e: React.FormEvent) => {
    e.preventDefault();
    setPaso(2); // pasa al formulario opcional
  };

  // Paso 2: enviar registro completo
  const handleSubmitSegundoForm = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // llamar a tu hook de registro con los datos del primer form
      const data = await registrarUsuario(nombreCompleto, correo, contraseña);

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);

      // si querés guardar los datos opcionales, los mandás a otro endpoint o al mismo según tu backend
      const usuarioOpcional = {
        edad,
        genero,
        descripcion,
        preferencia,
      };
      console.log("Opcional:", usuarioOpcional);

      navigate("/home");
    } catch (err: any) {
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <div className="container mt-5">
      {paso === 1 && (
        <RegistroForm
          nombreCompleto={nombreCompleto}
          correo={correo}
          contraseña={contraseña}
          mostrarPassword={mostrarPassword}
          setNombreCompleto={setNombre}
          setCorreo={setCorreo}
          setContraseña={setPassword}
          togglePassword={togglePassword}
          handleSubmit={handleSubmitPrimerForm}
        />
      )}

      {paso === 2 && (
        <RegistroFormOpcional
          edad={edad || 0}
          genero={genero}
          descripcion={descripcion}
          preferencia={preferencia}
          setEdad={setEdad}
          setGenero={setGenero}
          setDescripcion={setDescripcion}
          setPreferencia={setPreferencia}
          handleSubmit={handleSubmitSegundoForm}
        />
      )}
    </div>
  );
};

export default RegistroPage;

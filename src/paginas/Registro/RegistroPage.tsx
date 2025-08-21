import React, { useState } from "react";

import SegundoFormRegistro from "../../componentes/FormularioRegistro/SegundoFormRegistro";
import { useNavigate } from "react-router-dom";

import type { Genero, HabitosUsuario, PreferenciasUsuario } from "../../modelos/Usuario";
import PrimerFormRegistro from "../../componentes/FormularioRegistro/PrimerFormRegistro";
import apiAuth from "../../api/api.auth";


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
  const [habitos, setHabitos] = useState<HabitosUsuario>({ opciones: [] });
  const [preferencia, setPreferencia] = useState<PreferenciasUsuario>({ opciones: [] });

  const [paso, setPaso] = useState<1 | 2>(1); 
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
      const data = await apiAuth.auth.registrar(
        nombreCompleto,
        correo,
        contraseña,
        edad!,
        genero,
        descripcion,
        habitos,
        preferencia
      );

      localStorage.setItem("token", data.token);
      localStorage.setItem("rol", data.rol);

      navigate("/home");
    } catch (err: any) {
      console.error(err);
      alert(err.message);
    }
  };


  return (
    <div className="container mt-5">
      {paso === 1 && (
        <PrimerFormRegistro
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
        <SegundoFormRegistro
          edad={edad || 0}
          genero={genero}
          descripcion={descripcion}
          habitos={habitos}
          preferencia={preferencia}
          setEdad={setEdad}
          setGenero={setGenero}
          setDescripcion={setDescripcion}
          setHabitos={setHabitos}
          setPreferencia={setPreferencia}
          handleSubmit={handleSubmitSegundoForm}
        />
      )}
    </div>
  );
};

export default RegistroPage;

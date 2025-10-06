import React, { useState } from "react";

import SegundoFormRegistro from "../../../componentes/FormularioRegistro/SegundoFormRegistro";
import { useNavigate } from "react-router-dom";

import type { Genero, HabitosOpciones, PreferenciaOpciones, } from "../../../modelos/Usuario";
import PrimerFormRegistro from "../../../componentes/FormularioRegistro/PrimerFormRegistro";
import apiAuth from "../../../api/endpoints/auth";

import '../../../styles/auth.css'

const RegistroPage = ({ onSwitch }: { onSwitch: () => void }) => {
  // Primer formulario
  const [nombreCompleto, setNombreCompleto] = useState<string>("");
  const [correo, setCorreo] = useState<string>("");
  const [contraseña, setContraseña] = useState<string>("");
  const [mostrarPassword, setMostrarPassword] = useState<boolean>(false);

  // Segundo formulario (opcional)
  const [edad, setEdad] = useState<number>(0);
  const [genero, setGenero] = useState<Genero>("Prefiero no decir");
  const [descripcion, setDescripcion] = useState<string>("");
  const [habitos, setHabitos] = useState<HabitosOpciones[]>([]);
  const [preferencia, setPreferencia] = useState<PreferenciaOpciones[]>([]);

  const [paso, setPaso] = useState<1 | 2>(1); 
  const navigate = useNavigate();

  const togglePassword = () => setMostrarPassword(!mostrarPassword);

  // Paso 1: completar el primer formulario
  const handlePaso1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setPaso(2); // pasa al formulario opcional
  };

  // Paso 2: enviar registro completo
  const handleRegistroFinal = async (e: React.FormEvent) => {
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
      localStorage.setItem("id", data.id);
      
      navigate("/home");
    } catch (err: any) {
      console.error(err);
      alert(err.message);
    }
  };

  const handleCancelarPaso2 = () => {
    setPaso(1); 
  };
  return (
    <div className={`registro-pasos-container paso-${paso}`}>
 
      <div className="registro-step paso-1">
        <PrimerFormRegistro
          nombreCompleto={nombreCompleto}
          correo={correo}
          contraseña={contraseña}
          mostrarPassword={mostrarPassword}
          setNombreCompleto={setNombreCompleto}
          setCorreo={setCorreo}
          setContraseña={setContraseña}
          togglePassword={togglePassword}
          handleSubmit={handlePaso1Submit}
          onSwitch={onSwitch}
        />
      </div>
  
      <div className="registro-step paso-2">
        <SegundoFormRegistro
          edad={edad}
          genero={genero}
          descripcion={descripcion}
          habitos={habitos}
          preferencia={preferencia}
          setEdad={setEdad}
          setGenero={setGenero}
          setDescripcion={setDescripcion}
          setHabitos={setHabitos}
          setPreferencia={setPreferencia}
          handleSubmit={handleRegistroFinal}
          onCancelar={handleCancelarPaso2}
        />
      </div>
    </div>
  );
};

export default RegistroPage;

import React, { useState } from "react";

import SegundoFormRegistro from "../../../componentes/FormularioRegistro/SegundoFormRegistro";
import { useNavigate } from "react-router-dom";

import type { Genero, HabitoKey, PreferenciaKey,} from "../../../modelos/Usuario";
import PrimerFormRegistro from "../../../componentes/FormularioRegistro/PrimerFormRegistro";
import apiAuth from "../../../api/endpoints/auth";

//import '../../../styles/auth.css'
import { arrayToHabitos, arrayToPreferencias } from "../../../helpers/convertersHabitosPreferncias";

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
  const [habitos, setHabitos] = useState<HabitoKey[]>([]);
  const [preferencias, setPreferencias] = useState<PreferenciaKey[]>([]);

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
      const habitosObj = arrayToHabitos(habitos);
      const preferenciasObj = arrayToPreferencias(preferencias);

      const data = await apiAuth.auth.registrar({
        nombreCompleto,
        correo,
        contraseña,
        edad,
        genero: genero !== "Prefiero no decir" ? genero : undefined,
        descripcion: descripcion.trim() || undefined,
        habitos: Object.keys(habitosObj).length > 0 ? habitosObj : undefined,
        preferencias: Object.keys(preferenciasObj).length > 0 ? preferenciasObj : undefined,
      });


      navigate("/auth/login");
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
          preferencias={preferencias}
          setEdad={setEdad}
          setGenero={setGenero}
          setDescripcion={setDescripcion}
          setHabitos={setHabitos}
          setPreferencias={setPreferencias}
          handleSubmit={handleRegistroFinal}
          onCancelar={handleCancelarPaso2}
        />
      </div>
    </div>
  );
};

export default RegistroPage;

import { useState } from "react";
import type { Genero, HabitoKey, PreferenciaKey } from "../../modelos/Usuario";
import { useToast } from "../useToast";
import { arrayToHabitos, arrayToPreferencias } from "../../helpers/convertersHabitosPreferncias";
import apiAuth from "../../services/api/endpoints/auth";



export function useRegistro(onSwitch: () => void) {
  // Paso actual
  const [mostrarPaso2, setMostrarPaso2] = useState(false);


  // Primer formulario
  const [nombreCompleto, setNombreCompleto] = useState("");
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);

  // Segundo formulario
  const [edad, setEdad] = useState<number>(0);
  const [genero, setGenero] = useState<Genero>("Prefiero no decir");
  const [descripcion, setDescripcion] = useState("");
  const [habitos, setHabitos] = useState<HabitoKey[]>([]);
  const [preferencias, setPreferencias] = useState<PreferenciaKey[]>([]);
  const [loading, setLoading] = useState(false);

  const { toast, setToast, showWarning, hideToast } = useToast();

  const togglePassword = () => setMostrarPassword(p => !p);

  
  const handlePaso1Submit = (e: React.FormEvent) => {
  e.preventDefault();
  console.log("HANDLE PASO 1");

  if (!nombreCompleto.trim()) {
    return showWarning("Por favor ingresa tu nombre completo");
  }
  if (!correo.trim() || !correo.includes("@")) {
    return showWarning("Por favor ingresa un email válido");
  }
  if (contraseña.length < 6) {
    return showWarning("La contraseña debe tener al menos 6 caracteres");
  }

  console.log("MOSTRAR PASO 2 = TRUE");
  setMostrarPaso2(true);
};


  
  const handlePaso2Submit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const habitosObj = arrayToHabitos(habitos);
      const preferenciasObj = arrayToPreferencias(preferencias);

      setToast({
        show: true,
        type: "loading",
        message: "Creando tu cuenta..."
      });

      await apiAuth.auth.registrar({
        nombreCompleto,
        correo,
        contraseña,
        edad,
        genero: genero !== "Prefiero no decir" ? genero : undefined,
        descripcion: descripcion.trim() || undefined,
        habitos: Object.keys(habitosObj).length > 0 ? habitosObj : undefined,
        preferencias: Object.keys(preferenciasObj).length > 0 ? preferenciasObj : undefined,
      });

  
      setToast({
        show: true,
        type: "success",
        message: "Tu cuenta fue creada correctamente."
      });

    } catch (err: any) {
      console.error(err);

      setToast({
        show: true,
        type: "error",
        message: err.message || "Error al crear la cuenta"
      });
    }
  };



  const handleCancelarPaso2 = () => setMostrarPaso2(false);

  return {
    mostrarPaso2,
    nombreCompleto,
    correo,
    contraseña,
    mostrarPassword,
    edad,
    genero,
    descripcion,
    habitos,
    preferencias,
    loading,
    toast,

    setNombreCompleto,
    setCorreo,
    setContraseña,
    setEdad,
    setGenero,
    setDescripcion,
    setHabitos,
    setPreferencias,
    setLoading,

    togglePassword,
    handlePaso1Submit,
    handlePaso2Submit,
    handleCancelarPaso2,
    hideToast
  };
}

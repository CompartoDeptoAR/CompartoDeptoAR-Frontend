import { useState } from "react";
import type { Genero, HabitoKey, PreferenciaKey } from "../../modelos/Usuario";
import { useToast } from "../useToast";
import { arrayToHabitos, arrayToPreferencias } from "../../helpers/convertersHabitosPreferncias";
import apiAuth from "../../api/endpoints/auth";



export function useRegistro(onSwitch: () => void) {
  // Paso actual
  const [paso, setPaso] = useState<1 | 2>(1);

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

  const { toast, showSuccess, showError, showWarning, hideToast } = useToast();

  const togglePassword = () => setMostrarPassword(p => !p);

  // -------- VALIDACION DE PASO 1 --------
  const handlePaso1Submit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombreCompleto.trim()) {
      return showWarning("Por favor ingresa tu nombre completo");
    }
    if (!correo.trim() || !correo.includes("@")) {
      return showWarning("Por favor ingresa un email válido");
    }
    if (contraseña.length < 6) {
      return showWarning("La contraseña debe tener al menos 6 caracteres");
    }

    setPaso(2);
  };

  // -------- REGISTRO FINAL --------
  const handlePaso2Submit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const habitosObj = arrayToHabitos(habitos);
      const preferenciasObj = arrayToPreferencias(preferencias);

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

      showSuccess("¡Registro exitoso! Redirigiendo al login...");

      setTimeout(() => {
        onSwitch();        
        setLoading(false);
      }, 1500);

    } catch (err: any) {
      console.error(err);
      showError(err.message || "Error al crear la cuenta");
    }
  };

  const handleCancelarPaso2 = () => setPaso(1);

  return {
    paso,
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

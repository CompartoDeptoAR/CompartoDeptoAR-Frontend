import React, { useState, useRef } from "react";

const useGestionFotos = (fotosIniciales: string[], onFotosChange: (fotos: string[]) => void) => {
  const [arrastrando, setArrastrando] = useState(false);
  const [errorFoto, setErrorFoto] = useState("");
  const [arrastrándoFoto, setArrastrandoFoto] = useState<number | null>(null);
  const [sobreIndiceFoto, setSobreIndiceFoto] = useState<number | null>(null);
  const inputFileRef = useRef<HTMLInputElement>(null);

  const MAX_FOTOS = 10;
  const TAMANO_MAX = 5 * 1024 * 1024;
  const TIPOS_PERMITIDOS = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

  const convertirABase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const validarArchivo = (file: File): string | null => {
    if (!TIPOS_PERMITIDOS.includes(file.type)) {
      return "Solo se permiten imágenes JPG, PNG o WebP";
    }
    if (file.size > TAMANO_MAX) {
      return "La imagen no debe superar 5MB";
    }
    return null;
  };

  const procesarArchivos = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setErrorFoto("");

    const fotosActuales = fotosIniciales.length;
    const espacioDisponible = MAX_FOTOS - fotosActuales;

    if (espacioDisponible <= 0) {
      setErrorFoto(`Ya alcanzaste el límite de ${MAX_FOTOS} fotos`);
      return;
    }

    const archivosArray = Array.from(files).slice(0, espacioDisponible);
    const nuevasFotos: string[] = [];

    for (const file of archivosArray) {
      const errorValidacion = validarArchivo(file);
      if (errorValidacion) {
        setErrorFoto(errorValidacion);
        continue;
      }

      try {
        const base64 = await convertirABase64(file);
        nuevasFotos.push(base64);
      } catch (err) {
        setErrorFoto("Error al procesar la imagen");
      }
    }

    if (nuevasFotos.length > 0) {
      onFotosChange([...fotosIniciales, ...nuevasFotos]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    procesarArchivos(e.target.files);
    if (inputFileRef.current) {
      inputFileRef.current.value = "";
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setArrastrando(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setArrastrando(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setArrastrando(false);
    procesarArchivos(e.dataTransfer.files);
  };

  const handleEliminarFoto = (index: number) => {
    const nuevasFotos = fotosIniciales.filter((_, i) => i !== index);
    onFotosChange(nuevasFotos);
  };

  const moverFotoAInicio = (index: number) => {
    if (index === 0) return;
    const nuevasFotos = [...fotosIniciales];
    const [fotoMovida] = nuevasFotos.splice(index, 1);
    nuevasFotos.unshift(fotoMovida);
    onFotosChange(nuevasFotos);
  };

  const handleDragStartFoto = (index: number) => {
    setArrastrandoFoto(index);
  };

  const handleDragOverFoto = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (arrastrándoFoto !== null && arrastrándoFoto !== index) {
      setSobreIndiceFoto(index);
    }
  };

  const handleDragLeaveFoto = () => {
    setSobreIndiceFoto(null);
  };

  const handleDropFoto = (e: React.DragEvent, indexDestino: number) => {
    e.preventDefault();
    e.stopPropagation();

    if (arrastrándoFoto === null || arrastrándoFoto === indexDestino) {
      setArrastrandoFoto(null);
      setSobreIndiceFoto(null);
      return;
    }

    const nuevasFotos = [...fotosIniciales];
    const [fotoMovida] = nuevasFotos.splice(arrastrándoFoto, 1);
    nuevasFotos.splice(indexDestino, 0, fotoMovida);

    onFotosChange(nuevasFotos);
    setArrastrandoFoto(null);
    setSobreIndiceFoto(null);
  };

  const handleDragEndFoto = () => {
    setArrastrandoFoto(null);
    setSobreIndiceFoto(null);
  };

  return {
    arrastrando,
    errorFoto,
    arrastrándoFoto,
    sobreIndiceFoto,
    inputFileRef,
    MAX_FOTOS,
    handleFileSelect,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleEliminarFoto,
    moverFotoAInicio,
    handleDragStartFoto,
    handleDragOverFoto,
    handleDragLeaveFoto,
    handleDropFoto,
    handleDragEndFoto,
  };
};

export default useGestionFotos;
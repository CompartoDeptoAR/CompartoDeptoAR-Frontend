import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FormularioPublicacion from "../../componentes/FormularioPublicacion/FormularioPublicacion";
import ToastNotification from "../../componentes/ToastNotification/ToastNotification";
import type { Publicacion, PublicacionResponce, UpdatePublicacion } from "../../modelos/Publicacion";
import apiPublicacion from "../../api/endpoints/publicaciones";
import { useToast } from "../../componentes/ToastNotification/useToast";

const EditarPublicacion = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast, showSuccess, showError, showWarning, hideToast } = useToast();

  const [publicacion, setPublicacion] = useState<Publicacion>({
    titulo: "",
    provincia: "",
    localidad: "",
    direccion: "",
    precio: 0,
    descripcion: "",
    foto: [],
    reglas: [],
    preferencias: undefined,
  });

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const fetchPublicacion = async () => {
      if (!id) {
        showError("ID de publicación no válido");
        navigate("/mis-publicaciones");
        return;
      }

      try {
        const data: PublicacionResponce = await apiPublicacion.publicacion.obtener(id);

        // Descomponer ubicación: "Dirección, Localidad, Provincia"
        const ubicacionParts = data.ubicacion?.split(",").map((s) => s.trim()) || [];

        const provincia = ubicacionParts.at(-1) || "";
        const localidad = ubicacionParts.at(-2) || "";
        const direccion = ubicacionParts.length > 2 ? ubicacionParts.slice(0, -2).join(", ") : "";

        setPublicacion({
          titulo: data.titulo,
          provincia,
          localidad,
          direccion,
          precio: data.precio,
          descripcion: data.descripcion,
          foto: data.foto || [],
          reglas: data.reglas || [],
          preferencias: data.preferencias,
        });
      } catch (error: any) {
        console.error("Error al cargar publicación:", error);
        showError("No se pudo cargar la publicación");
        setTimeout(() => navigate("/mis-publicaciones"), 2000);
      } finally {
        setLoadingData(false);
      }
    };

    fetchPublicacion();
  }, [id, navigate, showError]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPublicacion((prev) => ({
      ...prev,
      [name]: name === "precio" ? Number(value) : value,
    }));
  };

  const handleProvinciaChange = (provincia: string) => {
    setPublicacion((prev) => ({
      ...prev,
      provincia,
      localidad: "", // Reset localidad cuando cambia provincia
    }));
  };

  const handleLocalidadChange = (localidad: string) => {
    setPublicacion((prev) => ({ ...prev, localidad }));
  };

  const handleFotoChange = (fotos: string[]) => {
  setPublicacion((prev) => ({
    ...prev,
    foto: fotos,
  }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones
    if (!publicacion.titulo.trim()) {
      showWarning("El título es obligatorio");
      return;
    }
    if (!publicacion.provincia) {
      showWarning("Selecciona una provincia");
      return;
    }
    if (!publicacion.localidad) {
      showWarning("Selecciona una localidad");
      return;
    }
    if (publicacion.precio <= 0) {
      showWarning("El precio debe ser mayor a 0");
      return;
    }
    if (!publicacion.descripcion.trim()) {
      showWarning("La descripción es obligatoria");
      return;
    }

    setLoading(true);

    try {
      // Construir ubicación completa: "Dirección, Localidad, Provincia"
      const ubicacionCompleta = publicacion.direccion
        ? `${publicacion.direccion}, ${publicacion.localidad}, ${publicacion.provincia}`
        : `${publicacion.localidad}, ${publicacion.provincia}`;

      const dataParaEnviar: UpdatePublicacion = {
        ...publicacion,
        ubicacion: ubicacionCompleta,
      };

      await apiPublicacion.publicacion.actualizarPublicacion(id!, dataParaEnviar);

      showSuccess("¡Publicación actualizada exitosamente!");

      setTimeout(() => {
        navigate(`/publicacion/${id}`);
      }, 1500);
    } catch (error: any) {
      console.error("Error al editar publicación:", error);

      let errorMessage = "Error al actualizar la publicación";
      if (error.response) {
        const backendError = error.response.data?.error || error.response.data?.message;
        errorMessage = `Error ${error.response.status}: ${backendError}`;
      } else if (error.message) {
        errorMessage = error.message;
      }

      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(`/publicacion/${id}`);
  };

  if (loadingData) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-3">Cargando publicación...</p>
      </div>
    );
  }
  return (
    <>
      <FormularioPublicacion
        publicacion={publicacion}
        handleChange={handleChange}
        onProvinciaChange={handleProvinciaChange}
        onLocalidadChange={handleLocalidadChange}
        onFotosChange={handleFotoChange}
        handleSubmit={handleSubmit}
        modo="editar"
        loading={loading}
        onCancel={handleCancel}
      />
      <ToastNotification
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={hideToast}
      />
    </>
  );
};

export default EditarPublicacion;
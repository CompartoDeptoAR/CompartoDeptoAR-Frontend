import { useEffect } from "react";
import InformacionBasica from "../componenteSecundario/InformacionBasica";
import UbicacionPrecio from "../componenteSecundario/UbicacionPrecio";
import GestorFotos from "../componenteSecundario/GestorFotos";
import { SelectorHabitosPreferencias } from "../../HabitosPreferencias/SelectorHabitosPreferencias";
import { useHabitosPreferencias } from "../../../hooks/useHabitosPreferencias";
import type { Publicacion } from "../../../modelos/Publicacion";
import type { HabitosUsuario, PreferenciasUsuario } from "../../../modelos/Usuario";

interface FormularioPublicacionProps {
  publicacion: Publicacion;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onProvinciaChange: (provincia: string) => void;
  onLocalidadChange: (localidad: string) => void;
  onFotosChange: (fotos: string[]) => void;
  onPreferenciasChange?: (preferencias: string[]) => void;
  onHabitosChange?: (habitos: string[]) => void;   
  handleSubmit: (e: React.FormEvent) => void;
  modo: "crear" | "editar";
  loading?: boolean;
  onCancel?: () => void;
}

const FormularioPublicacion: React.FC<FormularioPublicacionProps> = ({
  publicacion,
  handleChange,
  onProvinciaChange,
  onLocalidadChange,
  onFotosChange,
  handleSubmit,
  modo,
  loading = false,
  onCancel,
}) => {
  const {
    habitos,
    preferencias,
    toggleHabito,
    togglePreferencia,
    setHabitos,
    setPreferencias,
    cargando: cargandoPerfil,
    error: errorPerfil,
  } = useHabitosPreferencias({
    habitosIniciales:
      (publicacion.habitos as HabitosUsuario) ?? ({} as HabitosUsuario),
    preferenciasIniciales:
      (publicacion.preferencias as PreferenciasUsuario) ??
      ({} as PreferenciasUsuario),
  });

  useEffect(() => {
    setHabitos(
      (publicacion.habitos as HabitosUsuario) ?? ({} as HabitosUsuario)
    );
    setPreferencias(
      (publicacion.preferencias as PreferenciasUsuario) ??
        ({} as PreferenciasUsuario)
    );
  }, [publicacion.habitos, publicacion.preferencias]);

  return (
    <div className="container py-4">
      <div className="row mb-4">
        <div className="col">
          <h1 className="display-6 fw-bold mb-2">
            {modo === "crear"
              ? "🏠 Crear Nueva Publicación"
              : "✏️ Editar Publicación"}
          </h1>
          <p className="text-muted">
            Completa los datos para publicar tu espacio disponible
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="row g-4">
          {/* IZQUIERDA */}
          <div className="col-lg-8">
            <InformacionBasica
              titulo={publicacion.titulo}
              descripcion={publicacion.descripcion}
              onChange={handleChange}
            />

            <UbicacionPrecio
              provincia={publicacion.provincia}
              localidad={publicacion.localidad}
              direccion={publicacion.direccion}
              precio={publicacion.precio}
              onProvinciaChange={onProvinciaChange}
              onLocalidadChange={onLocalidadChange}
              onChange={handleChange}
              disabled={loading}
            />

            <GestorFotos
              fotos={publicacion.foto ?? []}
              onFotosChange={onFotosChange}
            />

            <div className="card shadow-sm mb-4">
              <div className="card-header bg-warning">
                <h5 className="mb-0">📜 Reglas y Condiciones</h5>
              </div>
              <div className="card-body">
                <label htmlFor="reglas" className="form-label fw-semibold">
                  Reglas o condiciones (opcional)
                </label>
                <textarea
                  className="form-control"
                  id="reglas"
                  name="reglas"
                  value={publicacion.reglas?.join("\n") ?? ""}
                  onChange={handleChange}
                  rows={4}
                  maxLength={500}
                  placeholder="• No se permiten mascotas&#10;• No fumar&#10;• Horario de silencio 22:00 - 08:00"
                />
                <div className="form-text">
                  Escribe una regla por línea. Máximo 500 caracteres.
                </div>
              </div>
            </div>
          </div>

          {/* DERECHA */}
          <div className="col-lg-4">
            {cargandoPerfil && (
              <div className="alert alert-info">
                <span className="spinner-border spinner-border-sm me-2" />
                Cargando tus datos del perfil...
              </div>
            )}

            {errorPerfil && (
              <div className="alert alert-warning">
                No se pudieron cargar tus datos previos. Puedes seleccionarlos
                manualmente.
              </div>
            )}

            <SelectorHabitosPreferencias
              habitos={habitos}
              preferencias={preferencias}
              onHabitoChange={toggleHabito}
              onPreferenciaChange={togglePreferencia}
              disabled={loading}
              compact={false}
            />

            {/* BOTONES */}
            <div className="card shadow-sm border-0 bg-light mt-3">
              <div className="card-body">
                <div className="d-grid gap-2">
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                    disabled={loading}
                  >
                    {loading
                      ? "Procesando..."
                      : modo === "crear"
                      ? "Publicar"
                      : "Guardar cambios"}
                  </button>

                  {onCancel && (
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={onCancel}
                      disabled={loading}
                    >
                      ❌ Cancelar
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default FormularioPublicacion;

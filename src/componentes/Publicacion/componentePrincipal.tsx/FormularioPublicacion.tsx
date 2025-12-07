import { useEffect } from "react";
import InformacionBasica from "../componenteSecundario/Formulario/InformacionBasica";
import UbicacionPrecio from "../componenteSecundario/Formulario/UbicacionPrecio";
import GestorFotos from "../componenteSecundario/Formulario/GestorFotos";
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
  onPreferenciasChange?: (preferencias: PreferenciasUsuario) => void;
  onHabitosChange?: (habitos: HabitosUsuario) => void;

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
  onHabitosChange,
  onPreferenciasChange,
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
    cargando: cargandoPerfil,
    error: errorPerfil,
  } = useHabitosPreferencias({
    habitosIniciales:
      (publicacion.habitos as HabitosUsuario) ?? ({} as HabitosUsuario),
    preferenciasIniciales:
      (publicacion.preferencias as PreferenciasUsuario) ??
      ({} as PreferenciasUsuario),
    cargarDesdePerfil: true,
  });

  useEffect(() => {
    if (cargandoPerfil) return;
    if (!habitos || !preferencias) return;

    onHabitosChange?.(habitos);
    onPreferenciasChange?.(preferencias);
  }, [habitos, preferencias, cargandoPerfil]);

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

      <form onSubmit={(e) => handleSubmit(e)}>
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
                <label htmlFor="reglasTexto" className="form-label fw-semibold">
                  Reglas o condiciones (opcional)
                </label>
                <textarea
                  className="form-control"
                  id="reglasTexto"
                  name="reglasTexto"
                  value={publicacion.reglasTexto ?? ""}
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
            {/* mensajes */}
            {errorPerfil && (
              <div className="alert alert-warning">
                No se pudieron cargar tus datos previos. Puedes seleccionarlos
                manualmente.
              </div>
            )}

            {!cargandoPerfil &&
              !errorPerfil &&
              Object.keys(habitos ?? {}).length > 0 && (
                <div className="alert alert-success mb-3">
                  ✔ Cargamos tus hábitos y preferencias guardados previamente.
                </div>
              )}

            {!cargandoPerfil &&
              !errorPerfil &&
              Object.keys(habitos ?? {}).length === 0 && (
                <div className="alert alert-warning mb-3">
                  ⚠ No tenías hábitos ni preferencias guardados. Puedes
                  seleccionarlos ahora.
                </div>
              )}

            {errorPerfil && (
              <div className="alert alert-danger mb-3">
                ❌ No se pudieron cargar tus hábitos desde el perfil.
              </div>
            )}


            {!cargandoPerfil && (
              <SelectorHabitosPreferencias
                habitos={habitos ?? {}}
                preferencias={preferencias ?? {}}
                onHabitoChange={toggleHabito}
                onPreferenciaChange={togglePreferencia}
                disabled={loading}
                compact={false}
              />
            )}

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

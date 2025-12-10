import React, { useEffect, useState } from "react";
import { useCalificaciones } from "../../hooks/componente/calificacion/useCalificaciones";
import { CalificacionForm } from "./CalificacionForm";

interface CalificacionUsuarioProps {
  usuarioId: string;
  nombre: string;
}

export const CalificacionUsuario: React.FC<CalificacionUsuarioProps> = ({
  usuarioId,
  nombre,
}) => {
  const { promedio, calificaciones, fetchPorUsuario, loading, crearCalificacion } = useCalificaciones();

  const [mostrarForm, setMostrarForm] = useState(false);

  useEffect(() => {
    fetchPorUsuario(usuarioId);
  }, [usuarioId]);

  if (loading) return <p>Cargando calificación...</p>;

  return (
    <div className="card mt-3">
      <div className="card-body">
        <h5 className="mb-3">Calificación de {nombre}</h5>

        <p className="mb-1">
          ⭐ {promedio.toFixed(1)} / 5
        </p>

        <p className="text-muted" style={{ fontSize: "0.9rem" }}>
          {calificaciones.length} calificaciones
        </p>

        <button
          className="btn btn-primary btn-sm mt-2"
          onClick={() => setMostrarForm((prev) => !prev)}
        >
          {mostrarForm ? "Cerrar" : "Calificar usuario"}
        </button>

        {mostrarForm && (
          <CalificacionForm
            idCalificado={usuarioId}
            nombreCalificado={nombre}
            onClose={() => setMostrarForm(false)}
            onCreate={crearCalificacion}
          />
        )}

        <hr />

        {calificaciones.length === 0 ? (
          <p className="text-muted">Este usuario aún no tiene calificaciones.</p>
        ) : (
          <ul className="list-group">
            {calificaciones.map((c) => (
              <li key={c.id} className="list-group-item">
                <div><strong>{c.nombreCalificador ?? "Usuario"}</strong></div>
                <div>{c.puntuacion} ⭐</div>
                <div className="text-muted" style={{ fontSize: "0.8rem" }}>
                  {new Date(c.fecha).toLocaleDateString()}
                </div>
                <p className="mt-1 mb-0">{c.comentario}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

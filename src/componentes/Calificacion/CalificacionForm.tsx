import React, { useState } from "react";
import { CalificacionCrear, CrearCalificacionResponse } from "../../api/endpoints/calificacion";
import { TokenService } from "../../services/auth/tokenService";


interface CalificacionFormProps {
  idCalificado: string;
  nombreCalificado: string;
  onClose: () => void; 
  onCreate: (data: CalificacionCrear) => Promise<CrearCalificacionResponse>;
}

export const CalificacionForm: React.FC<CalificacionFormProps> = ({
  idCalificado,
  nombreCalificado,
  onClose,
  onCreate,
}) => {
  
  const [puntuacion, setPuntuacion] = useState(0);
  const [comentario, setComentario] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setErrorMsg("");

  if (puntuacion === 0) {
    setErrorMsg("Debes seleccionar una puntuación.");
    return;
  }

  setLoading(true);
  try {
    await onCreate({
      idCalificado,
      puntuacion,
      comentario,
      nombreCalificador: TokenService.getUserEmail()!,
    });

    onClose();
  } catch (error: any) {
    setErrorMsg(error.message);
  } finally {
    setLoading(false);
  }
};


  return (
    <form onSubmit={handleSubmit} className="mt-3 p-3 border rounded bg-white">
      <h6>Calificar a {nombreCalificado}</h6>

      {/* SELECTOR DE ESTRELLAS */}
      <div className="mb-3">
        <label className="form-label">Puntuación</label>
        <div>
          {[1, 2, 3, 4, 5].map((num) => (
            <span
              key={num}
              style={{
                fontSize: "1.8rem",
                cursor: "pointer",
                color: num <= puntuacion ? "#ffc107" : "#e4e5e9",
              }}
              onClick={() => setPuntuacion(num)}
            >
              ★
            </span>
          ))}
        </div>
      </div>

      {/* COMENTARIO */}
      <div className="mb-3">
        <label className="form-label">Comentario (opcional)</label>
        <textarea
          className="form-control"
          rows={3}
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          placeholder="Escribe un comentario..."
        />
      </div>

      {/*  ERROR */}
      {errorMsg && <p className="text-danger">{errorMsg}</p>}

      {/* BOTONES */}
      <div className="d-flex gap-2">
        <button
          type="submit"
          className="btn btn-success"
          disabled={loading}
        >
          {loading ? "Guardando..." : "Enviar calificación"}
        </button>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={onClose}
          disabled={loading}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};

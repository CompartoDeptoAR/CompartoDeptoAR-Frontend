import React from "react";
import { Offcanvas, ListGroup, Spinner, Alert } from "react-bootstrap";
import { Navegar } from "../../navigation/navigationService";

interface Props {
  show: boolean;
  onClose: () => void;
  resultados: any[]; // PublicacionResumida[]
  loading?: boolean;
  error?: string | null;
}

const BuscadorResultados: React.FC<Props> = ({ show, onClose, resultados, loading, error }) => {
  const abrirPublicacion = (id: string) => {
    // intenta usar Navegar.publicacion si existe, sino fallback a window.location
    try {
      // @ts-ignore
      if (Navegar && typeof Navegar.publicacion === "function") {
        // si la función espera id u objeto, se intenta con id
        // @ts-ignore
        Navegar.publicacion(id);
        return;
      }
    } catch (e) {
      // ignore y fallback
    }
    window.location.href = `/publicacion/${id}`;
  };

  return (
    <Offcanvas placement="end" show={show} onHide={onClose}>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Resultados de búsqueda</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        {loading && (
          <div className="d-flex justify-content-center my-4">
            <Spinner animation="border" role="status" />
          </div>
        )}

        {error && <Alert variant="warning">{error}</Alert>}

        {!loading && !error && resultados.length === 0 && (
          <Alert variant="info">No hay resultados para la búsqueda.</Alert>
        )}

        {!loading && resultados.length > 0 && (
          <ListGroup>
            {resultados.map((r: any) => (
              <ListGroup.Item
                action
                key={r.id}
                onClick={() => abrirPublicacion(r.id)}
                className="d-flex justify-content-between align-items-start"
              >
                <div>
                  <div className="fw-semibold">{r.titulo || r.descripcionCorta || "Publicación"}</div>
                  <div className="small text-muted">{r.ubicacion ? r.ubicacion : ""}</div>
                </div>
                <div className="text-end">
                  <div className="fw-semibold">${r.precio ?? "-"}</div>
                  <div className="small text-muted">{r.categoria ?? ""}</div>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default BuscadorResultados;

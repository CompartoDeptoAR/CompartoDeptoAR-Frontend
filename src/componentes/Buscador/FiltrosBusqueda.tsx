import { Offcanvas, Form, Button } from "react-bootstrap";
import React from "react";

interface Props {
  show: boolean;
  onClose: () => void;
  onApply: (filtros: any) => void;
}

export const FiltrosBusqueda: React.FC<Props> = ({ show, onClose, onApply }) => {

  const [categoria, setCategoria] = React.useState("");
  const [ubicacion, setUbicacion] = React.useState("");
  const [precioMin, setPrecioMin] = React.useState("");
  const [precioMax, setPrecioMax] = React.useState("");

  const aplicar = () => {
    onApply({ categoria, ubicacion, precioMin, precioMax });
    onClose();
  };

  return (
    <Offcanvas placement="end" show={show} onHide={onClose}>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Filtros</Offcanvas.Title>
      </Offcanvas.Header>

      <Offcanvas.Body>
        
        <Form.Group className="mb-3">
          <Form.Label>Categoría</Form.Label>
          <Form.Control value={categoria} onChange={e => setCategoria(e.target.value)} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Ubicación</Form.Label>
          <Form.Control value={ubicacion} onChange={e => setUbicacion(e.target.value)} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Precio mínimo</Form.Label>
          <Form.Control type="number" value={precioMin} onChange={e => setPrecioMin(e.target.value)} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Precio máximo</Form.Label>
          <Form.Control type="number" value={precioMax} onChange={e => setPrecioMax(e.target.value)} />
        </Form.Group>

        <div className="d-flex justify-content-end">
          <Button variant="secondary" className="me-2" onClick={onClose}>Cancelar</Button>
          <Button variant="primary" onClick={aplicar}>Aplicar filtros</Button>
        </div>

      </Offcanvas.Body>
    </Offcanvas>
  );
};

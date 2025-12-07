import { Offcanvas, Form, Button, Row, Col } from "react-bootstrap";
import React, { useState } from "react";
import { Filter, X } from "lucide-react";

interface Props {
  show: boolean;
  onClose: () => void;
  onApply: (filtros: any) => void;
}

export const FiltrosBusqueda: React.FC<Props> = ({ show, onClose, onApply }) => {
  const [categoria, setCategoria] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [precioMin, setPrecioMin] = useState("");
  const [precioMax, setPrecioMax] = useState("");

  const categorias = [
    "Alquiler",
    "Venta",
    "Compartido",
    "Temporal",
    "Estudiante"
  ];

  const aplicar = () => {
    const filtros: any = {};
    if (categoria) filtros.categoria = categoria;
    if (ubicacion) filtros.ubicacion = ubicacion;
    if (precioMin) filtros.precioMin = Number(precioMin);
    if (precioMax) filtros.precioMax = Number(precioMax);
    
    onApply(filtros);
    onClose();
  };

  const limpiarFiltros = () => {
    setCategoria("");
    setUbicacion("");
    setPrecioMin("");
    setPrecioMax("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    aplicar();
  };

  return (
    <Offcanvas 
      placement="end" 
      show={show} 
      onHide={onClose}
      style={{ width: "350px" }}
    >
      <Offcanvas.Header className="border-bottom">
        <div className="d-flex align-items-center w-100">
          <Filter size={20} className="me-2" />
          <Offcanvas.Title>Filtros de búsqueda</Offcanvas.Title>
          <Button 
            variant="link" 
            className="ms-auto p-0" 
            onClick={onClose}
          >
            <X size={20} />
          </Button>
        </div>
      </Offcanvas.Header>

      <Offcanvas.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold">Categoría</Form.Label>
            <Form.Select 
              value={categoria} 
              onChange={e => setCategoria(e.target.value)}
              className="border-primary"
            >
              <option value="">Todas las categorías</option>
              {categorias.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold">Ubicación</Form.Label>
            <Form.Control 
              placeholder="Ej: Buenos Aires, Córdoba..."
              value={ubicacion} 
              onChange={e => setUbicacion(e.target.value)}
              className="border-primary"
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold">Rango de precio</Form.Label>
            <Row>
              <Col>
                <Form.Control 
                  type="number" 
                  placeholder="Mínimo" 
                  value={precioMin} 
                  onChange={e => setPrecioMin(e.target.value)}
                  className="border-primary"
                />
              </Col>
              <Col>
                <Form.Control 
                  type="number" 
                  placeholder="Máximo" 
                  value={precioMax} 
                  onChange={e => setPrecioMax(e.target.value)}
                  className="border-primary"
                />
              </Col>
            </Row>
            <Form.Text className="text-muted">
              Dejar en blanco para no filtrar por precio
            </Form.Text>
          </Form.Group>

          <div className="d-flex justify-content-between pt-3 border-top">
            <Button 
              variant="outline-secondary" 
              onClick={limpiarFiltros}
              className="px-4"
            >
              Limpiar
            </Button>
            <div>
              <Button 
                variant="outline-primary" 
                className="me-2 px-4"
                onClick={onClose}
              >
                Cancelar
              </Button>
              <Button 
                variant="primary" 
                type="submit"
                className="px-4"
              >
                Aplicar
              </Button>
            </div>
          </div>
        </Form>
      </Offcanvas.Body>
    </Offcanvas>
  );
};
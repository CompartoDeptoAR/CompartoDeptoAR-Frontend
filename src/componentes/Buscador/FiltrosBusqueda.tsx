import { Offcanvas, Form, Button, Row, Col } from "react-bootstrap";
import React, { useState } from "react";
import { Filter, X } from "lucide-react";

interface Props {
  show: boolean;
  onClose: () => void;
  onApply: (filtros: any) => void;
}

export const FiltrosBusqueda: React.FC<Props> = ({ show, onClose, onApply }) => {
  const [ubicacion, setUbicacion] = useState("");
  const [precioMin, setPrecioMin] = useState("");
  const [precioMax, setPrecioMax] = useState("");
  
  const [noFumadores, setNoFumadores] = useState(false);
  const [sinMascotas, setSinMascotas] = useState(false);
  const [tranquilo, setTranquilo] = useState(false);
  const [social, setSocial] = useState(false);

  const aplicar = () => {
    const filtros: any = {};
    

    if (ubicacion.trim()) filtros.ubicacion = ubicacion.trim();
    if (precioMin) filtros.precioMin = Number(precioMin);
    if (precioMax) filtros.precioMax = Number(precioMax);
    
  
    if (noFumadores) filtros.noFumadores = true;
    if (sinMascotas) filtros.sinMascotas = true;
    if (tranquilo) filtros.tranquilo = true;
    if (social) filtros.social = true;
    
    console.log("Filtros enviados:", filtros);
    onApply(filtros);
    onClose();
  };

  const limpiarFiltros = () => {
    setUbicacion("");
    setPrecioMin("");
    setPrecioMax("");
    setNoFumadores(false);
    setSinMascotas(false);
    setTranquilo(false);
    setSocial(false);
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
      style={{ width: "380px" }}
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
          
          {/* Ubicación */}
          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold">Ubicación</Form.Label>
            <Form.Control 
              placeholder="Ej: Buenos Aires, Córdoba, Rosario..."
              value={ubicacion} 
              onChange={e => setUbicacion(e.target.value)}
              className="border-primary"
            />
            <Form.Text className="text-muted">
              Busca por ciudad, provincia o barrio
            </Form.Text>
          </Form.Group>

          {/* Rango de precio */}
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
                  min="0"
                />
              </Col>
              <Col>
                <Form.Control 
                  type="number" 
                  placeholder="Máximo" 
                  value={precioMax} 
                  onChange={e => setPrecioMax(e.target.value)}
                  className="border-primary"
                  min="0"
                />
              </Col>
            </Row>
            <Form.Text className="text-muted">
              Precio mensual en pesos argentinos
            </Form.Text>
          </Form.Group>

          {/* Preferencias de compañero */}
          <div className="mb-4">
            <Form.Label className="fw-semibold d-block mb-3">
              Preferencias del compañero
            </Form.Label>
            
            <Form.Check 
              type="checkbox"
              id="filtro-noFumadores"
              label="No fumadores"
              checked={noFumadores}
              onChange={e => setNoFumadores(e.target.checked)}
              className="mb-2"
            />
            
            <Form.Check 
              type="checkbox"
              id="filtro-sinMascotas"
              label="Sin mascotas"
              checked={sinMascotas}
              onChange={e => setSinMascotas(e.target.checked)}
              className="mb-2"
            />
            
            <Form.Check 
              type="checkbox"
              id="filtro-tranquilo"
              label="Tranquilo"
              checked={tranquilo}
              onChange={e => setTranquilo(e.target.checked)}
              className="mb-2"
            />
            
            <Form.Check 
              type="checkbox"
              id="filtro-social"
              label="Social"
              checked={social}
              onChange={e => setSocial(e.target.checked)}
              className="mb-2"
            />

            <Form.Text className="text-muted d-block mt-2">
              Se buscarán publicaciones que coincidan con las preferencias seleccionadas
            </Form.Text>
          </div>

          {/* Botones de acción */}
          <div className="d-flex justify-content-between pt-3 border-top mt-4">
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
                className="me-2 px-3"
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
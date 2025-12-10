import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";

const NosotrosPage: React.FC = () => {
  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <Card className="p-4 shadow-lg border-0 bg-light">
            <Card.Body>
              <h2 className="text-center mb-4 fw-bold text-primary">
                Sobre CompartoDeptoAR 🏠
              </h2>

              <p className="fs-5 text-muted text-justify">
                <strong>CompartoDeptoAR</strong> nació como un proyecto académico dentro del
                marco del <strong>Trabajo Final de Inserción Laboral</strong> de la
                <em> Tecnicatura Universitaria en Programación Informática</em> del
                <strong> Centro Inter Universitario (CIU)</strong> de
                General Belgrano, Buenos Aires.
              </p>

              <p className="fs-5 text-muted text-justify">
                Su principal objetivo es ofrecer una plataforma moderna, intuitiva y
                accesible que permita a las personas publicar, buscar y gestionar
                departamentos compartidos, fomentando la colaboración, la confianza y
                la comunidad entre usuarios.
              </p>

              <p className="fs-5 text-muted text-justify">
                Este desarrollo combina <strong>tecnologías web actuales</strong> como
                React, TypeScript, Node.js y Firebase, integrando buenas prácticas de
                arquitectura, seguridad y diseño de interfaces.
              </p>

              <p className="fs-5 text-muted text-justify">
                Más allá del aspecto técnico, el proyecto busca ser una experiencia
                real de trabajo en equipo, simulando entornos laborales y aplicando
                metodologías ágiles, gestión de roles y responsabilidades.
              </p>

              <div className="text-center mt-4">
                <h5 className="fw-semibold text-secondary">💡 Misión</h5>
                <p className="text-muted">
                  Facilitar la búsqueda y publicación de espacios compartidos en
                  Argentina, conectando personas mediante una plataforma segura y eficiente.
                </p>

                <h5 className="fw-semibold text-secondary mt-3">🚀 Visión</h5>
                <p className="text-muted">
                  Ser una herramienta de referencia en el mercado de alquileres
                  colaborativos, impulsando la innovación y el espíritu de comunidad.
                </p>
              </div>

              <div className="text-center mt-5">
                <p className="text-muted small">
                  © 2025 — CompartoDeptoAR | Proyecto académico CIU General Belgrano
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default NosotrosPage;

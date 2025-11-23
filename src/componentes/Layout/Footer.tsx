import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Navigation } from "../../navigation/navigationService";

const Footer: React.FC = () => {
  return (
    <footer className="bg-dark text-light py-3 mt-auto">
      <Container>
        <Row className="align-items-center text-center text-md-start">
          <Col md={6}>
            <p className="mb-0">© 2025 — CompartoDeptoAR | Proyecto Académico CIU General Belgrano</p>
          </Col>
          <Col md={6} className="text-md-end">
            <a onClick={() => Navigation.nosotros()} className="text-light text-decoration-none me-3">
              Nosotros
            </a>
            <a onClick={() => Navigation.contactanos()} className="text-light text-decoration-none">
              Contactanos
            </a>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;

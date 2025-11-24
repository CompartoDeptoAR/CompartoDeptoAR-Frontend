import React from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";

interface FormContactanosProps {
  email: string;
  mensaje: string;
  enviado: boolean;
  error: string;
  palabras: number;
  cargando: boolean;
  emailBloqueado: boolean;
  setEmail: (email: string) => void;
  setMensaje: (mensaje: string) => void;
  resetEnviado: () => void;
  resetError: () => void;
  manejarEnvio: (e: React.FormEvent) => void;
}

const FormContactanos: React.FC<FormContactanosProps> = ({
  email,
  mensaje,
  enviado,
  error,
  palabras,
  cargando,
  emailBloqueado,
  setEmail,
  setMensaje,
  resetEnviado,
  resetError,
  manejarEnvio,
}) => {
  return (
    <Container className="my-5" style={{ maxWidth: "600px" }}>
      <h2 className="text-center mb-4">Contáctanos</h2>

      {enviado && (
        <Alert variant="success" onClose={resetEnviado} dismissible>
          ✅ ¡Tu mensaje fue enviado correctamente! Te responderemos pronto.
        </Alert>
      )}

      {error && (
        <Alert variant="danger" onClose={resetError} dismissible>
          {error}
        </Alert>
      )}

      <Form onSubmit={manejarEnvio} className="shadow p-4 rounded bg-light">
        {/* 📧 Correo */}
        <Form.Group className="mb-3">
          <Form.Label>Correo electrónico</Form.Label>
          <Form.Control
            type="email"
            placeholder="tuemail@mail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={emailBloqueado}   
          />

        </Form.Group>

        {/* 📝 Mensaje */}
        <Form.Group className="mb-3">
          <Form.Label>Mensaje</Form.Label>
          <Form.Control
            as="textarea"
            rows={5}
            placeholder="Escribí tu mensaje (máximo 300 palabras)"
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            required
          />
          <Form.Text className="text-muted">
            {palabras} / 300 palabras
          </Form.Text>
        </Form.Group>

        <div className="text-center">
          <Button variant="primary" type="submit" disabled={cargando}>
            {cargando ? "Enviando..." : "Enviar mensaje"}
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default FormContactanos;

import React from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";

interface FormContactanosProps {
  email: string;
  mensaje: string;
  enviado: boolean;
  error: string;
  palabras: number;
  setEmail: (email: string) => void;
  setMensaje: (mensaje: string) => void;
  setEnviado: (enviado: boolean) => void;
  setError: (error: string) => void;
  manejarEnvio: (e: React.FormEvent) => void;
}

const FormContactanos: React.FC<FormContactanosProps> = ({
  email,
  mensaje,
  enviado,
  error,
  palabras,
  setEmail,
  setMensaje,
  setEnviado,
  setError,
  manejarEnvio,
}) => {
  return (
    <Container className="my-5" style={{ maxWidth: "600px" }}>
      <h2 className="text-center mb-4">Contáctanos</h2>

      {enviado && (
        <Alert variant="success" onClose={() => setEnviado(false)} dismissible>
          ✅ ¡Tu mensaje fue enviado correctamente! Te responderemos pronto.
        </Alert>
      )}

      {error && (
        <Alert variant="danger" onClose={() => setError("")} dismissible>
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
            disabled={!!email}
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
          <Button variant="primary" type="submit">
            Enviar mensaje
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default FormContactanos;
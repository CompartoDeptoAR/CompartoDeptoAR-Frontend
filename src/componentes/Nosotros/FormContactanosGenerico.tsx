import React from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";

interface FormularioGenericoProps {
  titulo: string;
  emailLabel?: string;
  emailPlaceholder?: string;
  mensajeLabel?: string;
  mensajePlaceholder?: string;
  maxPalabras?: number;
  mensajeExito?: string;
  textoBoton?: string;

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

const FormularioGenerico: React.FC<FormularioGenericoProps> = ({
  titulo,
  emailLabel = "Correo electrónico",
  emailPlaceholder = "tuemail@mail.com",
  mensajeLabel = "Mensaje",
  mensajePlaceholder = "Escribí tu mensaje",
  maxPalabras = 300,
  mensajeExito = "¡Tu mensaje fue enviado correctamente! Te responderemos pronto.",
  textoBoton = "Enviar mensaje",
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
      <h2 className="text-center mb-4">{titulo}</h2>

      {enviado && (
        <Alert variant="success" onClose={resetEnviado} dismissible>
          ✅ {mensajeExito}
        </Alert>
      )}

      {error && (
        <Alert variant="danger" onClose={resetError} dismissible>
          {error}
        </Alert>
      )}

      <Form onSubmit={manejarEnvio} className="shadow p-4 rounded bg-light">
        <Form.Group className="mb-3">
          <Form.Label>{emailLabel}</Form.Label>
          <Form.Control
            type="email"
            placeholder={emailPlaceholder}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={emailBloqueado}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>{mensajeLabel}</Form.Label>
          <Form.Control
            as="textarea"
            rows={5}
            placeholder={`${mensajePlaceholder} (máximo ${maxPalabras} palabras)`}
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            required
          />
          <Form.Text className="text-muted">
            {palabras} / {maxPalabras} palabras
          </Form.Text>
        </Form.Group>

        <div className="text-center">
          <Button variant="primary" type="submit" disabled={cargando}>
            {cargando ? "Enviando..." : textoBoton}
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default FormularioGenerico;
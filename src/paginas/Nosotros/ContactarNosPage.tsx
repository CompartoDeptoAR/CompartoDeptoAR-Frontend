import React, { useState } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { TokenService } from "../../services/auth/tokenService";

const ContactarNosPage: React.FC = () => {

  const authData = TokenService.getAuthData();

  const [email, setEmail] = useState(authData?.email || "");
  const [mensaje, setMensaje] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validación simple
    if (!mensaje.trim()) {
      setError("El mensaje no puede estar vacío.");
      return;
    }

    // Contar palabras
    const palabras = mensaje.trim().split(/\s+/).length;
    if (palabras > 300) {
      setError("El mensaje no puede superar las 300 palabras.");
      return;
    }

    setError("");
    try {
      // Simulación de envío
      console.log({
        correo: email,
        mensaje,
      });

      // Aquí podrías llamar a tu endpoint real:
      // await apiContacto.enviarMensaje({ correo: email, mensaje });

      setEnviado(true);
      setMensaje("");
    } catch (err: any) {
      setError("Error al enviar el mensaje. Intenta nuevamente.");
    }
  };

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

      <Form onSubmit={handleSubmit} className="shadow p-4 rounded bg-light">
        {/* 📧 Correo */}
        <Form.Group className="mb-3" controlId="formEmail">
          <Form.Label>Correo electrónico</Form.Label>
          <Form.Control
            type="email"
            placeholder="tuemail@mail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={!!authData?.email} // 🔒 bloqueado si está logueado
          />
        </Form.Group>

        {/* 📝 Mensaje */}
        <Form.Group className="mb-3" controlId="formMensaje">
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
            {mensaje.trim().split(/\s+/).length} / 300 palabras
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

export default ContactarNosPage;

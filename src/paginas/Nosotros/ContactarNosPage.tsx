import React, { useState } from "react";
import axios from "axios";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { TokenService } from "../../services/auth/tokenService";

const URL_BASE_API = `http://localhost:3000`;

const ContactarNosPage: React.FC = () => {
  const datosAuth = TokenService.getAuthData();

  const [email, setEmail] = useState(datosAuth?.mail || "");
  const [mensaje, setMensaje] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!mensaje.trim()) {
      setError("El mensaje no puede estar vacío.");
      return;
    }

    const cantidadPalabras = mensaje.trim().split(/\s+/).length;
    if (cantidadPalabras > 300) {
      setError("El mensaje no puede superar las 300 palabras.");
      return;
    }

    setError("");
    setCargando(true); 

    try {
      await axios.post(`${URL_BASE_API}/api/contacto`, { 
        mail: email,
        mensaje: mensaje,
      });

      setEnviado(true);
      setMensaje("");

    } catch (err: any) {
      console.error("Error al enviar:", err);
      // Recuerda que si el backend no está corriendo, verás 'ERR_NETWORK' o 'ECONNREFUSED'
      setError("Error al enviar el mensaje. Intenta nuevamente.");
    } finally {
      setCargando(false);
    }
  };

  const contadorPalabras = mensaje.trim() === "" ? 0 : mensaje.trim().split(/\s+/).length;
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
            disabled={!!datosAuth?.mail}
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
            disabled={cargando}
          />
          <Form.Text className="text-muted">
            {contadorPalabras} / 300 palabras
          </Form.Text>
        </Form.Group>

        <div className="text-center">
          <Button variant="primary" type="submit" disabled={cargando}>
            {cargando ? 'Enviando...' : 'Enviar mensaje'}
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default ContactarNosPage;
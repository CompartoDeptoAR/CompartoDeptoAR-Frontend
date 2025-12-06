import React, { useState } from "react";
import { Container, Form, Button, Alert, Card } from "react-bootstrap";
import { useParams } from "react-router-dom";

interface FormularioDenunciaProps {
    email: string;
    cargando: boolean;
    enviado: boolean;
    error: string;
    emailBloqueado: boolean;
    setEmail: (email: string) => void;
    resetEnviado: () => void;
    resetError: () => void;
    manejarEnvio: (datos: {
        tipo: "publicacion" | "mensaje";
        id: string;
        motivo: string;
        descripcion: string;
    }) => Promise<void>;
    idContenido: string;
}

const MOTIVOS_DENUNCIA = [
  { value: "contenido_inapropiado", label: "Contenido inapropiado" },
  { value: "spam", label: "Spam o publicidad" },
  { value: "acoso", label: "Acoso o bullying" },
  { value: "violencia", label: "Violencia o amenazas" },
  { value: "informacion_falsa", label: "Información falsa" },
  { value: "lenguaje_ofensivo", label: "Lenguaje ofensivo" },
  { value: "suplantacion", label: "Suplantación de identidad" },
  { value: "otro", label: "Otro motivo" }
];

const FormularioDenuncia: React.FC<FormularioDenunciaProps> = ({
  email,
  cargando,
  enviado,
  error,
  emailBloqueado,
  setEmail,
  resetEnviado,
  resetError,
  manejarEnvio,
  idContenido,
}) => {
    const [tipo, setTipo] = useState<"publicacion" | "mensaje">("publicacion");
    const [motivo, setMotivo] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const contarPalabras = (texto: string): number => {
        return texto.trim().split(/\s+/).filter(Boolean).length;
    };

    const palabrasDescripcion = contarPalabras(descripcion);
    const maxPalabras = 500;

    const palabras = contarPalabras(descripcion);


    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
 
    if (palabras > 500) return alert("Máximo 500 palabras");


    await manejarEnvio({ tipo, id:idContenido, motivo, descripcion });
        setMotivo("");
        setDescripcion("");
    };

  return (
    <Container className="my-5" style={{ maxWidth: "700px" }}>
      <h2 className="text-center mb-4">🚨 Realizar Denuncia</h2>

      <Alert variant="info" className="mb-4">
        <Alert.Heading>¿Cómo denunciar?</Alert.Heading>
        <p className="mb-0">
          Si encontraste contenido que viola nuestras normas comunitarias, 
          por favor completá este formulario. Todas las denuncias serán 
          revisadas por nuestro equipo de moderación.
        </p>
      </Alert>

      {enviado && (
        <Alert variant="success" onClose={resetEnviado} dismissible>
          ✅ Tu denuncia fue recibida. Será procesada a la brevedad.
        </Alert>
      )}

      {error && (
        <Alert variant="danger" onClose={resetError} dismissible>
          ❌ {error}
        </Alert>
      )}

      <Card>
        <Card.Body className="p-4">
          <Form onSubmit={handleSubmit}>
            {/* Email */}
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
              <Form.Text className="text-muted">
                Usaremos este correo para notificarte sobre el estado de tu denuncia.
              </Form.Text>
            </Form.Group>

            {/* Tipo de contenido */}
            <Form.Group className="mb-3">
              <Form.Label>¿Qué estás denunciando?</Form.Label>
              <div>
                <Form.Check
                  type="radio"
                  id="tipo-publicacion"
                  name="tipo"
                  label="📄 Una publicación"
                  value="publicacion"
                  checked={tipo === "publicacion"}
                  onChange={(e) => setTipo(e.target.value as "publicacion")}
                  inline
                />
                <Form.Check
                  type="radio"
                  id="tipo-mensaje"
                  name="tipo"
                  label="💬 Un mensaje"
                  value="mensaje"
                  checked={tipo === "mensaje"}
                  onChange={(e) => setTipo(e.target.value as "mensaje")}
                  inline
                  disabled
                />
              </div>
              <Form.Text className="text-muted">
                (Por el momento solo aceptamos denuncias de publicaciones)
              </Form.Text>
            </Form.Group>
            {/* Motivo */}
            <Form.Group className="mb-3">
              <Form.Label>
                Motivo de la denuncia <span className="text-danger">*</span>
              </Form.Label>
              <Form.Select
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                required
              >
                <option value="">Seleccioná un motivo...</option>
                {MOTIVOS_DENUNCIA.map((m) => (
                  <option key={m.value} value={m.label}>
                    {m.label}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            {/* Descripción */}
            <Form.Group className="mb-4">
              <Form.Label>
                Descripción detallada <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={6}
                placeholder="Describí en detalle por qué estás denunciando este contenido. Incluí toda la información relevante que pueda ayudar a nuestro equipo de moderación."
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                required
              />
              <Form.Text className={palabrasDescripcion > maxPalabras ? "text-danger" : "text-muted"}>
                {palabrasDescripcion} / {maxPalabras} palabras
              </Form.Text>
            </Form.Group>

            <div className="d-grid">
              <Button 
                variant="danger" 
                type="submit" 
                size="lg"
                disabled={cargando || palabrasDescripcion > maxPalabras}
              >
                {cargando ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Enviando...
                  </>
                ) : (
                  "🚨 Enviar denuncia"
                )}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>

      {/* Información adicional */}
      <Alert variant="light" className="mt-4">
        <h6 className="fw-bold">📌 Información importante</h6>
        <ul className="mb-0">
          <li>Las denuncias son anónimas, pero necesitamos tu email para notificarte.</li>
          <li>Las denuncias falsas o malintencionadas pueden resultar en la suspensión de tu cuenta.</li>
          <li>Revisamos todas las denuncias en un plazo de 24-48 horas.</li>
          <li>Si el contenido viola nuestras normas, será eliminado.</li>
        </ul>
      </Alert>
    </Container>
  );
};

export default FormularioDenuncia;
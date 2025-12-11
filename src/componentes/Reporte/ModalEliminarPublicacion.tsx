import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

interface Props {
  show: boolean;
  onClose: () => void;
  onConfirm: (motivo: string) => void;
}

export default function ModalEliminarPublicacion({ show, onClose, onConfirm }: Props) {
  const [motivo, setMotivo] = useState("");
  const [error, setError] = useState(false);

  const confirmar = () => {
    if (!motivo.trim()) {
      setError(true);
      return;
    }
    setError(false);
    onConfirm(motivo.trim());
    setMotivo("");
    onClose();
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton className="bg-danger text-white">
        <Modal.Title>⚠️ Eliminar publicación permanentemente</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p>
          Esta acción <strong>no se puede deshacer.</strong>  
          La publicación será eliminada del sistema de forma permanente.
        </p>

        <Form.Label>Motivo de eliminación</Form.Label>
        <Form.Control
          type="text"
          placeholder="Ingresá el motivo…"
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
        />

        {error && <small className="text-danger">El motivo es obligatorio</small>}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancelar
        </Button>
        <Button variant="danger" onClick={confirmar}>
          Eliminar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

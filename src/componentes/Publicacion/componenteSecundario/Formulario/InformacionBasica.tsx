interface InformacionBasicaProps  {
  titulo: string;
  descripcion: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  disabled?: boolean;
}

const InformacionBasica: React.FC<InformacionBasicaProps> = ({
  titulo,
  descripcion,
  onChange,
  disabled = false,
}) => {
  return (
    <div className="card shadow-sm mb-4">
      <div className="card-header bg-primary text-white">
        <h5 className="mb-0">📋 Información Básica</h5>
      </div>
      <div className="card-body">
        <div className="mb-4">
          <label htmlFor="titulo" className="form-label fw-semibold">
            Título del anuncio <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className="form-control form-control-lg"
            id="titulo"
            name="titulo"
            value={titulo}
            onChange={onChange}
            placeholder="Ej: Habitación luminosa en Palermo"
            required
            disabled={disabled}
            maxLength={100}
          />
          <div className="form-text">{titulo.length}/100 caracteres</div>
        </div>

        <div className="mb-3">
          <label htmlFor="descripcion" className="form-label fw-semibold">
            Descripción de la vivienda <span className="text-danger">*</span>
          </label>
          <textarea
            className="form-control"
            id="descripcion"
            name="descripcion"
            value={descripcion}
            onChange={onChange}
            rows={6}
            maxLength={1000}
            required
            disabled={disabled}
            placeholder="Describe tu espacio: características, ambientes, servicios incluidos..."
          />
          <div className="form-text">{descripcion.length}/1000 caracteres</div>
        </div>
      </div>
    </div>
  );
};

export default InformacionBasica;
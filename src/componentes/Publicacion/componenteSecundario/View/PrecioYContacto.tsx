interface Props {
  precio: number;
  onContactar: () => void;
}

export const PrecioYContacto: React.FC<Props> = ({ precio, onContactar }) => {
  const formatearPrecio = (n: number) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(n);

  return (
    <div className="card mb-3">
      <div className="card-body">
        <h2 className="text-success mb-0">{formatearPrecio(precio)}</h2>
        <small className="text-muted">por mes</small>

        <button className="btn btn-primary w-100 mt-3" onClick={onContactar}>
          <i className="bi bi-chat-dots me-2"></i>
          Contactar
        </button>
      </div>
    </div>
  );
};

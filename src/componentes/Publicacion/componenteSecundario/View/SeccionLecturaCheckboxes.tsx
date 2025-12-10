interface SeccionLecturaProps<T> {
  titulo: string;
  config: { key: keyof T; label: string }[];
  datos?: T;
  textoVacio?: string;
}

export function SeccionLecturaCheckboxes<T>({
  titulo,
  config,
  datos,
  textoVacio = "Sin datos especificados",
}: SeccionLecturaProps<T>) {

  const items = config.filter(({ key }) => datos?.[key]);

  return (
    <div className="card mt-3">
      <div className="card-body">
        <h5>{titulo}</h5>

        {items.length > 0 ? (
          <ul>
            {items.map(({ key, label }) => (
              <li key={String(key)}>{label}</li>
            ))}
          </ul>
        ) : (
          <p className="text-muted">{textoVacio}</p>
        )}
      </div>
    </div>
  );
}

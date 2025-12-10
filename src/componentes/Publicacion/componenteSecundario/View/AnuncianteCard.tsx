import { Navegar } from "../../../../navigation/navigationService";

interface Props {
  nombre: string;
  usuarioId: string;
}

export const AnuncianteCard: React.FC<Props> = ({ nombre, usuarioId }) => {
  return (
    <div className="card">
      <div className="card-body">
        <h6 className="card-title mb-3">Información del anunciante</h6>

        <div className="d-flex align-items-center mb-3">
          <div
            className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3"
            style={{ width: "50px", height: "50px", fontSize: "20px" }}
          >
            {nombre.charAt(0).toUpperCase()}
          </div>
          <div>
            <h6 className="mb-0">{nombre}</h6>
          </div>
        </div>

        <button
          className="btn btn-outline-primary w-100 mb-2"
          onClick={() => Navegar.usuarioPerfil(usuarioId)}
        >
          <i className="bi bi-person me-2"></i>
          Ver perfil
        </button>
      </div>
    </div>
  );
};

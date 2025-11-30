import type { PublicacionResponce } from "../../../modelos/Publicacion";
import "../../../styles/publicacionView.css";
import { AnuncianteCard } from "../componenteSecundario/View/AnuncianteCard";
import GaleriaPublicacion from "../componenteSecundario/View/GaleriaPublicacion";
import { InfoBasicaPublicacion } from "../componenteSecundario/View/InfoBasicaPublicacion";
import { PrecioYContacto } from "../componenteSecundario/View/PrecioYContacto";

interface PublicacionDetalleViewProps {
  publicacion: PublicacionResponce;
  nombreUsuario: string;
  usuarioId: string;
  onContactar: () => void;
}
const PublicacionDetalleView:React.FC<PublicacionDetalleViewProps> = ({
  publicacion,
  nombreUsuario,
  usuarioId,
  onContactar,
}) => {
  return (
    <div className="container mt-4">
      <div className="row">
        
        <div className="col-lg-8">
          <div className="card mb-3">
            <div className="card-body">

              <GaleriaPublicacion fotos={publicacion.foto} />

              <InfoBasicaPublicacion publicacion={publicacion} />
            </div>
          </div>
        </div>

        <div className="col-lg-4">

          <PrecioYContacto precio={publicacion.precio} onContactar={onContactar} />

          <AnuncianteCard nombre={nombreUsuario} usuarioId={usuarioId} />

        </div>
      </div>
    </div>
  );
};

export default PublicacionDetalleView;

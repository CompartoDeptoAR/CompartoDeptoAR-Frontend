import { useState } from "react";
import type { PublicacionResponce } from "../../../modelos/Publicacion";
import "../../../styles/publicacionView.css";
import { CalificacionUsuario } from "../../Calificacion/CalificacionUsuario";
import { habitosConfig, preferenciasConfig } from "../../FormularioPerfil/helpers/config";
import { AnuncianteCard } from "../componenteSecundario/View/AnuncianteCard";
import GaleriaPublicacion from "../componenteSecundario/View/GaleriaPublicacion";
import { InfoBasicaPublicacion } from "../componenteSecundario/View/InfoBasicaPublicacion";
import { PrecioYContacto } from "../componenteSecundario/View/PrecioYContacto";
import { SeccionLecturaCheckboxes } from "../componenteSecundario/View/SeccionLecturaCheckboxes";
import { MiniChat } from "../../Chat/MiniChat/MiniChat";

interface PublicacionDetalleViewProps {
  publicacion: PublicacionResponce;
  usuarioIdActual: string; // tu usuario logueado
}

const PublicacionDetalleView: React.FC<PublicacionDetalleViewProps> = ({
  publicacion,
  usuarioIdActual,
}) => {
  const [mostrarChat, setMostrarChat] = useState(false);

  const nombreUsuario = publicacion.usuarioNombre || "Usuario";

  return (
    <>
      <div className="container mt-4">
        <div className="row">
          <div className="col-lg-8">
            <div className="card mb-3">
              <div className="card-body">
                <GaleriaPublicacion fotos={publicacion.foto} />
                <InfoBasicaPublicacion publicacion={publicacion} />
                <SeccionLecturaCheckboxes
                  titulo="Hábitos del anunciante"
                  config={habitosConfig}
                  datos={publicacion.habitos}
                />
                <SeccionLecturaCheckboxes
                  titulo="Preferencias del anunciante"
                  config={preferenciasConfig}
                  datos={publicacion.preferencias}
                />
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <PrecioYContacto
              precio={publicacion.precio}
              onContactar={() => setMostrarChat(true)}
            />
            <AnuncianteCard nombre={nombreUsuario} usuarioId={publicacion.usuarioId!} />
            <CalificacionUsuario usuarioId={publicacion.usuarioId!} nombre={nombreUsuario} />
          </div>
        </div>
      </div>

      <MiniChat
        visible={mostrarChat}
        onClose={() => setMostrarChat(false)}
        idPublicacion={publicacion.id!}
        idDestinatario={publicacion.usuarioId!}
        idUsuarioActual={usuarioIdActual}
        nombreDestinatario={nombreUsuario}
      />
    </>
  );
};

export default PublicacionDetalleView;

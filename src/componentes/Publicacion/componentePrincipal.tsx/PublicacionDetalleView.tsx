import { useEffect, useState } from "react";
import type { PublicacionResponce } from "../../../modelos/Publicacion";
import "../../../styles/publicacionView.css";
import { CalificacionUsuario } from "../../Calificacion/CalificacionUsuario";
import { habitosConfig, preferenciasConfig } from "../../FormularioPerfil/helpers/config";
import { AnuncianteCard } from "../componenteSecundario/View/AnuncianteCard";
import GaleriaPublicacion from "../componenteSecundario/View/GaleriaPublicacion";
import { InfoBasicaPublicacion } from "../componenteSecundario/View/InfoBasicaPublicacion";
import { PrecioYContacto } from "../componenteSecundario/View/PrecioYContacto";
import { SeccionLecturaCheckboxes } from "../componenteSecundario/View/SeccionLecturaCheckboxes";

import { Navegar } from "../../../navigation/navigationService";
import { MiniChat } from "../../Chat/MiniChat";
import { BotonDenunciaConId } from "../../../helpers/Botones";
import { MapaPublicacion } from "../componenteSecundario/View/MapaPublicacion";
import { isLoggedIn } from "../../../helpers/funcion";
import { TokenService } from "../../../services/auth/tokenService";

interface PublicacionDetalleViewProps {
  publicacion: PublicacionResponce;
  usuarioNombre: string;
  usuarioId: string;
}

const PublicacionDetalleView: React.FC<PublicacionDetalleViewProps> = ({
  publicacion,
  usuarioNombre,
  usuarioId,
}) => {
  const [mostrarChat, setMostrarChat] = useState(false);
  const [estaLogueado, setEstaLogueado] = useState(isLoggedIn());

  const habitos = publicacion.habitos || {};
  const preferencias = publicacion.preferencias || {};
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    setEstaLogueado(isLoggedIn());

    const verificarLogin = () => {
      setEstaLogueado(isLoggedIn());
    };

    window.addEventListener('storage', verificarLogin);
    const interval = setInterval(verificarLogin, 500);

    return () => {
      window.removeEventListener('storage', verificarLogin);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (!publicacion.ubicacion) return;

    obtenerCoordenadas(publicacion.ubicacion).then((res) => {
      if (res) setCoords(res);
    });

  }, [publicacion.ubicacion]);

  async function obtenerCoordenadas(direccion: string) {
    const token = import.meta.env.VITE_MAPBOX_TOKEN;
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(direccion)}.json?access_token=${token}&limit=1`
    );
    const data = await response.json();
    if (data.features && data.features.length > 0) {
      const [lng, lat] = data.features[0].center;
      return { lat, lng };
    }
    return null;
  }

  const handleContactar = () => {
    if (!estaLogueado) {
      Navegar.restrictedAccess();
    } else {
      setMostrarChat(true);
    }
  };

  return (
    <>
      <div className="container mt-4">
        <div className="row">
          <div className="col-lg-8">
            <div className="card mb-3">
              <div className="card-body">
                <GaleriaPublicacion fotos={publicacion.foto || []} />
                <InfoBasicaPublicacion publicacion={publicacion} />

                <SeccionLecturaCheckboxes
                  titulo="Hábitos del anunciante"
                  config={habitosConfig}
                  datos={habitos}
                  textoVacio="No se especificaron hábitos"
                />

                <SeccionLecturaCheckboxes
                  titulo="Preferencias del anunciante"
                  config={preferenciasConfig}
                  datos={preferencias}
                  textoVacio="No se especificaron preferencias"
                />
                {coords && <MapaPublicacion lat={coords.lat} lng={coords.lng} />}
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <PrecioYContacto
              precio={publicacion.precio}
              onContactar={handleContactar}
            />
            <AnuncianteCard nombre={usuarioNombre} usuarioId={usuarioId} />
            <CalificacionUsuario usuarioId={usuarioId} nombre={usuarioNombre} />
          </div>
        </div>
      </div>

      <div className="btn-skip-container">
        <button className="btn-skip" onClick={() => Navegar.volverAtras()}>
          Volver
        </button>
      </div>

      <div className="btn-skip-container" style={{ bottom: '20px', left: '20px', right: 'auto' }}>
        <button className="btn-skip" style={{ backgroundColor: '#dc3545' }}>
          <BotonDenunciaConId texto="⚠️ Reportar usuario" idContenido={publicacion.id!} />
        </button>
      </div>

      {estaLogueado && (
        <MiniChat
          visible={mostrarChat}
          onClose={() => setMostrarChat(false)}
          idPublicacion={publicacion.id || ""}
          idDestinatario={publicacion.usuarioId || ""}
          idUsuarioActual={TokenService.getUid()!}
          nombreDestinatario={usuarioNombre}
        />
      )}
    </>
  );
};

export default PublicacionDetalleView;
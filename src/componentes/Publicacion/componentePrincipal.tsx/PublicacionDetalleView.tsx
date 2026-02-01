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

import { MapaPublicacion } from "../componenteSecundario/View/MapaPublicacion";
import { isLoggedIn } from "../../../helpers/funcion";
import { TokenService } from "../../../services/auth/tokenService";
import { BotonDenuncia, BotonFavorito, BotonVolver } from "@/componentes/common/buttons";
import { useFavoritos } from "@/hooks/pagina/favorito/useFavoritos"; 
import { ModalAccesoRestringido } from "@/componentes/ToastNotification/ModalAccesoRestringido";

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
  const [esFavorito, setEsFavorito] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);
  const {
    toggleFavorito,
    verificarEsFavorito,
  } = useFavoritos();


  

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

  useEffect(() => {
  const verificar = async () => {
      if (publicacion.id) {
        const favorito = await verificarEsFavorito(publicacion.id);
        setEsFavorito(favorito);
      }
    };

    verificar();
  }, [publicacion.id, verificarEsFavorito]);

  const handleToggleFavorite = () => {
    if (!isLoggedIn()) {
      setMostrarModal(true);
      return;
    }

    toggleFavorito(publicacion.id!);
  };


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
           
                <div className="galeria-wrapper">
                  <BotonFavorito
                    esFavorito={esFavorito}
                    onToggle={handleToggleFavorite}
                    className="galeria-favorito"
                  />

                  <GaleriaPublicacion fotos={publicacion.foto || []} />
                </div>

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
        <BotonVolver />
      </div>

      <div className="btn-skip-container" style={{ bottom: '20px', left: '20px', right: 'auto' }}>
        <button className="btn-skip" style={{ backgroundColor: '#dc3545' }}>
          <BotonDenuncia texto="⚠️ Reportar usuario" idContenido={publicacion.id!} />
        </button>
      </div>

      {estaLogueado && (
        <MiniChat
          visible={mostrarChat}
          onClose={() => setMostrarChat(false)}
          idPublicacion={publicacion.id || ""}
          idDestinatario={publicacion.usuarioFirebaseUid || ""}
          idUsuarioActual={TokenService.getUid()!}
          nombreDestinatario={usuarioNombre}
        />
      )}
      <ModalAccesoRestringido
        visible={mostrarModal}
        onLogin={() => Navegar.auth()}
        onClose={() => setMostrarModal(false)}
      />

    </>
  );
};

export default PublicacionDetalleView;
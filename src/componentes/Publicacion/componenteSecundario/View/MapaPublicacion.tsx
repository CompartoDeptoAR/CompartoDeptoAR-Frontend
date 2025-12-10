import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

interface Props {
  lat: number;
  lng: number;
}

export const MapaPublicacion: React.FC<Props> = ({ lat, lng }) => {
  return (
    <div style={{ width: "100%", height: "300px" }}>
      <MapContainer
        center={[lat, lng]}
        zoom={15}
        scrollWheelZoom={false}
        style={{ width: "100%", height: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={[lat, lng]}>
          <Popup>Ubicación aproximada</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

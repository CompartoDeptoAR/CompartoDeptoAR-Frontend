
import React from "react";
//import Map, { Marker } from "react-map-gl";

interface MapaProps {
  lat: number;
  lng: number;
  zoom?: number;
}

export const MapaPublicacion: React.FC<MapaProps> = ({ lat, lng, zoom = 12 }) => {
  return (
    <div style={{ width: "100%", height: "400px", marginBottom: "20px" }}>
      
    </div>
  );
};
/*

<Map
        initialViewState={{
          latitude: lat,
          longitude: lng,
          zoom,
        }}
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
        style={{ width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/streets-v11"
      >
        <Marker latitude={lat} longitude={lng} />
      </Map>

      */
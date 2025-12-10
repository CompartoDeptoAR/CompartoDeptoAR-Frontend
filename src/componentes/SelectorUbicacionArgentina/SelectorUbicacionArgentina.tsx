import React, { useState, useEffect } from "react";
//npm install react-argentina-geo

interface Provincia {
  id: string;
  nombre: string;
}

interface Municipio {
  id: string;
  nombre: string;
}

interface SelectorUbicacionProps {
  provincia: string;
  localidad: string;
  onProvinciaChange: (provincia: string) => void;
  onLocalidadChange: (localidad: string) => void;
  disabled?: boolean;
  required?: boolean;
}
//https://github.com/facufrau/react-argentina-geo
const SelectorUbicacionArgentina: React.FC<SelectorUbicacionProps> = ({
  provincia,
  localidad,
  onProvinciaChange,
  onLocalidadChange,
  disabled = false,
  required = false,
}) => {
  const [provincias, setProvincias] = useState<Provincia[]>([]);
  const [municipios, setMunicipios] = useState<Municipio[]>([]);
  const [loadingProvincias, setLoadingProvincias] = useState(true);
  const [loadingMunicipios, setLoadingMunicipios] = useState(false);


  useEffect(() => {
    const fetchProvincias = async () => {
      try {
        const response = await fetch(
          "https://apis.datos.gob.ar/georef/api/provincias?campos=id,nombre&max=24"
        );
        const data = await response.json();
        setProvincias(data.provincias);
      } catch (error) {
        console.error("Error al cargar provincias:", error);
      } finally {
        setLoadingProvincias(false);
      }
    };

    fetchProvincias();
  }, []);


  useEffect(() => {
    if (!provincia) {
      setMunicipios([]);
      return;
    }

    const fetchMunicipios = async () => {
      setLoadingMunicipios(true);
      try {
        const response = await fetch(
          `https://apis.datos.gob.ar/georef/api/municipios?provincia=${encodeURIComponent(
            provincia
          )}&campos=id,nombre&max=500`
        );
        const data = await response.json();
        setMunicipios(data.municipios);
      } catch (error) {
        console.error("Error al cargar municipios:", error);
      } finally {
        setLoadingMunicipios(false);
      }
    };

    fetchMunicipios();
  }, [provincia]);

  const handleProvinciaChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  const nuevaProvincia = e.target.value;
  onProvinciaChange(nuevaProvincia);
  onLocalidadChange(""); 
};


  const handleLocalidadChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  onLocalidadChange(e.target.value);
};


  return (
    <div className="row">
      <div className="col-md-6 mb-3">
        <label htmlFor="provincia" className="form-label fw-semibold">
          Provincia {required && <span className="text-danger">*</span>}
        </label>
        <input
          list="lista-provincias"
          className="form-control"
          id="provincia"
          placeholder={loadingProvincias ? "Cargando..." : "Escribe una provincia"}
          value={provincia}
          onChange={(e) => handleProvinciaChange(e as any)}
          disabled={disabled || loadingProvincias}
          required={required}
        />

        <datalist id="lista-provincias">
          {provincias.map((prov) => (
            <option key={prov.id} value={prov.nombre} />
          ))}
        </datalist>

      </div>

      <div className="col-md-6 mb-3">
        <label htmlFor="localidad" className="form-label fw-semibold">
          Localidad/Municipio {required && <span className="text-danger">*</span>}
        </label>
        <input
            list="lista-localidades"
            className="form-control"
            id="localidad"
            placeholder={
              loadingMunicipios
                ? "Cargando..."
                : !provincia
                ? "Primero elige una provincia"
                : "Escribe una localidad"
            }
            value={localidad}
            onChange={(e) => handleLocalidadChange(e as any)}
            disabled={disabled || !provincia || loadingMunicipios}
            required={required}
          />

          <datalist id="lista-localidades">
            {municipios.map((mun) => (
              <option key={mun.id} value={mun.nombre} />
            ))}
          </datalist>


      </div>
    </div>
  );
};

export default SelectorUbicacionArgentina;
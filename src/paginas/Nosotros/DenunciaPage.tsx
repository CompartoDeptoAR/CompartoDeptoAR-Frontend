import React from "react";
import { useDenuncia } from "../../hooks/pagina/nosotros/useDenuncia";
import FormularioDenuncia from "../../componentes/Nosotros/FormDenuncia";
import { useParams } from "react-router-dom";
import { Navegar } from "../../navigation/navigationService";


const DenunciaPage: React.FC = () => {
  const denunciaProps = useDenuncia();
  const { id } = useParams();


  return (
    <>
      <FormularioDenuncia {...denunciaProps} idContenido={id || ""} />
      
      <div className="btn-skip-container">
        <button className="btn-skip" onClick={() => Navegar.volverAtras()}>
          Volver
        </button>
      </div>
    </>
  );
};


export default DenunciaPage;
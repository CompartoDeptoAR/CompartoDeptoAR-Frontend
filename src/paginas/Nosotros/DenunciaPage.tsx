import React from "react";
import { useDenuncia } from "../../hooks/pagina/nosotros/useDenuncia";
import FormularioDenuncia from "../../componentes/Nosotros/FormDenuncia";
import { useParams } from "react-router-dom";
import { BotonVolver } from "@/componentes/common/buttons";


const DenunciaPage: React.FC = () => {
  const denunciaProps = useDenuncia();
  const { id } = useParams();


  return (
    <>
      <FormularioDenuncia {...denunciaProps} idContenido={id || ""} />
      
      <div className="btn-skip-container">
        <BotonVolver />
      </div>
    </>
  );
};


export default DenunciaPage;
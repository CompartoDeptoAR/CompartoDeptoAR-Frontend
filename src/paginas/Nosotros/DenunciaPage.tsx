import React from "react";
import { useDenuncia } from "../../hooks/pagina/nosotros/useDenuncia";
import FormularioDenuncia from "../../componentes/Nosotros/FormDenuncia";
import { useParams } from "react-router-dom";


const DenunciaPage: React.FC = () => {
const denunciaProps = useDenuncia();
const { id } = useParams();


return <FormularioDenuncia {...denunciaProps} idContenido={id || ""} />;
};


export default DenunciaPage;
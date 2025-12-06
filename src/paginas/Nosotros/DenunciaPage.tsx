import React from "react";
import { useDenuncia } from "../../hooks/pagina/nosotros/useDenuncia";
import FormularioGenerico from "../../componentes/Nosotros/FormContactanosGenerico";

const DenunciaPage: React.FC = () => {
  const denunciaProps = useDenuncia();

  return (
    <FormularioGenerico
      {...denunciaProps}
      titulo="Realizar Denuncia"
      mensajeLabel="Descripción de la denuncia"
      mensajePlaceholder="Describí la situación que querés denunciar"
      mensajeExito="Tu denuncia fue recibida. Será procesada a la brevedad."
      textoBoton="Enviar denuncia"
      maxPalabras={500}
    />
  );
};

export default DenunciaPage;
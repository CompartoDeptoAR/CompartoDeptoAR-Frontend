import React from "react";
import { useContactanos } from "../../hooks/pagina/nosotros/useContactanos";
import FormularioGenerico from "../../componentes/Nosotros/FormContactanosGenerico";


const ContactanosPage: React.FC = () => {
  const contactanosProps = useContactanos();

  return (
    <FormularioGenerico
      {...contactanosProps}
      titulo="Contáctanos"
      mensajePlaceholder="Escribí tu mensaje"
      maxPalabras={300}
    />
  );
};

export default ContactanosPage;
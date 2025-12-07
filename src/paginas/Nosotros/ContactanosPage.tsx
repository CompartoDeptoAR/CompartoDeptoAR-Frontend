import React from "react";
import { useContactanos } from "../../hooks/pagina/nosotros/useContactanos";
import FormularioGenerico from "../../componentes/Nosotros/FormContactanosGenerico";

const ContactanosPage: React.FC = () => {
  const contactanosProps = useContactanos();

  return (
    <div className="py-4">
      <FormularioGenerico
        titulo="Contactanos"
        {...contactanosProps}
      />
    </div>
  );
};

export default ContactanosPage;

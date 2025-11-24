import React from "react";
import { useContactanos } from "../../hooks/nosotros/useContactanos";
import  FormContactanos  from "../../componentes/Nosotros/FormContactanos";

const ContactanosPage: React.FC = () => {
  const contactanosProps = useContactanos();

  return <FormContactanos {...contactanosProps} />;
};

export default ContactanosPage;
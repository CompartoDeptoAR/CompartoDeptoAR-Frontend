import React from "react";
import { useContactanos } from "../../hooks/nosotros/useContactanos";
import FormContactanos from "../../componentes/Nosotros/FormContactanos";


const ContactanosPage: React.FC = () => {
  const {
    email,
    mensaje,
    enviado,
    error,
    palabras,
    setEmail,
    setMensaje,
    setEnviado,
    setError,
    manejarEnvio
  } = useContactanos();

  return <FormContactanos
            email={email}
            mensaje={mensaje}
            enviado={enviado}
            error={error}
            palabras={palabras}
            setEmail={setEmail}
            setMensaje={setMensaje}
            setEnviado={setEnviado}
            setError={setError}
            manejarEnvio={manejarEnvio}
          />
};

export default ContactanosPage;

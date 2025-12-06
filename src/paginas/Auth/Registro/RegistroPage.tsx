import SegundoFormRegistro from "../../../componentes/FormAuth/FormularioRegistro/SegundoFormRegistro";
import PrimerFormRegistro from "../../../componentes/FormAuth/FormularioRegistro/PrimerFormRegistro";
import ToastNotification from "../../../componentes/ToastNotification/ToastNotification";
import { useRegistro } from "../../../hooks/auth/useRegistro";

const RegistroPage = ({ onSwitch }: { onSwitch: () => void }) => {
  const {
    paso,
    nombreCompleto,
    correo,
    contraseña,
    mostrarPassword,
    edad,
    genero,
    descripcion,
    habitos,
    preferencias,
    toast,
    setNombreCompleto,
    setCorreo,
    setContraseña,
    togglePassword,
    setEdad,
    setGenero,
    setDescripcion,
    setHabitos,
    setPreferencias,
    handlePaso1Submit,
    handlePaso2Submit,
    handleCancelarPaso2,
    hideToast
  } = useRegistro();

  return (
    <>
      {paso === 1 ? (
        <PrimerFormRegistro
          nombreCompleto={nombreCompleto}
          correo={correo}
          contraseña={contraseña}
          mostrarPassword={mostrarPassword}
          setNombreCompleto={setNombreCompleto}
          setCorreo={setCorreo}
          setContraseña={setContraseña}
          togglePassword={togglePassword}
          handleSubmit={handlePaso1Submit}
          onSwitch={onSwitch}
        />
      ) : (
        <SegundoFormRegistro
          edad={edad}
          genero={genero}
          descripcion={descripcion}
          habitos={habitos}
          preferencias={preferencias}
          setEdad={setEdad}
          setGenero={setGenero}
          setDescripcion={setDescripcion}
          setHabitos={setHabitos}
          setPreferencias={setPreferencias}
          handleSubmit={handlePaso2Submit}
          onCancelar={handleCancelarPaso2}
        />
      )}

      <ToastNotification
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={hideToast}
      />
    </>
  );
};

export default RegistroPage;
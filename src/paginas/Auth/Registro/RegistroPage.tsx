import SegundoFormRegistro from "../../../componentes/FormAuth/FormularioRegistro/SegundoFormRegistro";
import PrimerFormRegistro from "../../../componentes/FormAuth/FormularioRegistro/PrimerFormRegistro";
import { useRegistro } from "../../../hooks/auth/useRegistro";
import ModalRegistroPaso2 from "@/componentes/FormAuth/FormularioRegistro/ModalRegistroPaso2";
import SwalNotification from "@/componentes/ToastNotification/SwalNotification";

const RegistroPage = ({ onSwitch }: { onSwitch: () => void }) => {
  const {
    mostrarPaso2,
    nombreCompleto,
    correo,
    contraseña,
    mostrarPassword,
    edad,
    genero,
    descripcion,
    habitos,
    preferencias,
    loading,
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
  } = useRegistro(onSwitch);

  return (
    <>
      
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
        {mostrarPaso2 &&(
          <ModalRegistroPaso2 onClose={handleCancelarPaso2}>
            <SegundoFormRegistro
              edad={edad}
              genero={genero}
              descripcion={descripcion}
              habitos={habitos}
              preferencias={preferencias}
              loading={loading}
              setEdad={setEdad}
              setGenero={setGenero}
              setDescripcion={setDescripcion}
              setHabitos={setHabitos}
              setPreferencias={setPreferencias}
              handleSubmit={handlePaso2Submit}
              onCancelar={handleCancelarPaso2}
            />
          </ModalRegistroPaso2>
        )}

      <SwalNotification
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => {
          hideToast();

          if (toast.type === "success") {
            handleCancelarPaso2(); 
            onSwitch();  
          }
        }}
      />


    </>
  );
};

export default RegistroPage;
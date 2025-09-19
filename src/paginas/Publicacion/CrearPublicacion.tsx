import { useState } from "react";
import FormularioPublicacion from "../../componentes/FormularioPublicacion/FormularioPublicacion";
import type { PreferenciaOpciones } from "../../modelos/Usuario";

const CrearPublicacion=()=>{
    const [titulo, setTitulo] = useState<string>('');
    const [ubicacion, setUbicacion] = useState<string>('');
    const [precio, setPrecio] = useState<number>(0);
    const [descripcion, setDescripcion] = useState<string>('');
    const [foto, setFoto] = useState<string>('');
    const [reglas, setReglas] = useState<string>('');
    const [preferencia, setPreferencia] = useState<PreferenciaOpciones[]>();
    
    
    
    return(
        <FormularioPublicacion
            titulo={titulo}
            ubicacion={ubicacion}
            precio={precio}
            descripcion={descripcion}
            foto={foto}
            reglas={reglas}
            preferencia={preferencia}
            
        />
    )
}

export default CrearPublicacion;
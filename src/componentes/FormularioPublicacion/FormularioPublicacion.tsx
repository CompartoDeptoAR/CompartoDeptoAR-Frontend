import type React from "react";

interface FormularioPublicacionProps{
    titulo:string;
    ubicacion:string;
    precio:number;
    descripcion:string;
    foto:string;
    reglas: string;
    preferencia: string[];
    handleSubmit: (e: React.FormEvent) => void;

}

const FormularioPublicacion: React.FC<FormularioPublicacionProps>=({})=>{

    return(
        <form action="">

        </form>
    )
}

export default FormularioPublicacion;
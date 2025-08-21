import type React from "react";
import type { Genero, PreferenciaOpciones, PreferenciasUsuario } from "../../modelos/Usuario";


interface RegistroFormOpcionalProps{
    edad: number;
    genero: Genero;
    descripcion: string;
    preferencia: PreferenciasUsuario;
    setEdad: (value: number) => void;
    setGenero: (value: Genero) => void;
    setDescripcion: (value: string) => void;
    setPreferencia: (value: PreferenciasUsuario) =>void;
    handleSubmit:(e: React.FormEvent) => void;
}

const RegistroFormOpcional: React.FC<RegistroFormOpcionalProps>=({
    edad,
    genero,
    descripcion,
    preferencia,
    setEdad,
    setGenero,
    setDescripcion,
    setPreferencia,
    handleSubmit,
})=>{
    
    const opciones: PreferenciaOpciones[] = [
        "Fumador",
        "No Fumador",
        "Mascotas",
        "Sin Mascotas",
        "Horarios flexibles"
    ];

    const toggleOpcion = (opcion: PreferenciaOpciones) => {
        const nuevasOpciones = preferencia.opciones.includes(opcion)
        ? preferencia.opciones.filter(o => o !== opcion)
        : [...preferencia.opciones, opcion];
        setPreferencia({ opciones: nuevasOpciones });
    };

    return(
        <div>
            <h2>Datos faltantes</h2>
            <form onSubmit={handleSubmit} >
                {/*Edad*/}
                <div >
                    <label>Edad</label>
                    <input
                    type="number"
                    placeholder="Ej: 18"
                    value={edad}
                    onChange={(e) => setEdad(Number(e.target.value))}
                    required
                    min={18}
                    max={100}
                    />
                </div>

                {/*Genero*/}
                <div >
                    <label>Genero</label>
                    <select
                        value={genero}
                        onChange={(e) => setGenero(e.target.value as Genero)}
                        >
                        <option value="Masculino">Masculino</option>
                        <option value="Femenino">Femenino</option>
                        <option value="Prefiero no decir">Prefiero no decir</option>
                    </select>
                </div>

                {/*Descripcion*/}
                <div >
                    <label>Descripcion</label>
                    <input
                    type="string"
                    placeholder="Hola soy Juan, estoy buscando compañero de alquiler en la Cidad de La Plata, bla bla..."
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    required
                    />
                </div>
                 {/*Preferencias*/}
                <div>
                    <label>Preferencias</label>
                    {opciones.map((opcion) => (
                        <label key={opcion} style={{ display: "block" }}>
                        <input
                            type="checkbox"
                            checked={preferencia.opciones.includes(opcion)}
                            onChange={() => toggleOpcion(opcion)}
                        />
                        {opcion}
                        </label>
                    ))}
                    </div>
                   
                <button type="submit">
                    Registrarse
                </button>
            </form>
        </div>
    )
}

export default RegistroFormOpcional;
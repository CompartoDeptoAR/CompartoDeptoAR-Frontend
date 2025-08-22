import type React from "react";
import type { Genero, HabitosOpciones, PreferenciaOpciones } from "../../modelos/Usuario";


interface SegundoFormRegistroProps{
    edad: number;
    genero: Genero;
    descripcion: string;
    habitos:HabitosOpciones[];
    preferencia: PreferenciaOpciones[];
    setEdad: (value: number) => void;
    setGenero: (value: Genero) => void;
    setDescripcion: (value: string) => void;
    setHabitos: (value: HabitosOpciones[]) => void;
    setPreferencia: (value: PreferenciaOpciones[]) =>void;
    handleSubmit:(e: React.FormEvent) => void;
}

const SegundoFormRegistro: React.FC<SegundoFormRegistroProps>=({
    edad,
    genero,
    descripcion,
    habitos,
    preferencia,
    setEdad,
    setGenero,
    setDescripcion,
    setHabitos,
    setPreferencia,
    handleSubmit,
})=>{
    
    const opcionesHabitos: HabitosOpciones[] = [
        "Fumador",
        "Tengo mascotas",
        "Escucho música fuerte",
        "Me acuesto tarde",
        "Trabajo desde casa",
        "Recibo visitas seguido",
        "Cocino en casa",
        "Hago ejercicio en casa",
    ];

    const opcionesPreferencias: PreferenciaOpciones[] = [
        "No me molesta que fumen",
        "No me molestan las mascotas",
        "Ok con música fuerte",
        "Ok con horarios nocturnos",
        "Ok con visitas frecuentes",
        "Prefiero alguien ordenado",
        "Prefiero alguien tranquilo",
        "Prefiero alguien social",
    ];

    const toggleOpcionPreferencia = (opcion: PreferenciaOpciones) => {
        const nuevasOpciones = preferencia.includes(opcion)
        ? preferencia.filter(o => o !== opcion)
        : [...preferencia, opcion];
        setPreferencia(nuevasOpciones);
    };

    const toggleOpcionHabito = (opcion: HabitosOpciones) => {
        const nuevasOpciones = habitos.includes(opcion)
        ? habitos.filter(o => o !== opcion)
        : [...habitos, opcion];
        setHabitos(nuevasOpciones);
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
                    type="text"
                    placeholder="Hola soy Juan, estoy buscando compañero de alquiler en la Cidad de La Plata, bla bla..."
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    max={100}
                    
                    />
                </div>
                {/*Mis habitos*/}
                <div>
                    <h4>Tus Hábitos</h4>
                    <h5>Tilda solo lo que vos realmente hacés.</h5>
                    {opcionesHabitos.map((opcion) => (
                        <label key={opcion} style={{ display: "block" }}>
                        <input
                            type="checkbox"
                            checked={habitos.includes(opcion)}
                            onChange={() => toggleOpcionHabito(opcion)}
                        />
                        {opcion}
                        </label>
                    ))}
                </div>
                {/*Preferencias*/}
                <div>
                    <h4>Preferencias</h4>
                    <h5>Tilda solo las opcines que no te moleste del otro.</h5>
                    {opcionesPreferencias.map((opcion) => (
                        <label key={opcion} style={{ display: "block" }}>
                        <input
                            type="checkbox"
                            checked={preferencia.includes(opcion)}
                            onChange={() => toggleOpcionPreferencia(opcion)}
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

export default SegundoFormRegistro;
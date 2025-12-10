import { useState, useEffect } from "react";
import TodasLasPublicaciones from "../Publicacion/Listar/TodasLasPublicaciones";
import { Navegar } from "../../navigation/navigationService";
import "../../styles/HomePage.css";
import { isLoggedIn } from "../../helpers/funcion";

const HomePage = () => {
    const [estaIn, setIn] = useState(isLoggedIn());

    useEffect(() => {
        const actualizarEstado = () => setIn(isLoggedIn());
        window.addEventListener("authChange", actualizarEstado);
        return () => {
            window.removeEventListener("authChange", actualizarEstado);
        };
    }, []);

    return (
        <div className="home-fondo">
            <div className="text-center">
                <h1 className="titulo-home mb-4">Bienvenido a CompartoDeptoAr</h1>

                {estaIn && (
                    <button
                        className="btn btn-primary mb-3"
                        onClick={() => Navegar.crearPublicacion()}
                    >
                        Nueva Publicación
                    </button>
                )}

                <TodasLasPublicaciones />
            </div>
        </div>
    );
};

export default HomePage;

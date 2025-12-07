import TodasLasPublicaciones from "../Publicacion/Listar/TodasLasPublicaciones";
import { Navegar } from "../../navigation/navigationService";
import "../../styles/HomePage.css";

const HomePage = () => {
    return (
        <div className="text-center">
            <h1 className="titulo-home mb-4">Bienvenido a CompartoDeptoAR</h1>
            <button className="btn btn-primary" onClick={() => Navegar.crearPublicacion()}>
                Nueva Publicación
            </button>
            <TodasLasPublicaciones/>
        </div>
    );
};

export default HomePage;
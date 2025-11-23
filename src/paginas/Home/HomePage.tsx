import TodasLasPublicaciones from "../Publicacion/Listar/TodasLasPublicaciones";
import { Navigation } from "../../navigation/navigationService";

const HomePage = () => {
    return (
        <div className="text-center">
            <h1 className="mb-4">Bienvenido a CompartoDeptoAR</h1>
            <button className="btn btn-primary" onClick={() => Navigation.crearPublicacion()}>
                Nueva Publicación
            </button>
            <TodasLasPublicaciones/>
        </div>
    );
};

export default HomePage;
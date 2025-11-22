import { useNavigate } from "react-router-dom";
import TodasLasPublicaciones from "../Publicacion/Listar/TodasLasPublicaciones";


const HomePage =()=>{

    const navigate = useNavigate();

    return(
        <div className="text-center">
            <h1 className="mb-4">Bienvenido a CompartoDeptoAR</h1>
            <button className="btn btn-primary" onClick={() => navigate("/crear-publicacion")}>
                Nueva Publicación
            </button>
            <TodasLasPublicaciones/>
        </div>
    )
}

export default HomePage;
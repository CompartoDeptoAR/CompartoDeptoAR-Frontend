import { useNavigate } from "react-router-dom";


const HomePage =()=>{

    const navigate = useNavigate();

    function cerrarSesion() {
        localStorage.removeItem("token");
        navigate("/login");
    }
    return(
        <>
        hola mundo!!!
        <button onClick={cerrarSesion}>Cerrar sesión</button>

        </>
    )
}

export default HomePage;
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "../componentes/Layout/Layout";
import ProtectedRouter from "./ProtectedRoute";
import AuthPage from "../paginas/Auth/AuthPage";
import { useUser } from "../contexts/UsuarioContext";



const Router: React.FC = () => {
  const { loggedIn } = useUser();
  return (
    <Routes>

      <Route path="/auth" element={!loggedIn ? <AuthPage /> : <Navigate to="/" replace />}/>
      
      <Route element={<Layout />}>
        <Route path="/*" element={<ProtectedRouter />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default Router;

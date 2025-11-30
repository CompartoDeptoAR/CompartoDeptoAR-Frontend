import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { setNavigator } from "./navigation/navigationService";
import Router from "./routers/Router";
import './styles/index.css'

const App = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setNavigator(navigate);
  }, []);

  return <Router />
};

export default App;

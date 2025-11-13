import { LoadingProvider } from "./contexts/LoadingContext";
import GlobalLoader from "./paginas/Loading/GlobalLoader";
import Router from "./routers/Router";


const App: React.FC =()=>{
    return(
        <LoadingProvider>
            <GlobalLoader />
            <Router />
        </LoadingProvider>
         
    );
};

export default App;
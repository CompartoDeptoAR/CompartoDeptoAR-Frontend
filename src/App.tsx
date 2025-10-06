import { LoadingProvider } from "./contexts/LoadingContext";
import GlobalLoader from "./paginas/Loading/GlobalLoader";
import Router from "./routers/Router";


const App: React.FC =()=>{
    return(
        <div>
            <LoadingProvider>
                <GlobalLoader />
                <Router />
            </LoadingProvider>
            
            
        </div>
         
    );
};

export default App;
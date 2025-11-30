import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import "bootstrap/dist/css/bootstrap.min.css";
import './api/config/interceptores.ts';  
import { LoadingProvider } from './contexts/LoadingContext';
import GlobalLoader from './paginas/Loading/GlobalLoader';


createRoot(document.getElementById('root')!).render(
   <StrictMode>
    <BrowserRouter>
        <LoadingProvider>
          <GlobalLoader /> 
          <App />
        </LoadingProvider>
    </BrowserRouter>
  </StrictMode>,
)
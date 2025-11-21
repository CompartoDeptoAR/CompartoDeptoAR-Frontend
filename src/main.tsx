import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import "bootstrap/dist/css/bootstrap.min.css";
import './api/config/interceptores.ts';  
import GlobalLoader from './paginas/Loading/GlobalLoader.tsx';

createRoot(document.getElementById('root')!).render(
   <StrictMode>
    <BrowserRouter>
        <GlobalLoader />
        <App />
    </BrowserRouter>
  </StrictMode>,
)
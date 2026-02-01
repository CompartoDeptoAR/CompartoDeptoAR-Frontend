import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import "bootstrap/dist/css/bootstrap.min.css";
import './services/api/config/interceptores';  
import { LoadingProvider } from './contexts/LoadingContext';

createRoot(document.getElementById('root')!).render(
   <StrictMode>
    <BrowserRouter>
        <LoadingProvider>
          <App />
        </LoadingProvider>
    </BrowserRouter>
  </StrictMode>,
)
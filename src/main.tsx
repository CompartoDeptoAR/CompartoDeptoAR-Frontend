import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { UsuarioProvider } from './contexts/UsuarioContext.tsx'
import './styles/index.css'
createRoot(document.getElementById('root')!).render(
   <StrictMode>
    <BrowserRouter>
      <UsuarioProvider>
        <App />
      </UsuarioProvider>
    </BrowserRouter>
  </StrictMode>,
)
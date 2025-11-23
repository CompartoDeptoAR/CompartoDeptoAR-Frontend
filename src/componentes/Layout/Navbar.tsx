import React from "react";
import { Navbar, Nav, Form, FormControl, Button, NavDropdown, Badge } from "react-bootstrap";
import { Bell, MessageCircle, Settings } from "lucide-react";

import { TokenService } from "../../services/auth/tokenService";
import apiAuth from "../../api/endpoints/auth";
import { Navigation } from "../../navigation/navigationService";

const NavbarApp: React.FC = () => {

  const authData = TokenService.getAuthData(); 
  const isLoggedIn = !!authData; 
  
  function cerrarSesion() {
    apiAuth.auth.logout();
    Navigation.home(); 
  }
  
  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="px-4 shadow-sm">
      <Navbar.Brand onClick={() => Navigation.home()} className="fw-bold text-uppercase">
        Comparto DeptoAR
      </Navbar.Brand>

      <Navbar.Toggle aria-controls="navbar-content" />
      <Navbar.Collapse id="navbar-content">
        {/* Buscador */}
        <Form className="d-flex mx-auto" style={{ maxWidth: "400px" }}>
          <FormControl
            type="search"
            placeholder="Buscar..."
            className="me-2"
            aria-label="Buscar"
          />
          <Button variant="outline-light">Buscar</Button>
        </Form>
       
        <Nav className="ms-auto align-items-center">
          {isLoggedIn && ( 
            <>
              <Nav.Link onClick={() => Navigation.notificaciones()} className="position-relative">
                <Bell size={20} />
                <Badge bg="danger" pill className="position-absolute top-0 start-100 translate-middle">
                  3
                </Badge>
              </Nav.Link>

              <Nav.Link onClick={() => Navigation.chat("")} className="position-relative">
                <MessageCircle size={20} />
                <Badge bg="primary" pill className="position-absolute top-0 start-100 translate-middle">
                  5
                </Badge>
              </Nav.Link>
            </>
          )}

          {/* 👤 Menú desplegable del usuario */}
          <NavDropdown title="Mi Cuenta" align="end" id="dropdown-usuario">
            <NavDropdown.Item onClick={() => Navigation.miPerfil()}>Perfil</NavDropdown.Item>
            <NavDropdown.Item onClick={() => Navigation.contactos()}>Contactos</NavDropdown.Item>
            <NavDropdown.Item onClick={() => Navigation.misPublicaciones()}>Mis publicaciones</NavDropdown.Item>
            <NavDropdown.Item onClick={() => Navigation.misFavoritos()}>Mis Favoritos</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item onClick={() => Navigation.configuracion()}>
              <Settings size={16} className="me-2" /> Configuración
            </NavDropdown.Item>
            <NavDropdown.Divider />
            {isLoggedIn ? (
              <NavDropdown.Item onClick={cerrarSesion} className="text-danger fw-semibold">
                Cerrar sesión
              </NavDropdown.Item>
            ) : (
              <NavDropdown.Item onClick={() => Navigation.auth()}>
                Iniciar sesión
              </NavDropdown.Item>
            )}
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavbarApp;
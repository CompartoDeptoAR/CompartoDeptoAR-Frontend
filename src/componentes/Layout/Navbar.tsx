import React from "react";
import { Navbar, Nav, Form, FormControl, Button, NavDropdown } from "react-bootstrap";
import { Bell, MessageCircle, Settings } from "lucide-react";

import { TokenService } from "../../services/auth/tokenService";
import apiAuth from "../../api/endpoints/auth";
import { Navegar } from "../../navigation/navigationService";
import { NotificacionesBadge } from "../Chat/NotificacionesBadge";
import { Rol } from "../../modelos/Roles";
import { hasRole, isLoggedIn } from "../../helpers/funcion";

const NavbarApp: React.FC = () => {

  function cerrarSesion() {
    apiAuth.auth.logout();
    Navegar.home();
  }

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="px-4 shadow-sm">
      
      {/* Logo */}
      <Navbar.Brand 
        onClick={() => Navegar.home()} 
        className="fw-bold text-uppercase" 
        style={{ cursor: "pointer" }}
      >
        Comparto DeptoAR
      </Navbar.Brand>

      <Navbar.Toggle aria-controls="navbar-content" />
      <Navbar.Collapse id="navbar-content">
        
        {/* Buscador */}
        <Form className="d-flex mx-auto" style={{ maxWidth: "400px" }}>
          <FormControl type="search" placeholder="Buscar..." className="me-2" />
          <Button variant="outline-light">Buscar</Button>
        </Form>

        <Nav className="ms-auto align-items-center">

          {/* 🔔 ICONOS: sólo si está logueado */}
          {isLoggedIn() && (
            <>
              {/* Notificaciones */}
              <Nav.Link 
                className="position-relative"
                onClick={() => Navegar.notificaciones()}
              >
                <Bell size={20} />
              </Nav.Link>

              {/* Mensajes */}
              <Nav.Link 
                className="position-relative" 
                onClick={() => Navegar.chatCompleto()}
              >
                <MessageCircle size={20} />
                <NotificacionesBadge idUsuario={TokenService.getUserId()} />
              </Nav.Link>
            </>
          )}

          {/* 🔽 MENU MI CUENTA */}
          <NavDropdown title="Mi Cuenta" align="end" id="dropdown-usuario">

            {isLoggedIn() && (
              <>
                <NavDropdown.Item onClick={() => Navegar.miPerfil()}>
                  Perfil
                </NavDropdown.Item>

                <NavDropdown.Item onClick={() => Navegar.contactos()}>
                  Contactos
                </NavDropdown.Item>

                <NavDropdown.Item onClick={() => Navegar.misPublicaciones()}>
                  Mis publicaciones
                </NavDropdown.Item>

                <NavDropdown.Item onClick={() => Navegar.misFavoritos()}>
                  Mis Favoritos
                </NavDropdown.Item>

                <NavDropdown.Divider />

                {/* ⚠️ SOLO PARA ADMIN */}
                {hasRole(Rol.ADMIN) && (
                  <NavDropdown.Item onClick={() => Navegar.admin()}>
                    Panel Admin
                  </NavDropdown.Item>
                )}

                <NavDropdown.Divider />

                <NavDropdown.Item 
                  onClick={cerrarSesion} 
                  className="text-danger fw-semibold"
                >
                  Cerrar sesión
                </NavDropdown.Item>
              </>
            )}

            {!isLoggedIn() && (
              <NavDropdown.Item onClick={() => Navegar.auth()}>
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

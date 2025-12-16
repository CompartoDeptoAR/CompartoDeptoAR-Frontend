import React from "react";
import { Nav, NavDropdown, Button } from "react-bootstrap";
import { Bell, MessageCircle } from "lucide-react";
import { NotificacionesBadge } from "../Chat/NotificacionesBadge";
import { Navegar } from "../../navigation/navigationService";
import { Rol } from "../../modelos/Roles";
import { hasRole } from "../../helpers/funcion";

interface NavbarCeluProps {
  estaLogueado: boolean;
  loadingConversaciones: boolean;
  idUsuario: string | null;
  onToggleChats: () => void;
  onCerrarSesion: () => void;
}

export const NavbarCelu: React.FC<NavbarCeluProps> = ({
  estaLogueado,
  loadingConversaciones,
  idUsuario,
  onToggleChats,
  onCerrarSesion
}) => {
  return (
    <div className="navbar-mobile-controls d-flex d-lg-none">
      {estaLogueado ? (
        <>
          <Nav.Link onClick={() => Navegar.notificaciones()}>
            <Bell size={20} />
          </Nav.Link>

          <Nav.Link>
            {loadingConversaciones ? (
              <div
                className="spinner-border text-success"
                style={{ width: "20px", height: "20px" }}
                role="status"
              />
            ) : (
              <MessageCircle
                size={20}
                style={{ cursor: "pointer" }}
                onClick={onToggleChats}
              />
            )}
            {idUsuario && <NotificacionesBadge idUsuario={idUsuario} />}
          </Nav.Link>

          <NavDropdown 
            title="Cuenta" 
            align="end" 
            id="dropdown-usuario-mobile"
          >
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
            {hasRole(Rol.ADMIN) && (
              <>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={() => Navegar.admin()}>
                  Panel Admin
                </NavDropdown.Item>
              </>
            )}
            <NavDropdown.Divider />
            <NavDropdown.Item onClick={onCerrarSesion} className="text-danger fw-semibold">
              Cerrar sesión
            </NavDropdown.Item>
          </NavDropdown>
        </>
      ) : (
        <Button 
          variant="outline-light" 
          size="sm"
          onClick={() => Navegar.auth()}
        >
          Ingresar
        </Button>
      )}
    </div>
  );
};
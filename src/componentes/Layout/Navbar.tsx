import React, { useState, useEffect, useRef } from "react";
import {Navbar,Nav,Form,FormControl,Button,NavDropdown,Spinner,Alert} from "react-bootstrap";
import { Bell, MessageCircle, Search, X, Filter, Home } from "lucide-react";

import { TokenService } from "../../services/auth/tokenService";
import apiAuth from "../../api/endpoints/auth";
import { Navegar } from "../../navigation/navigationService";
import { NotificacionesBadge } from "../Chat/NotificacionesBadge";
import { Rol } from "../../modelos/Roles";
import { hasRole, isLoggedIn } from "../../helpers/funcion";
import { FiltrosBusqueda } from "../Buscador/FiltrosBusqueda";
import apiBuscador from "../../api/endpoints/buscador";
import "../../styles/NavbarApp.css";
import { ConversacionesDropdown } from "../Chat/ConversacionesDropdown";
import { MiniChat } from "../Chat/MiniChat";
import { useConversaciones } from "../../hooks/chat/useConversaciones";

const NavbarApp: React.FC = () => {
  const [showFiltros, setShowFiltros] = useState(false);
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [resultados, setResultados] = useState<any[]>([]);
  const [loadingBusqueda, setLoadingBusqueda] = useState(false);
  const [errorBusqueda, setErrorBusqueda] = useState<string | null>(null);
  const [mostrarResultados, setMostrarResultados] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const [showChats, setShowChats] = useState(false);
  const [chatActual, setChatActual] = useState<any | null>(null);
  const { loading: loadingConversaciones } = useConversaciones(
    TokenService.getUid()
  );

  const [estaLogueado, setEstaLogueado] = useState(isLoggedIn());

  useEffect(() => {
    const verificarLogin = () => setEstaLogueado(isLoggedIn());

    window.addEventListener("storage", verificarLogin);
    window.addEventListener("popstate", verificarLogin);
    const interval = setInterval(verificarLogin, 500);

    return () => {
      window.removeEventListener("storage", verificarLogin);
      window.removeEventListener("popstate", verificarLogin);
      clearInterval(interval);
    };
  }, []);

  function cerrarSesion() {
    apiAuth.auth.logout();
    setEstaLogueado(false);
    Navegar.home();
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setMostrarResultados(false);
      }
    };

    if (mostrarResultados) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mostrarResultados]);

  const ejecutarBusqueda = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setErrorBusqueda(null);

    const texto = textoBusqueda.trim();
    if (!texto) {
      setErrorBusqueda("Ingresá texto para buscar.");
      setResultados([]);
      setMostrarResultados(true);
      return;
    }

    try {
      setLoadingBusqueda(true);
      const pubs = await apiBuscador.buscar(texto);
      setResultados(pubs);
      setMostrarResultados(true);
    } catch (err: any) {
      setResultados([]);
      setErrorBusqueda(err?.message || "Error al buscar");
      setMostrarResultados(true);
    } finally {
      setLoadingBusqueda(false);
    }
  };

  const aplicarFiltros = async (filtros: any) => {
    setErrorBusqueda(null);
    try {
      setLoadingBusqueda(true);

      if (filtros.precioMin === "") delete filtros.precioMin;
      if (filtros.precioMax === "") delete filtros.precioMax;
      if (filtros.precioMin !== undefined)
        filtros.precioMin = Number(filtros.precioMin);
      if (filtros.precioMax !== undefined)
        filtros.precioMax = Number(filtros.precioMax);

      const pubs = await apiBuscador.buscarConFiltros(filtros);
      setResultados(pubs);
      setMostrarResultados(true);
    } catch (err: any) {
      setResultados([]);
      setErrorBusqueda(err?.message || "Error al aplicar filtros");
      setMostrarResultados(true);
    } finally {
      setLoadingBusqueda(false);
    }
  };

  const limpiarBusqueda = () => {
    setTextoBusqueda("");
    setResultados([]);
    setMostrarResultados(false);
    setErrorBusqueda(null);
  };

  const abrirPublicacion = (id: string) => {
    try {
      (Navegar as any).publicacion(id);
    } catch {
      window.location.href = `/publicacion/${id}`;
    } finally {
      setMostrarResultados(false);
    }
  };

  return (
    <>
      <Navbar
        bg="dark"
        variant="dark"
        expand="md"
        className="px-3 shadow-sm position-relative"
      >
        <Navbar.Brand
          onClick={() => {
            Navegar.home();
            limpiarBusqueda();
          }}
          className="fw-bold d-flex align-items-center"
          style={{ cursor: "pointer" }}
        >
          <Home size={22} className="me-2 text-info" />
          <span className="d-none d-md-inline">
            <span className="text-info fw-bold">Comparto</span>
            <span className="text-light fw-light">DeptoAR</span>
          </span>
          <span className="d-inline d-md-none">CDAR</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbar-content" />
        <Navbar.Collapse id="navbar-content">
          {/* BUSCADOR */}
          <div
            ref={searchRef}
            className="position-relative flex-grow-1 mx-md-3 my-2 my-md-0"
          >
            <Form className="d-flex" onSubmit={ejecutarBusqueda}>
              <div className="input-group w-100">
                <span className="input-group-text bg-light">
                  <Search size={18} />
                </span>

                <FormControl
                  type="search"
                  placeholder="Buscar publicaciones..."
                  value={textoBusqueda}
                  onChange={(e) => {
                    setTextoBusqueda(e.target.value);
                    if (!e.target.value.trim()) setMostrarResultados(false);
                  }}
                  onFocus={() => {
                    if (textoBusqueda.trim()) setMostrarResultados(true);
                  }}
                />

                {textoBusqueda && (
                  <Button
                    variant="link"
                    className="text-secondary"
                    onClick={limpiarBusqueda}
                    style={{
                      position: "absolute",
                      right: "70px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      zIndex: 10
                    }}
                  >
                    <X size={16} />
                  </Button>
                )}

                <Button
                  variant="primary"
                  type="submit"
                  disabled={loadingBusqueda}
                >
                  {loadingBusqueda ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    "Buscar"
                  )}
                </Button>

                {/* Filtros mobile */}
                <Button
                  variant="outline-light"
                  className="ms-2 d-flex d-md-none"
                  onClick={() => setShowFiltros(true)}
                >
                  <Filter size={18} />
                </Button>

                {/* Filtros desktop */}
                <Button
                  variant="outline-light"
                  className="ms-2 d-none d-md-flex"
                  onClick={() => setShowFiltros(true)}
                >
                  <Filter size={18} className="me-1" />
                  Filtros
                </Button>
              </div>
            </Form>

            {mostrarResultados && (
              <div className="search-results-dropdown shadow-lg">
                <div className="p-3 border-bottom fw-semibold">
                  {resultados.length} resultados
                </div>

                <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                  {loadingBusqueda ? (
                    <div className="text-center py-4">
                      <Spinner animation="border" />
                    </div>
                  ) : errorBusqueda ? (
                    <Alert variant="warning" className="m-3">
                      {errorBusqueda}
                    </Alert>
                  ) : (
                    resultados.map((pub) => (
                      <div
                        key={pub.id}
                        className="p-3 border-bottom hover-effect"
                        onClick={() => abrirPublicacion(pub.id)}
                      >
                        <h6 className="mb-1 text-truncate">{pub.titulo}</h6>
                        <small className="text-muted">
                          {pub.categoria} • {pub.ubicacion}
                        </small>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* DERECHA */}
          <Nav className="ms-auto align-items-center gap-3 mt-3 mt-md-0 flex-row justify-content-center">
            {estaLogueado && (
              <>
                <Nav.Link onClick={() => Navegar.notificaciones()}>
                  <Bell size={20} />
                </Nav.Link>

                <Nav.Link>
                  {loadingConversaciones ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    <MessageCircle
                      size={20}
                      onClick={() => setShowChats((p) => !p)}
                    />
                  )}
                  <NotificacionesBadge idUsuario={TokenService.getUid()} />
                </Nav.Link>

                {showChats && (
                  <ConversacionesDropdown
                    idUsuario={TokenService.getUid()!}
                    onSeleccionar={(conv) => {
                      setShowChats(false);
                      setChatActual(conv);
                    }}
                  />
                )}
              </>
            )}

            {estaLogueado ? (
              <NavDropdown title="Mi Cuenta" align="end">
                <NavDropdown.Item onClick={() => Navegar.miPerfil()}>
                  Perfil
                </NavDropdown.Item>
                <NavDropdown.Item onClick={() => Navegar.misPublicaciones()}>
                  Mis publicaciones
                </NavDropdown.Item>
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
              </NavDropdown>
            ) : (
              <Button
                variant="outline-light"
                onClick={() => Navegar.auth()}
              >
                Iniciar sesión
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <FiltrosBusqueda
        show={showFiltros}
        onClose={() => setShowFiltros(false)}
        onApply={aplicarFiltros}
      />

      {chatActual && (
        <MiniChat
          visible
          onClose={() => setChatActual(null)}
          idPublicacion={chatActual.idPublicacion}
          idDestinatario={chatActual.idOtraPersona}
          idUsuarioActual={TokenService.getUid()!}
          nombreDestinatario={chatActual.nombreOtraPersona}
        />
      )}
    </>
  );
};

export default NavbarApp;


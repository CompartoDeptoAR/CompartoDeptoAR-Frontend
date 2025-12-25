import React, { useState, useEffect, useRef } from "react";
import { Navbar, Nav, Form, FormControl, Button, NavDropdown, Spinner, Alert } from "react-bootstrap";
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
import { NavbarCelu } from "./NavbarCelu";

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
  const { loading: loadingConversaciones } = useConversaciones(TokenService.getUid());

  const [estaLogueado, setEstaLogueado] = useState(isLoggedIn());

  useEffect(() => {
    setEstaLogueado(isLoggedIn());

    const verificarLogin = () => {
      setEstaLogueado(isLoggedIn());
    };

    window.addEventListener('storage', verificarLogin);
    window.addEventListener('popstate', verificarLogin);
    const interval = setInterval(verificarLogin, 500);

    return () => {
      window.removeEventListener('storage', verificarLogin);
      window.removeEventListener('popstate', verificarLogin);
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
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setMostrarResultados(false);
      }
    };

    if (mostrarResultados) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
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
      if (filtros.precioMin !== undefined) filtros.precioMin = Number(filtros.precioMin);
      if (filtros.precioMax !== undefined) filtros.precioMax = Number(filtros.precioMax);

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
      if (Navegar && typeof (Navegar as any).publicacion === "function") {
        (Navegar as any).publicacion(id);
        setMostrarResultados(false);
        return;
      }
    } catch (e) {}
    window.location.href = `/publicacion/${id}`;
  };

  const abrirMiniChat = (conv: any) => {
    setChatActual(conv);
  };

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg" className="px-4 shadow-sm position-relative">
        <Navbar.Brand
          onClick={() => {
            Navegar.home();
            limpiarBusqueda();
          }}
          className="fw-bold text-uppercase d-flex align-items-center"
          style={{ cursor: "pointer" }}
        >
          <Home 
            size={24}
            className="d-inline-block align-top me-2 text-info"
          />
          <span 
            className="d-none d-md-inline" 
            style={{ fontSize: '1.4rem', letterSpacing: '1px' }}
          >
            <span className="text-info fw-bold">Comparto</span> 
            <span className="text-light" style={{ fontWeight: 300 }}>DeptoAR</span>
          </span>
          <span className="d-inline d-md-none">CDAR</span>
        </Navbar.Brand>

        <NavbarCelu
          estaLogueado={estaLogueado}
          loadingConversaciones={loadingConversaciones}
          idUsuario={TokenService.getUid()}
          onToggleChats={() => setShowChats((prev) => !prev)}
          onCerrarSesion={cerrarSesion}
        />

        <Navbar.Toggle aria-controls="navbar-content">
          <Search size={20} />
        </Navbar.Toggle>

        <Navbar.Collapse id="navbar-content">
          {/* BUSCADOR (AUN BUSCA POR TITULO JEJE)*/}
          <div ref={searchRef} className="position-relative flex-grow-1 mx-lg-3 my-2 my-lg-0">
            <Form className="d-flex search-container" onSubmit={ejecutarBusqueda}>
              <div className="input-group w-100">
                <span className="input-group-text bg-light border-end-0">
                  <Search size={18} />
                </span>
                <FormControl
                  type="search"
                  placeholder="Buscar publicaciones por titulo..."
                  className="border-start-0"
                  value={textoBusqueda}
                  onChange={(e) => {
                    setTextoBusqueda(e.target.value);
                    if (e.target.value.trim() === "") {
                      setMostrarResultados(false);
                    }
                  }}
                  onFocus={() => {
                    if (resultados.length > 0 || textoBusqueda.trim() !== "") {
                      setMostrarResultados(true);
                    }
                  }}
                />
                {textoBusqueda && (
                  <Button
                    variant="link"
                    className="border-0 text-secondary p-0"
                    onClick={limpiarBusqueda}
                    style={{ 
                      position: "absolute", 
                      right: "120px", 
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
                  className="rounded-end d-none d-sm-block"
                >
                  {loadingBusqueda ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    "Buscar"
                  )}
                </Button>

                {/* Botn icono en celu */}
                <Button
                  variant="primary"
                  type="submit"
                  disabled={loadingBusqueda}
                  className="rounded-end d-block d-sm-none"
                >
                  {loadingBusqueda ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    <Search size={18} />
                  )}
                </Button>
                
                {/* Filtros celu */}
                <Button
                  variant="outline-light"
                  className="ms-1 d-flex d-md-none align-items-center justify-content-center"
                  onClick={() => setShowFiltros(true)}
                  style={{ minWidth: "40px" }}
                >
                  <Filter size={18} />
                </Button>

                {/* Filtros pc */}
                <Button
                  variant="outline-light"
                  className="ms-2 d-none d-md-flex align-items-center"
                  onClick={() => setShowFiltros(true)}
                >
                  <Filter size={18} className="me-1" />
                  Filtros
                </Button>
              </div>
            </Form>

            {mostrarResultados && (
              <div className="search-results-dropdown shadow-lg">
                <div className="search-results-header d-flex justify-content-between align-items-center p-3 border-bottom">
                  <h6 className="mb-0">
                    {resultados.length} {resultados.length === 1 ? "resultado" : "resultados"}
                  </h6>
                  <Button variant="link" size="sm" onClick={limpiarBusqueda}>
                    Limpiar
                  </Button>
                </div>
                
                <div className="search-results-body" style={{ maxHeight: "400px", overflowY: "auto" }}>
                  {loadingBusqueda ? (
                    <div className="text-center py-4">
                      <Spinner animation="border" />
                      <p className="mt-2 text-muted">Buscando...</p>
                    </div>
                  ) : errorBusqueda ? (
                    <Alert variant="warning" className="m-3">
                      {errorBusqueda}
                    </Alert>
                  ) : resultados.length === 0 ? (
                    <div className="text-center py-4 text-muted">
                      <Search size={48} className="mb-2 opacity-50" />
                      <p>No se encontraron resultados</p>
                    </div>
                  ) : (
                    <div className="p-2">
                      {resultados.map((publicacion) => (
                        <div
                          key={publicacion.id}
                          className="search-result-item p-3 border-bottom hover-effect"
                          onClick={() => abrirPublicacion(publicacion.id)}
                        >
                          <div className="d-flex justify-content-between align-items-start">
                            <div className="flex-grow-1">
                              <h6 className="mb-1 text-truncate">{publicacion.titulo}</h6>
                              <small className="text-muted d-block">
                                {publicacion.categoria} • {publicacion.ubicacion}
                              </small>
                              <p className="mb-0 small text-truncate">
                                {publicacion.descripcionCorta || publicacion.descripcion?.substring(0, 100)}...
                              </p>
                            </div>
                            <div className="ms-3 text-end">
                              <span className="badge bg-primary fs-6">
                                ${publicacion.precio?.toLocaleString() || "-"}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {resultados.length > 0 && !loadingBusqueda && !errorBusqueda && (
                  <div className="search-results-footer p-3 border-top text-center">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => {
                        setMostrarResultados(false);
                      }}
                    >
                      Ver todos los resultados
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* DERECHA */}
          <Nav className="ms-auto align-items-center gap-2 mt-3 mt-lg-0 flex-row justify-content-center justify-content-lg-end d-none d-lg-flex">
            {estaLogueado && (
              <>
                <Nav.Link className="position-relative p-2" onClick={() => Navegar.notificaciones()}>
                  <Bell size={20} />
                </Nav.Link>

                <Nav.Link className="position-relative p-2">
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
                      onClick={() => setShowChats((prev) => !prev)}
                    />
                  )}

                  <NotificacionesBadge idUsuario={TokenService.getUid()} />
                </Nav.Link>
              </>
            )}

            {estaLogueado ? (
              <NavDropdown title="Mi Cuenta" align="end" id="dropdown-usuario-desktop">
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
                <NavDropdown.Item onClick={cerrarSesion} className="text-danger fw-semibold">
                  Cerrar sesión
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <Button 
                variant="outline-light" 
                className="ms-2"
                size="sm"
                onClick={() => Navegar.auth()}
              >
                Iniciar Sesión
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      {/* ConversacionesDropdown fuera del navbar */}
      {showChats && (
        <ConversacionesDropdown
          idUsuario={TokenService.getUid()!}
          onSeleccionar={(conv) => {
            setShowChats(false);
            abrirMiniChat(conv);
          }}
        />
      )}

      <FiltrosBusqueda
        show={showFiltros}
        onClose={() => setShowFiltros(false)}
        onApply={aplicarFiltros}
      />

      {chatActual && (
        <MiniChat
          visible={true}
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
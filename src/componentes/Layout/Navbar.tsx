import React, { useState, useEffect, useRef } from "react";
import { Navbar, Nav, Form, FormControl, Button, NavDropdown, Container, Row, Col, Card, Spinner, Alert } from "react-bootstrap";
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

const NavbarApp: React.FC = () => {
  const [showFiltros, setShowFiltros] = useState(false);
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [resultados, setResultados] = useState<any[]>([]);
  const [loadingBusqueda, setLoadingBusqueda] = useState(false);
  const [errorBusqueda, setErrorBusqueda] = useState<string | null>(null);
  const [mostrarResultados, setMostrarResultados] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

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

  // Cerrar resultados cuando haces clic afuera
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

        <Navbar.Toggle aria-controls="navbar-content" />
        <Navbar.Collapse id="navbar-content">
          <div ref={searchRef} className="position-relative flex-grow-1 mx-lg-3">
            <Form className="d-flex search-container" onSubmit={ejecutarBusqueda}>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <Search size={18} />
                </span>
                <FormControl
                  type="search"
                  placeholder="Buscar publicaciones (solo busca en el titulo por ahora)..."
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
                    className="border-0 text-secondary"
                    onClick={limpiarBusqueda}
                    style={{ position: "absolute", right: "60px", zIndex: 10 }}
                  >
                    <X size={16} />
                  </Button>
                )}
                <Button
                  variant="primary"
                  type="submit"
                  disabled={loadingBusqueda}
                  className="rounded-end"
                >
                  {loadingBusqueda ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    "Buscar"
                  )}
                </Button>
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

          <Nav className="ms-auto align-items-center">
            {estaLogueado && (
              <>
                <Nav.Link className="position-relative" onClick={() => Navegar.notificaciones()}>
                  <Bell size={20} />
                </Nav.Link>

                <Nav.Link className="position-relative" onClick={() => Navegar.chatCompleto()}>
                  <MessageCircle size={20} />
                  <NotificacionesBadge idUsuario={TokenService.getUserId()} />
                </Nav.Link>
              </>
            )}

            {estaLogueado ? (
              <NavDropdown title="Mi Cuenta" align="end" id="dropdown-usuario">
                <NavDropdown.Item onClick={() => Navegar.miPerfil()}>Perfil</NavDropdown.Item>
                <NavDropdown.Item onClick={() => Navegar.contactos()}>Contactos</NavDropdown.Item>
                <NavDropdown.Item onClick={() => Navegar.misPublicaciones()}>Mis publicaciones</NavDropdown.Item>
                <NavDropdown.Item onClick={() => Navegar.misFavoritos()}>Mis Favoritos</NavDropdown.Item>
                <NavDropdown.Divider />
                {hasRole(Rol.ADMIN) && (
                  <NavDropdown.Item onClick={() => Navegar.admin()}>Panel Admin</NavDropdown.Item>
                )}
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={cerrarSesion} className="text-danger fw-semibold">
                  Cerrar sesión
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <Button 
                variant="outline-light" 
                className="ms-3"
                onClick={() => Navegar.auth()}
              >
                Iniciar Sesión
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
    </>
  );
};

export default NavbarApp;
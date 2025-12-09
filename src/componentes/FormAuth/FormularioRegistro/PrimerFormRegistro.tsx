import React from "react";
import "../../../styles/FormularioLogin.css";

interface PrimerFormRegistroProps {
  nombreCompleto: string;
  correo: string;
  contraseña: string;
  mostrarPassword: boolean;
  setNombreCompleto: (value: string) => void;
  setCorreo: (value: string) => void;
  setContraseña: (value: string) => void;
  togglePassword: () => void;
  handleSubmit: (e: React.FormEvent) => void;
  onSwitch: () => void;
}

const PrimerFormRegistro: React.FC<PrimerFormRegistroProps> = ({
  nombreCompleto,
  correo,
  contraseña,
  mostrarPassword,
  setNombreCompleto,
  setCorreo,
  setContraseña,
  togglePassword,
  handleSubmit,
  onSwitch,
}) => {
  return (
    <div className="login-page">
      <form onSubmit={handleSubmit} className="form-container form-AZUL">
        <h2 style={{ marginBottom: "1rem", color: "#333" }}>Crear cuenta</h2>
        <p style={{ marginBottom: "2rem", color: "#666" }}>
          Comienza tu viaje con nosotros
        </p>

        {/* Nombre */}
          <div style={{ textAlign: "left" }}>
          <label style={{ textAlign: "left", display: "block", width: "100%" }}>Nombre completo*</label>
          <input
            type="text"
            placeholder="Ej: Juan Perez"
            value={nombreCompleto}
            onChange={(e) => setNombreCompleto(e.target.value)}
            required
            minLength={3}
          />
        </div>

        {/* Correo */}
        <div style={{ textAlign: "left" }}>
        <label style={{ textAlign: "left", display: "block", width: "100%" }}>Correo electrónico*</label>
          <input
            type="email"
            placeholder="valentinperrone@gmail.com"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />
        </div>

        {/* Contraseña */}
      <div style={{ textAlign: "left" }}>
      <label style={{ textAlign: "left", display: "block", width: "100%" }}>Contraseña*</label>
          <div className="password-wrapper">
            <input
              type={mostrarPassword ? "text" : "password"}
              placeholder="********"
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)}
              required
              minLength={8}
              pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$"
            />
            <button
              type="button"
              onClick={togglePassword}
              className="toggle-password"
            >
              {mostrarPassword ? "Ocultar" : "Ver"}
            </button>
          </div>
          <small style={{ color: "#666", fontSize: "12px", display: "block", marginTop: "-0.5rem", marginBottom: "1rem" }}>
            Mínimo 8 caracteres, incluyendo mayúsculas, minúsculas y un número
          </small>
        </div>

        <button 
          type="submit"
          style={{
            backgroundColor: "#007bff",
            color: "white",
            padding: "0.75rem 1.5rem",
            border: "none",
            borderRadius: "0.5rem",
            cursor: "pointer",
            fontSize: "1rem",
            fontWeight: "600",
            width: "100%",
            marginTop: "1rem",
            marginBottom: "1.5rem"
          }}
        >
          Siguiente
        </button>

        <div style={{ textAlign: "center", paddingTop: "1.5rem", borderTop: "1px solid #eee" }}>
          <span style={{ color: "#666" }}>¿Ya tienes cuenta? </span>
          <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); onSwitch(); }}
            style={{ color: "#007bff", textDecoration: "none", fontWeight: "600" }}
          >
            Inicia sesión
          </a>
        </div>
      </form>
    </div>
  );
};

export default PrimerFormRegistro;
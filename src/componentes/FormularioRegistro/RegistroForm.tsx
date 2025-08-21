import React from "react";

interface RegistroFormProps {
  nombreCompleto: string;
  correo: string;
  contraseña: string;
  mostrarPassword: boolean;
  setNombreCompleto: (value: string) => void;
  setCorreo: (value: string) => void;
  setContraseña: (value: string) => void;
  togglePassword: () => void;
  handleSubmit: (e: React.FormEvent) => void;


}

const RegistroForm: React.FC<RegistroFormProps> = ({
  nombreCompleto,
  correo,
  contraseña,
  mostrarPassword,
  setNombreCompleto,
  setCorreo,
  setContraseña,
  togglePassword,
  handleSubmit,

}) => {
  return (
    <form onSubmit={handleSubmit} >
      <h2 >Crear cuenta</h2>

      {/* Nombre */}
      <div >
        <label>Nombre completo</label>
        <input
          type="text"
          placeholder="Ej: Juan Pérez"
          value={nombreCompleto}
          onChange={(e) => setNombreCompleto(e.target.value)}
          required
        />
      </div>

      {/* Correo */}
      <div>
        <label>Correo electrónico</label>
        <input
          type="email"
          placeholder="Ej: usuario@email.com"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          required
        />
      </div>

      {/* Contraseña */}
      <div >
        <label>Contraseña</label>
        <div >
          <input
            type={mostrarPassword ? "text" : "password"}
            placeholder="********"
            value={contraseña}
            onChange={(e) => setContraseña(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={togglePassword}
          >
            {mostrarPassword ? "Ocultar" : "Ver"}
          </button>
        </div>
      </div>

      {/* Boton next a campos de menor priodidad*/}
      <button type="submit">
        Siguiente
      </button>

      <p>
        ¿Ya tienes cuenta? <a href="/login">Inicia sesión</a>
      </p>
    </form>
  );
};

export default RegistroForm;

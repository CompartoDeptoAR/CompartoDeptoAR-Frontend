import React from 'react';

interface AlertaExpiracionProps {
  visible: boolean;
  onRenovar?: () => void;
}

export const AlertaExpiracion: React.FC<AlertaExpiracionProps> = ({ visible, onRenovar }) => {
  if (!visible) return null;

  return (
    <div 
      className="alert alert-warning alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3" 
      role="alert"
      style={{ zIndex: 9999, maxWidth: '500px' }}
    >
      <strong>⚠️ Atención:</strong> Tu sesión está por expirar. Guarda tus cambios pronto.
      {onRenovar && (
        <button 
          type="button" 
          className="btn btn-sm btn-warning ms-2"
          onClick={onRenovar}
        >
          Renovar sesión
        </button>
      )}
    </div>
  );
};


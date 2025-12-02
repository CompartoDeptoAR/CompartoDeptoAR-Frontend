import { useNotificaciones } from "../../hooks/chat/useNotificaciones";

interface NotificacionesBadgeProps {
  onClick?: () => void;
}

export const NotificacionesBadge = ({ onClick }: NotificacionesBadgeProps) => {
  const { count } = useNotificaciones();
  const token = localStorage.getItem('token');

  if (!token) return null;

  return (
    <button
      className="btn btn-link position-relative p-2 text-decoration-none"
      onClick={onClick}
      type="button"
    >
      <i className="bi bi-chat-dots fs-5 text-dark"></i>
      {count > 0 && (
        <span 
          className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
          style={{ fontSize: "10px" }}
        >
          {count > 99 ? '99+' : count}
        </span>
      )}
    </button>
  );
};
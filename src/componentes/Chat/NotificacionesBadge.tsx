import { useNotificaciones } from "../../hooks/chat/useNotificaciones";

interface NotificacionesBadgeProps {
  idUsuario: string | null;
  onClick?: () => void;
}

export const NotificacionesBadge = ({ idUsuario, onClick }: NotificacionesBadgeProps) => {
  const { count } = useNotificaciones(idUsuario);

  if (!idUsuario) return null;

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
          style={{
            fontSize: "10px",
            minWidth: "18px",
            height: "18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {count > 99 ? "99+" : count}
        </span>
      )}
    </button>
  );
};
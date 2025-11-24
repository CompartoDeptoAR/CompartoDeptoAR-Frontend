import type { PublicacionResumida } from "../../../modelos/Publicacion";
import { Navegar } from "../../../navigation/navigationService";


interface UseListarPublicacionesProps {
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onToggleFavorite?: (id: string) => void;
  favoriteIds?: string[];
}

export const useListarPublicaciones = ({
  onEdit,
  onDelete,
  onToggleFavorite,
  favoriteIds = [],
}: UseListarPublicacionesProps = {}) => {
  
  const handleVerDetalle = (id: string) => {
    Navegar.verPublicacion(id);
  };

  const handleEdit = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (onEdit) onEdit(id);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (onDelete) onDelete(id);
  };

  const handleToggleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (onToggleFavorite) onToggleFavorite(id);
  };

  const isFavorite = (id: string) => favoriteIds.includes(id);

  const obtenerPrimeraFoto = (pub: PublicacionResumida): string => {
    return Array.isArray(pub.foto) && pub.foto.length > 0
      ? pub.foto[0]
      : "https://via.placeholder.com/400x300?text=Sin+Imagen";
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = "https://via.placeholder.com/400x300?text=Sin+Imagen";
  };

  return {
    handleVerDetalle,
    handleEdit,
    handleDelete,
    handleToggleFavorite,
    isFavorite,
    obtenerPrimeraFoto,
    handleImageError,
  };
};
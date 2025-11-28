import type { PublicacionResumida } from "../../../modelos/Publicacion";
import { Navegar } from "../../../navigation/navigationService";
import noimage from "../../../assets/noimage.png"

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

  const handleEdit = ( id: string) => {
    onEdit?.(id);
  };

  const handleDelete = ( id: string) => {
    onDelete?.(id);
  };

  const handleToggleFavorite = ( id: string) => {
    onToggleFavorite?.(id);
  };

  const isFavorite = (id: string) => favoriteIds.includes(id);

  const obtenerPrimeraFoto = (pub: PublicacionResumida): string => {
    return pub.foto && pub.foto.trim() !== ""
      ? pub.foto
      : noimage;
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = noimage;
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

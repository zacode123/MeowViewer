import { useState, useEffect } from 'react';
import { CatImage } from '@shared/schema';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FavoritesSectionProps {
  catImage?: CatImage;
  isFavorite: boolean;
}

const FavoritesSection = ({ catImage, isFavorite }: FavoritesSectionProps) => {
  const [favorites, setFavorites] = useState<CatImage[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  // Load favorites from localStorage on component mount
  useEffect(() => {
    const storedFavorites = localStorage.getItem('meowviewer-favorites');
    if (storedFavorites) {
      try {
        setFavorites(JSON.parse(storedFavorites));
      } catch (error) {
        console.error('Error parsing favorites from localStorage:', error);
        localStorage.removeItem('meowviewer-favorites');
      }
    }
  }, []);

  // Update favorites when a new cat is added/removed
  useEffect(() => {
    if (!catImage) return;

    if (isFavorite) {
      // Add to favorites if not already present
      if (!favorites.some(fav => fav.id === catImage.id)) {
        const updatedFavorites = [...favorites, catImage];
        setFavorites(updatedFavorites);
        localStorage.setItem('meowviewer-favorites', JSON.stringify(updatedFavorites));
      }
    } else {
      // Remove from favorites if present
      const catInFavorites = favorites.find(fav => fav.id === catImage.id);
      if (catInFavorites) {
        const updatedFavorites = favorites.filter(fav => fav.id !== catImage.id);
        setFavorites(updatedFavorites);
        localStorage.setItem('meowviewer-favorites', JSON.stringify(updatedFavorites));
      }
    }
  }, [isFavorite, catImage]);

  const removeFavorite = (id: string) => {
    const updatedFavorites = favorites.filter(fav => fav.id !== id);
    setFavorites(updatedFavorites);
    localStorage.setItem('meowviewer-favorites', JSON.stringify(updatedFavorites));
  };

  if (favorites.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 bg-white rounded-[12px] shadow p-4">
      <div 
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h2 className="text-xl font-bold text-secondary">
          Favorite Cats ({favorites.length})
        </h2>
        <button className="text-secondary hover:text-primary">
          {isExpanded ? 'Hide' : 'Show'}
        </button>
      </div>

      {isExpanded && (
        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {favorites.map(favorite => (
            <div key={favorite.id} className="relative group">
              <img 
                src={favorite.url} 
                alt="Favorite cat" 
                className="w-full h-32 object-cover rounded-[8px]"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFavorite(favorite.id);
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesSection;
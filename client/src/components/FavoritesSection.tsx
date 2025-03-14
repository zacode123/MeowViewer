import { useState, useEffect, useRef } from 'react';
import { CatImage } from '@shared/schema';
import { X, Heart, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BsWhatsapp, BsFacebook, BsTwitterX, BsLink45Deg } from "react-icons/bs";
import { useToast } from '@/hooks/use-toast';

interface FavoritesSectionProps {
  catImage?: CatImage;
  isFavorite: boolean;
}

const FavoritesSection = ({ catImage, isFavorite }: FavoritesSectionProps) => {
  const [favorites, setFavorites] = useState<CatImage[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [shareMenuOpen, setShareMenuOpen] = useState<string | null>(null);
  const shareMenuRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

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

    // Always fetch the latest from localStorage first
    const storedFavorites = localStorage.getItem('meowviewer-favorites');
    let currentFavorites: CatImage[] = [];
    
    if (storedFavorites) {
      try {
        currentFavorites = JSON.parse(storedFavorites);
      } catch (error) {
        console.error('Error parsing favorites from localStorage:', error);
      }
    }

    if (isFavorite) {
      // Add to favorites if not already present
      if (!currentFavorites.some(fav => fav.id === catImage.id)) {
        const updatedFavorites = [...currentFavorites, catImage];
        setFavorites(updatedFavorites);
        localStorage.setItem('meowviewer-favorites', JSON.stringify(updatedFavorites));
      }
    }
    // We're not going to remove items when isFavorite is false - that will be handled by ControlsContainer
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
        <h2 className="text-xl font-bold text-[#FF4081] flex items-center">
          <Heart className="mr-2 h-5 w-5 fill-[#FF4081] text-[#FF4081]" /> 
          Favorite Cats ({favorites.length})
        </h2>
        <button className="text-[#FF4081] hover:text-[#FF4081]/80 font-medium">
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
                className="w-full h-32 object-cover rounded-[8px] border border-gray-100"
              />
              <Button
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 bg-[#FF4081] hover:bg-[#FF4081]/90 text-white rounded-full p-1"
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
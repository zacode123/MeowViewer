import { useState, useEffect, useRef } from 'react';
import { CatImage } from '@shared/schema';
import { X, Heart, Share2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BsWhatsapp, BsFacebook, BsTwitterX, BsLink45Deg } from "react-icons/bs";
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
              <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="icon"
                  className="h-6 w-6 bg-[#FF4081] hover:bg-[#FF4081]/90 text-white rounded-full p-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFavorite(favorite.id);
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
                <Button
                  size="icon"
                  className="h-6 w-6 bg-[#FF4081] hover:bg-[#FF4081]/90 text-white rounded-full p-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShareMenuOpen(shareMenuOpen === favorite.id ? null : favorite.id);
                  }}
                >
                  <Share2 className="h-3 w-3" />
                </Button>
                {shareMenuOpen === favorite.id && (
                  <div 
                    ref={shareMenuRef}
                    className="absolute top-8 right-0 z-50 bg-white rounded-lg shadow-lg p-3 w-52 border border-gray-200"
                  >
                    <div className="flex justify-between items-center mb-2 pb-2 border-b border-gray-100">
                      <h4 className="font-medium text-[#FF4081]">Share via</h4>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7 text-[#FF4081] hover:text-[#FF4081]/80 hover:bg-pink-50" 
                        onClick={(e) => {
                          e.stopPropagation();
                          setShareMenuOpen(null);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start text-green-600 hover:text-green-700 hover:bg-green-50" 
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(`https://api.whatsapp.com/send?text=Check out this cute cat! ${favorite.url}`, '_blank');
                        }}
                      >
                        <BsWhatsapp className="mr-2 h-5 w-5" /> WhatsApp
                      </Button>
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start text-blue-600 hover:text-blue-700 hover:bg-blue-50" 
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(`https://www.facebook.com/sharer/sharer.php?u=${favorite.url}`, '_blank');
                        }}
                      >
                        <BsFacebook className="mr-2 h-5 w-5" /> Facebook
                      </Button>
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start text-black hover:bg-gray-100" 
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(`https://twitter.com/intent/tweet?url=${favorite.url}&text=Check out this cute cat!`, '_blank');
                        }}
                      >
                        <BsTwitterX className="mr-2 h-5 w-5" /> Twitter
                      </Button>
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start text-[#FF4081] hover:text-[#FF4081]/80 hover:bg-pink-50" 
                        onClick={(e) => {
                          e.stopPropagation();
                          navigator.clipboard.writeText(favorite.url);
                          toast({
                            title: "Copied to clipboard!",
                            description: "The cat image URL has been copied to your clipboard.",
                          });
                        }}
                      >
                        <BsLink45Deg className="mr-2 h-5 w-5" /> Copy Link
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesSection;
import { useState, useEffect, useRef, createContext, useContext } from 'react';
import { CatImage } from '@shared/schema';
import { X, Heart, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BsWhatsapp, BsFacebook, BsTwitterX, BsLink45Deg } from "react-icons/bs";
import { useToast } from '@/hooks/use-toast';

// Create a context for favorites management
export const FavoritesContext = createContext<{
  favorites: CatImage[];
  addFavorite: (cat: CatImage) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
}>({
  favorites: [],
  addFavorite: () => {},
  removeFavorite: () => {},
  isFavorite: () => false,
});

// Export the hook for using favorites context
export const useFavorites = () => useContext(FavoritesContext);

export const FavoritesProvider = ({ children }: { children: React.ReactNode }) => {
  const [favorites, setFavorites] = useState<CatImage[]>([]);
  const { toast } = useToast();

  // Load favorites from localStorage on mount
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

  const addFavorite = (cat: CatImage) => {
    if (!favorites.some(fav => fav.id === cat.id)) {
      const newFavorites = [...favorites, cat];
      setFavorites(newFavorites);
      localStorage.setItem('meowviewer-favorites', JSON.stringify(newFavorites));
      toast({
        title: "Added to favorites",
        description: "The cat image has been added to your favorites!",
      });
    }
  };

  const removeFavorite = (id: string) => {
    const newFavorites = favorites.filter(fav => fav.id !== id);
    setFavorites(newFavorites);
    localStorage.setItem('meowviewer-favorites', JSON.stringify(newFavorites));
    toast({
      title: "Removed from favorites",
      description: "The cat image has been removed from your favorites.",
    });
  };

  const isFavorite = (id: string) => favorites.some(fav => fav.id === id);

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
      {children}
      <FavoritesSectionDisplay />
    </FavoritesContext.Provider>
  );
};

// Helper function to fetch and prepare image for sharing
const prepareImageForSharing = async (imageUrl: string): Promise<{file?: File, blob?: Blob}> => {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const file = new File([blob], 'cat.jpg', { type: 'image/jpeg' });
    return { file, blob };
  } catch (error) {
    console.error('Error preparing image:', error);
    throw new Error('Failed to prepare image for sharing');
  }
};

// Helper function to share using the Web Share API
const shareWithNativeAPI = async (shareData: { title: string; text: string; file: File }) => {
  if (navigator.share && navigator.canShare({ files: [shareData.file] })) {
    try {
      await navigator.share({
        title: shareData.title,
        text: shareData.text,
        files: [shareData.file],
      });
      return true;
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        throw error;
      }
      return false;
    }
  }
  return false;
};

const FavoritesSectionDisplay = () => {
  const { favorites, removeFavorite } = useFavorites();
  const [isExpanded, setIsExpanded] = useState(false);
  const [shareMenuOpen, setShareMenuOpen] = useState<string | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  const shareMenuRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (shareMenuRef.current && !shareMenuRef.current.contains(event.target as Node)) {
        setShareMenuOpen(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleShare = async (favorite: CatImage, platform: 'whatsapp' | 'facebook' | 'twitter' | 'copy') => {
    setIsSharing(true);
    const shareData = {
      title: 'Check out this cute cat!',
      text: 'Found this adorable cat on MeowViewer!',
    };

    try {
      const { file, blob } = await prepareImageForSharing(favorite.url);

      if (!file || !blob) {
        throw new Error('Failed to prepare image');
      }

      // Try native sharing first
      if (platform !== 'copy') {
        const shared = await shareWithNativeAPI({ ...shareData, file });
        if (shared) {
          setShareMenuOpen(null);
          setIsSharing(false);
          return;
        }
      }

      // Platform-specific sharing as fallback
      switch (platform) {
        case 'whatsapp': {
          // Create a temporary URL for the blob
          const blobUrl = URL.createObjectURL(blob);
          window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareData.text}`)}&image=${encodeURIComponent(blobUrl)}`, '_blank');
          // Clean up the URL after a delay
          setTimeout(() => URL.revokeObjectURL(blobUrl), 5000);
          break;
        }
        case 'facebook': {
          const blobUrl = URL.createObjectURL(blob);
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(blobUrl)}`, '_blank');
          setTimeout(() => URL.revokeObjectURL(blobUrl), 5000);
          break;
        }
        case 'twitter': {
          const blobUrl = URL.createObjectURL(blob);
          window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareData.text)}&url=${encodeURIComponent(blobUrl)}`, '_blank');
          setTimeout(() => URL.revokeObjectURL(blobUrl), 5000);
          break;
        }
        case 'copy': {
          try {
            // Try to copy the image to clipboard
            await navigator.clipboard.write([
              new ClipboardItem({
                [blob.type]: blob
              })
            ]);
            toast({
              title: "Copied to clipboard!",
              description: "The cat image has been copied to your clipboard.",
            });
          } catch (clipboardError) {
            // Fall back to copying URL if image copy fails
            await navigator.clipboard.writeText(favorite.url);
            toast({
              title: "Copied to clipboard!",
              description: "The cat image URL has been copied to your clipboard (image copying not supported in this browser).",
            });
          }
          break;
        }
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast({
        title: "Error sharing",
        description: "Failed to share the image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSharing(false);
      setShareMenuOpen(null);
    }
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
                  disabled={isSharing}
                >
                  <Share2 className="h-3 w-3" />
                </Button>
              </div>
              {shareMenuOpen === favorite.id && (
                <div 
                  ref={shareMenuRef}
                  className="absolute top-8 left-0 z-50 bg-white rounded-lg shadow-lg p-3 w-52 border border-gray-200"
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
                        handleShare(favorite, 'whatsapp');
                      }}
                      disabled={isSharing}
                    >
                      <BsWhatsapp className="mr-2 h-5 w-5" /> WhatsApp
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-blue-600 hover:text-blue-700 hover:bg-blue-50" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShare(favorite, 'facebook');
                      }}
                      disabled={isSharing}
                    >
                      <BsFacebook className="mr-2 h-5 w-5" /> Facebook
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-black hover:bg-gray-100" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShare(favorite, 'twitter');
                      }}
                      disabled={isSharing}
                    >
                      <BsTwitterX className="mr-2 h-5 w-5" /> Twitter
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-[#FF4081] hover:text-[#FF4081]/80 hover:bg-pink-50" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShare(favorite, 'copy');
                      }}
                      disabled={isSharing}
                    >
                      <BsLink45Deg className="mr-2 h-5 w-5" /> Copy Link
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesSectionDisplay;
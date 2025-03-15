import { useState, useEffect, useRef, createContext, useContext } from 'react';
import { CatImage } from '@shared/schema';
import { X, Heart, Share2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BsWhatsapp, BsFacebook, BsTwitterX, BsLink45Deg } from "react-icons/bs";
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
    const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(imageUrl)}`;
    const response = await fetch(proxyUrl);
    const blob = await response.blob();
    const file = new File([blob], 'cat.jpg', { type: 'image/jpeg' });
    return { file, blob };
  } catch (error) {
    console.error('Error preparing image:', error);
    throw new Error('Failed to prepare image for sharing');
  }
};

// Helper function to share using the Web Share API
const shareWithNativeAPI = async (shareData: { title: string; text: string; url: string; file: File }) => {
  if (navigator.share && navigator.canShare({ files: [shareData.file] })) {
    try {
      await navigator.share({
        title: shareData.title,
        text: shareData.text,
        url: shareData.url,
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

const SharePreviewDialog = ({ 
  isOpen, 
  onClose, 
  favorite,
  onShare,
  isSharing
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  favorite: CatImage;
  onShare: (platform: 'whatsapp' | 'facebook' | 'twitter' | 'copy') => void;
  isSharing: boolean;
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Share this adorable cat</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="relative aspect-square w-full overflow-hidden rounded-lg">
            <img 
              src={favorite.url} 
              alt="Cat to share" 
              className="object-cover w-full h-full"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              className="w-full justify-start text-green-600 hover:text-green-700 hover:bg-green-50"
              onClick={() => onShare('whatsapp')}
              disabled={isSharing}
            >
              <BsWhatsapp className="mr-2 h-5 w-5" /> Share to WhatsApp
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              onClick={() => onShare('facebook')}
              disabled={isSharing}
            >
              <BsFacebook className="mr-2 h-5 w-5" /> Share to Facebook
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start text-black hover:bg-gray-100"
              onClick={() => onShare('twitter')}
              disabled={isSharing}
            >
              <BsTwitterX className="mr-2 h-5 w-5" /> Share to Twitter
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start text-[#FF4081] hover:text-[#FF4081]/80 hover:bg-pink-50"
              onClick={() => onShare('copy')}
              disabled={isSharing}
            >
              <BsLink45Deg className="mr-2 h-5 w-5" /> Copy to Clipboard
            </Button>
          </div>
          {isSharing && (
            <div className="flex items-center justify-center text-sm text-gray-500">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Preparing to share...
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const FavoritesSectionDisplay = () => {
  const { favorites, removeFavorite } = useFavorites();
  const [isExpanded, setIsExpanded] = useState(false);
  const [sharePreviewOpen, setSharePreviewOpen] = useState(false);
  const [selectedFavorite, setSelectedFavorite] = useState<CatImage | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  const { toast } = useToast();

  const handleShare = async (favorite: CatImage, platform: 'whatsapp' | 'facebook' | 'twitter' | 'copy') => {
    setIsSharing(true);
    const shareData = {
      title: 'Check out this adorable cat!',
      text: 'Check out this adorable cat I found on MeowViewer! 🐱',
      url: favorite.url
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
          setSharePreviewOpen(false);
          setIsSharing(false);
          return;
        }
      }

      // Create a temporary blob URL for sharing
      const blobUrl = URL.createObjectURL(blob);

      // Platform-specific sharing as fallback
      switch (platform) {
        case 'whatsapp': {
          const whatsappText = `${shareData.text}\n${blobUrl}`;
          window.open(`https://wa.me/?text=${encodeURIComponent(whatsappText)}`, '_blank');
          break;
        }
        case 'facebook': {
          // Facebook requires an actual URL, can't directly share blob
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareData.url)}&quote=${encodeURIComponent(shareData.text)}`, '_blank');
          break;
        }
        case 'twitter': {
          const twitterText = `${shareData.text}\n${blobUrl}`;
          window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterText)}`, '_blank');
          break;
        }
        case 'copy': {
          try {
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
            await navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
            toast({
              title: "Copied to clipboard!",
              description: "The cat image URL has been copied to your clipboard (image copying not supported in this browser).",
            });
          }
          break;
        }
      }

      // Clean up the blob URL after a delay
      setTimeout(() => URL.revokeObjectURL(blobUrl), 5000);
    } catch (error) {
      console.error('Error sharing:', error);
      toast({
        title: "Error sharing",
        description: "Failed to share the image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSharing(false);
      setSharePreviewOpen(false);
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
                    setSelectedFavorite(favorite);
                    setSharePreviewOpen(true);
                  }}
                  disabled={isSharing}
                >
                  {isSharing ? <Loader2 className="h-3 w-3 animate-spin" /> : <Share2 className="h-3 w-3" />}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedFavorite && (
        <SharePreviewDialog
          isOpen={sharePreviewOpen}
          onClose={() => {
            setSharePreviewOpen(false);
            setSelectedFavorite(null);
          }}
          favorite={selectedFavorite}
          onShare={(platform) => handleShare(selectedFavorite, platform)}
          isSharing={isSharing}
        />
      )}
    </div>
  );
};

export default FavoritesSectionDisplay;
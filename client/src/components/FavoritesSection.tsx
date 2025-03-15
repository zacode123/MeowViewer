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
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && favorite) {
      setIsImageLoading(true);
      const loadImage = async () => {
        try {
          // Use our proxy to avoid CORS issues
          const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(favorite.url)}`;
          const response = await fetch(proxyUrl);
          const blob = await response.blob();
          const objectUrl = URL.createObjectURL(blob);
          setPreviewImage(objectUrl);
          setIsImageLoading(false);
        } catch (error) {
          console.error('Error loading preview image:', error);
          setIsImageLoading(false);
        }
      };
      loadImage();
    } else {
      // Cleanup when dialog closes
      if (previewImage) {
        URL.revokeObjectURL(previewImage);
      }
      setPreviewImage(null);
    }
  }, [isOpen, favorite]);

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden bg-white rounded-xl">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-xl font-bold text-[#FF4081]">Share this adorable cat</DialogTitle>
        </DialogHeader>
        <div className="p-6">
          <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100 mb-6">
            {isImageLoading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-[#FF4081]" />
              </div>
            ) : previewImage ? (
              <img 
                src={previewImage}
                alt="Cat to share" 
                className="object-cover w-full h-full transition-opacity duration-200"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                Failed to load preview
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="w-full justify-start text-green-600 hover:text-green-700 hover:bg-green-50 p-4"
              onClick={() => onShare('whatsapp')}
              disabled={isSharing || isImageLoading}
            >
              <BsWhatsapp className="mr-2 h-5 w-5" /> 
              <div className="flex flex-col items-start">
                <span className="font-semibold">WhatsApp</span>
                <span className="text-xs text-gray-500">Share via WhatsApp</span>
              </div>
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-4"
              onClick={() => onShare('facebook')}
              disabled={isSharing || isImageLoading}
            >
              <BsFacebook className="mr-2 h-5 w-5" /> 
              <div className="flex flex-col items-start">
                <span className="font-semibold">Facebook</span>
                <span className="text-xs text-gray-500">Share on Facebook</span>
              </div>
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start text-black hover:bg-gray-100 p-4"
              onClick={() => onShare('twitter')}
              disabled={isSharing || isImageLoading}
            >
              <BsTwitterX className="mr-2 h-5 w-5" /> 
              <div className="flex flex-col items-start">
                <span className="font-semibold">Twitter</span>
                <span className="text-xs text-gray-500">Share on Twitter</span>
              </div>
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start text-[#FF4081] hover:text-[#FF4081]/80 hover:bg-pink-50 p-4"
              onClick={() => onShare('copy')}
              disabled={isSharing || isImageLoading}
            >
              <BsLink45Deg className="mr-2 h-5 w-5" /> 
              <div className="flex flex-col items-start">
                <span className="font-semibold">Copy</span>
                <span className="text-xs text-gray-500">Copy to clipboard</span>
              </div>
            </Button>
          </div>
          {isSharing && (
            <div className="mt-4 flex items-center justify-center text-sm text-gray-500">
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
    };

    try {
      const { file, blob } = await prepareImageForSharing(favorite.url);

      if (!file || !blob) {
        throw new Error('Failed to prepare image');
      }

      // Try native sharing first if not copying
      if (platform !== 'copy' && navigator.share && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            title: shareData.title,
            text: shareData.text,
            files: [file],
          });
          setSharePreviewOpen(false);
          setIsSharing(false);
          return;
        } catch (error) {
          if (error instanceof Error && error.name !== 'AbortError') {
            throw error;
          }
        }
      }

      // Platform-specific sharing as fallback
      switch (platform) {
        case 'whatsapp':
          const whatsappFormData = new FormData();
          whatsappFormData.append('text', shareData.text);
          whatsappFormData.append('image', file);
          // Note: WhatsApp Web API doesn't directly support file uploads
          // We'll use the URL as fallback
          window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareData.text}\n${favorite.url}`)}`, '_blank');
          break;
        case 'facebook':
          // Facebook requires a server-side implementation to handle file uploads
          // Fallback to URL sharing
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(favorite.url)}&quote=${encodeURIComponent(shareData.text)}`, '_blank');
          break;
        case 'twitter':
          // Twitter API v2 requires authentication
          // Fallback to URL sharing
          window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`${shareData.text}\n${favorite.url}`)}`, '_blank');
          break;
        case 'copy':
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
            await navigator.clipboard.writeText(`${shareData.text}\n${favorite.url}`);
            toast({
              title: "Copied to clipboard!",
              description: "The cat image URL has been copied to your clipboard (image copying not supported in this browser).",
            });
          }
          break;
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
import { useState, useRef, useEffect } from "react";
import { RefreshCw, Share2, Heart, Loader2, X } from "lucide-react";
import { BsWhatsapp, BsFacebook, BsTwitterX, BsLink45Deg } from "react-icons/bs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CatImage } from "@shared/schema";

interface ControlsContainerProps {
  onNewCat: () => void;
  isLoading: boolean;
  catImage?: CatImage;
  onFavoriteChange?: (isFavorite: boolean) => void;
}

const ControlsContainer = ({ onNewCat, isLoading, catImage, onFavoriteChange }: ControlsContainerProps) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);
  const shareMenuRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Sync isFavorite with parent component when it changes
  useEffect(() => {
    if (!catImage) return;
    if (onFavoriteChange) {
      // Check if current image is already in favorites
      const storedFavorites = localStorage.getItem('meowviewer-favorites');
      if (storedFavorites) {
        try {
          const favorites = JSON.parse(storedFavorites) as CatImage[];
          const isInFavorites = favorites.some(fav => fav.id === catImage.id);
          setIsFavorite(isInFavorites);
        } catch (error) {
          console.error('Error parsing favorites from localStorage:', error);
        }
      } else {
        setIsFavorite(false);
      }
    }
  }, [catImage, onFavoriteChange]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (shareMenuRef.current && !shareMenuRef.current.contains(event.target as Node)) {
        setIsShareMenuOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleCopyToClipboard = () => {
    if (!catImage) return;
    
    navigator.clipboard.writeText(catImage.url)
      .then(() => {
        toast({
          title: "Copied to clipboard!",
          description: "The cat image URL has been copied to your clipboard.",
        });
        setIsShareMenuOpen(false);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
        toast({
          title: "Failed to copy",
          description: "Could not copy URL to clipboard.",
          variant: "destructive",
        });
      });
  };

  const toggleFavorite = () => {
    if (!catImage) {
      toast({
        title: "No image to favorite",
        description: "Please wait for an image to load before adding to favorites.",
        variant: "destructive",
      });
      return;
    }
    
    const newFavoriteState = !isFavorite;
    setIsFavorite(newFavoriteState);

    // Update local storage
    try {
      const storedFavorites = localStorage.getItem('meowviewer-favorites');
      let favorites: CatImage[] = [];
      
      if (storedFavorites) {
        favorites = JSON.parse(storedFavorites);
      }

      if (newFavoriteState) {
        // Add to favorites if not already present
        if (!favorites.some(fav => fav.id === catImage.id)) {
          favorites.push(catImage);
        }
      } else {
        // Remove from favorites
        favorites = favorites.filter(fav => fav.id !== catImage.id);
      }

      localStorage.setItem('meowviewer-favorites', JSON.stringify(favorites));
    } catch (error) {
      console.error('Error updating favorites in localStorage:', error);
    }
    
    // Call the callback function if provided
    if (onFavoriteChange) {
      onFavoriteChange(newFavoriteState);
    }
    
    toast({
      title: isFavorite ? "Removed from favorites" : "Added to favorites",
      description: isFavorite 
        ? "The cat image has been removed from your favorites." 
        : "The cat image has been added to your favorites!",
    });
  };

  const shareViaWhatsapp = () => {
    if (!catImage) return;
    
    const text = "Check out this adorable cat from MeowViewer!";
    const url = catImage.url;
    window.open(`https://wa.me/?text=${encodeURIComponent(text + " " + url)}`, "_blank");
    setIsShareMenuOpen(false);
  };

  const shareViaFacebook = () => {
    if (!catImage) return;
    
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(catImage.url)}`, "_blank");
    setIsShareMenuOpen(false);
  };

  const shareViaTwitter = () => {
    if (!catImage) return;
    
    const text = "Check out this adorable cat from MeowViewer!";
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(catImage.url)}`, "_blank");
    setIsShareMenuOpen(false);
  };

  const toggleShareMenu = () => {
    if (!catImage) {
      toast({
        title: "No image to share",
        description: "Please wait for an image to load before sharing.",
        variant: "destructive",
      });
      return;
    }
    
    setIsShareMenuOpen(!isShareMenuOpen);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
      <Button
        onClick={onNewCat}
        disabled={isLoading}
        className="bg-[#FF4081] hover:bg-[#FF4081]/90 text-white font-nunito font-bold py-3 px-6 rounded-[12px] shadow transition duration-200 flex items-center justify-center min-w-[180px]"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading...
          </>
        ) : (
          <> New Cat, Please! </>
        )}
      </Button>

      <div className="flex gap-4 relative">
        <Button 
          variant="outline" 
          size="icon" 
          className="bg-[#FF4081] hover:bg-[#FF4081]/90 text-white p-3 rounded-full shadow transition duration-200"
          aria-label="Share cat image"
          onClick={toggleShareMenu}
          disabled={isLoading || !catImage}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
            <path d="M17.5,7L17,7.5L14,6.75L14,3.5L14.5,3L17.5,5L22,3.5L22,7.25L17.5,7M13.26,21.18L8.26,11.54L6.25,14.53L5.75,14.29L6.87,9.33L11.87,18.97L13.89,16L14.38,16.24L13.26,21.18M21.5,21L16.5,11.37L14.5,14.36L14,14.12L15.12,9.16L20.13,18.8L22.13,15.83L22.62,16.07L21.5,21M2.62,13.62C2.62,11.59 4.09,9.37 6.12,9.37C8.15,9.37 10.37,11.59 10.37,13.62C10.37,15.66 8.15,17.88 6.12,17.88C4.09,17.88 2.62,15.66 2.62,13.62Z"
            fill="white"/>
          </svg>
        </Button>

        {isShareMenuOpen && (
          <div 
            ref={shareMenuRef}
            className="absolute top-12 right-0 z-50 bg-white rounded-lg shadow-lg p-3 w-52 border border-gray-200"
          >
            <div className="flex justify-between items-center mb-2 pb-2 border-b border-gray-100">
              <h4 className="font-medium text-[#FF4081]">Share via</h4>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7 text-[#FF4081] hover:text-[#FF4081]/80 hover:bg-pink-50" 
                onClick={() => setIsShareMenuOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2">
              <Button 
                variant="ghost" 
                className="w-full justify-start text-green-600 hover:text-green-700 hover:bg-green-50" 
                onClick={shareViaWhatsapp}
              >
                <BsWhatsapp className="mr-2 h-5 w-5" /> WhatsApp
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start text-blue-600 hover:text-blue-700 hover:bg-blue-50" 
                onClick={shareViaFacebook}
              >
                <BsFacebook className="mr-2 h-5 w-5" /> Facebook
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start text-black hover:bg-gray-100" 
                onClick={shareViaTwitter}
              >
                <BsTwitterX className="mr-2 h-5 w-5" /> Twitter
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start text-[#FF4081] hover:text-[#FF4081]/80 hover:bg-pink-50" 
                onClick={handleCopyToClipboard}
              >
                <BsLink45Deg className="mr-2 h-5 w-5" /> Copy Link
              </Button>
            </div>
          </div>
        )}

        <Button 
          variant="outline" 
          size="icon" 
          className={`
            bg-[#FF4081] hover:bg-[#FF4081]/90 text-white 
            p-3 rounded-full shadow transition duration-200
          `}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          onClick={toggleFavorite}
          disabled={isLoading || !catImage}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
            <path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z" 
            fill={isFavorite ? "white" : "none"} 
            stroke="white" 
            strokeWidth={isFavorite ? "0" : "2"} />
          </svg>
        </Button>
      </div>
    </div>
  );
};

export default ControlsContainer;

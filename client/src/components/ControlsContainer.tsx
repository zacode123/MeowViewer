import { useState } from "react";
import { RefreshCw, Share2, Heart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CatImage } from "@shared/schema";

interface ControlsContainerProps {
  onNewCat: () => void;
  isLoading: boolean;
  catImage?: CatImage;
}

const ControlsContainer = ({ onNewCat, isLoading, catImage }: ControlsContainerProps) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const { toast } = useToast();

  const handleShare = () => {
    if (!catImage) {
      toast({
        title: "No image to share",
        description: "Please wait for an image to load before sharing.",
        variant: "destructive",
      });
      return;
    }

    // If Web Share API is available, use it
    if (navigator.share) {
      navigator.share({
        title: "Check out this cat from MeowViewer!",
        text: "I found this adorable cat on MeowViewer!",
        url: catImage.url,
      })
        .then(() => {
          toast({
            title: "Shared successfully!",
            description: "The cat image has been shared.",
          });
        })
        .catch((error) => {
          console.error("Error sharing:", error);
          // Fallback to clipboard if sharing fails
          handleCopyToClipboard();
        });
    } else {
      // Fallback for browsers that don't support Web Share API
      handleCopyToClipboard();
    }
  };

  const handleCopyToClipboard = () => {
    if (!catImage) return;
    
    navigator.clipboard.writeText(catImage.url)
      .then(() => {
        toast({
          title: "Copied to clipboard!",
          description: "The cat image URL has been copied to your clipboard.",
        });
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
    
    setIsFavorite(!isFavorite);
    
    toast({
      title: isFavorite ? "Removed from favorites" : "Added to favorites",
      description: isFavorite 
        ? "The cat image has been removed from your favorites." 
        : "The cat image has been added to your favorites!",
    });
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
      <Button
        onClick={onNewCat}
        disabled={isLoading}
        className="bg-primary hover:bg-opacity-90 text-white font-nunito font-bold py-3 px-6 rounded-[12px] shadow transition duration-200 flex items-center justify-center min-w-[180px]"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading...
          </>
        ) : (
          <>
            <RefreshCw className="mr-2 h-4 w-4" /> New Cat, Please!
          </>
        )}
      </Button>

      <div className="flex gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          className="bg-accent hover:bg-opacity-80 text-secondary p-3 rounded-full shadow transition duration-200"
          aria-label="Share cat image"
          onClick={handleShare}
          disabled={isLoading || !catImage}
        >
          <Share2 className="h-4 w-4" />
        </Button>

        <Button 
          variant="ghost" 
          size="icon" 
          className={`${
            isFavorite 
              ? "bg-primary text-white" 
              : "bg-accent text-secondary"
          } hover:bg-opacity-80 p-3 rounded-full shadow transition duration-200`}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          onClick={toggleFavorite}
          disabled={isLoading || !catImage}
        >
          <Heart className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ControlsContainer;

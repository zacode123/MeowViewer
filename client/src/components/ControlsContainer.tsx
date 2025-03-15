import { useState, useRef, useEffect } from "react";
import { Share2, Loader2, X } from "lucide-react";
import { BsWhatsapp, BsFacebook, BsTwitterX, BsLink45Deg } from "react-icons/bs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CatImage } from "@shared/schema";
import { useFavorites } from "./FavoritesSection";

interface ControlsContainerProps {
  onNewCat: () => void;
  isLoading: boolean;
  catImage?: CatImage;
}

const ControlsContainer = ({ onNewCat, isLoading, catImage }: ControlsContainerProps) => {
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);
  const shareMenuRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();

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

  const handleShare = async (type: 'native' | 'copy' | 'download') => {
    if (!catImage) return;

    if (type === 'download') {
      const downloadUrl = `/api/proxy-image?url=${encodeURIComponent(catImage.url)}&download=true`;
      window.location.href = downloadUrl;
      setIsShareMenuOpen(false);
      return;
    }

    try {
      const shareUrlResponse = await fetch(`/api/share-url?url=${encodeURIComponent(catImage.url)}`);
      const { shareUrl } = await shareUrlResponse.json();

      const shareData = {
        title: 'Check out this adorable cat!',
        text: 'Check out this adorable cat I found on MeowViewer! 🐱',
      };

      const { file, blob } = await prepareImageForSharing(catImage.url);
      if (!file || !blob) {
        throw new Error('Failed to prepare image');
      }

      if (type === 'native' && navigator.share && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            title: shareData.title,
            text: shareData.text,
            url: shareUrl,
            files: [file],
          });
          setIsShareMenuOpen(false);
          return;
        } catch (error) {
          if (error instanceof Error && error.name !== 'AbortError') {
            console.error("Native share failed, falling back:", error);
            type = 'copy';
          }
        }
      }

      if (type === 'copy') {
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
          await navigator.clipboard.writeText(`${shareData.text}\n${shareUrl}`);
          toast({
            title: "Copied to clipboard!",
            description: "The cat image URL has been copied to your clipboard (image copying not supported in this browser).",
          });
        }
      }
    } catch (error) {
      console.error("Error sharing:", error);
      toast({
        title: "Error sharing",
        description: "Failed to share the image. Please try again.",
        variant: "destructive",
      });
    }
    setIsShareMenuOpen(false);
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

    if (isFavorite(catImage.id)) {
      removeFavorite(catImage.id);
    } else {
      addFavorite(catImage);
    }
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

  const currentIsFavorite = catImage ? isFavorite(catImage.id) : false;

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
          <Share2 className="h-5 w-5" />
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
                className="w-full justify-start text-[#FF4081] hover:text-[#FF4081]/80 hover:bg-pink-50"
                onClick={() => handleShare('native')}
              >
                <Share2 className="mr-2 h-5 w-5" /> Share
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-[#FF4081] hover:text-[#FF4081]/80 hover:bg-pink-50"
                onClick={() => handleShare('copy')}
              >
                <BsLink45Deg className="mr-2 h-5 w-5" /> Copy
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-[#FF4081] hover:text-[#FF4081]/80 hover:bg-pink-50"
                onClick={() => handleShare('download')}
              >
                <Download className="mr-2 h-5 w-5" /> Download
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
          aria-label={currentIsFavorite ? "Remove from favorites" : "Add to favorites"}
          onClick={toggleFavorite}
          disabled={isLoading || !catImage}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
            <path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z"
            fill={currentIsFavorite ? "white" : "none"}
            stroke="white"
            strokeWidth={currentIsFavorite ? "0" : "2"} />
          </svg>
        </Button>
      </div>
    </div>
  );
};

export default ControlsContainer;
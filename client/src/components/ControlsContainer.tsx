import { RefreshCw, Share2, Heart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ControlsContainerProps {
  onNewCat: () => void;
  isLoading: boolean;
}

const ControlsContainer = ({ onNewCat, isLoading }: ControlsContainerProps) => {
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
        >
          <Share2 className="h-4 w-4" />
        </Button>

        <Button 
          variant="ghost" 
          size="icon" 
          className="bg-accent hover:bg-opacity-80 text-secondary p-3 rounded-full shadow transition duration-200"
          aria-label="Add cat image to favorites"
        >
          <Heart className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ControlsContainer;

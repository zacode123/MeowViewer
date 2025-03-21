import { AlertCircle, Loader2 } from "lucide-react";
import { CatImage } from "@shared/schema";

interface ImageContainerProps {
  catImage: CatImage | undefined;
  isLoading: boolean;
  hasError: boolean;
}

const ImageContainer = ({ catImage, isLoading, hasError }: ImageContainerProps) => {
  return (
    <div className="bg-white rounded-[12px] shadow-lg overflow-hidden mb-6">
      <div className="p-[12px] relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF4081]"></div>
          </div>
        )}

        {hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-10 p-6">
            <div className="text-center">
              <AlertCircle className="mx-auto h-12 w-12 text-[#FF4081] mb-2" />
              <p className="text-[#FF4081] font-medium">Oops! Couldn't fetch a cat image.</p>
              <p className="text-gray-600 mt-2">The cats are busy playing with yarn. Try again?</p>
            </div>
          </div>
        )}

        <div className="rounded-[12px] overflow-hidden flex items-center justify-center bg-gray-50 h-[300px] md:h-[400px]">
          {catImage && (
            <div className="w-full h-full flex items-center justify-center p-4">
              <img
                src={catImage.url}
                alt="Random cat image"
                className="max-w-full max-h-full object-contain animate-fadeIn rounded-md"
                style={{ 
                  width: "auto", 
                  height: "auto",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
                }}
              />
            </div>
          )}
        </div>
      </div>

      <div className="px-[12px] pb-[12px] pt-2">
        {catImage && catImage.attribution && (
          <p className="text-sm text-gray-500 italic text-center">
            {catImage.attribution}
          </p>
        )}
      </div>
    </div>
  );
};

export default ImageContainer;

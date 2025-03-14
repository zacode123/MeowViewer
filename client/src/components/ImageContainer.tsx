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
      <div className="p-[24px] relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
          </div>
        )}

        {hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-10 p-6">
            <div className="text-center">
              <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-2" />
              <p className="text-red-500 font-medium">Oops! Couldn't fetch a cat image.</p>
              <p className="text-gray-600 mt-2">The cats are busy playing with yarn. Try again?</p>
            </div>
          </div>
        )}

        <div className="rounded-[12px] overflow-hidden flex items-center justify-center bg-gray-100 min-h-[300px] md:min-h-[400px]">
          {catImage && (
            <img
              src={catImage.url}
              alt="Random cat image"
              className="max-w-full max-h-[500px] object-contain animate-fadeIn"
            />
          )}
        </div>
      </div>

      <div className="px-[24px] pb-[24px]">
        {catImage && catImage.attribution && (
          <p className="text-sm text-gray-500 italic mb-2">
            {catImage.attribution}
          </p>
        )}
      </div>
    </div>
  );
};

export default ImageContainer;

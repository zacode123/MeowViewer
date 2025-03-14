import { Shuffle, Zap, Smartphone } from "lucide-react";

const FeatureSection = () => {
  return (
    <div className="mt-16 grid md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-[12px] shadow-md text-center">
        <div className="bg-accent inline-flex p-3 rounded-full mb-4">
          <Shuffle className="text-secondary" />
        </div>
        <h3 className="font-nunito font-bold text-lg mb-2">Random Cats</h3>
        <p className="text-gray-600">Discover unique and adorable cat images from around the web.</p>
      </div>

      <div className="bg-white p-6 rounded-[12px] shadow-md text-center">
        <div className="bg-accent inline-flex p-3 rounded-full mb-4">
          <Zap className="text-secondary" />
        </div>
        <h3 className="font-nunito font-bold text-lg mb-2">Instant Loading</h3>
        <p className="text-gray-600">Optimized for speed with quick loading and smooth transitions.</p>
      </div>

      <div className="bg-white p-6 rounded-[12px] shadow-md text-center">
        <div className="bg-accent inline-flex p-3 rounded-full mb-4">
          <Smartphone className="text-secondary" />
        </div>
        <h3 className="font-nunito font-bold text-lg mb-2">Mobile Friendly</h3>
        <p className="text-gray-600">Enjoy cat images on any device with our responsive design.</p>
      </div>
    </div>
  );
};

export default FeatureSection;

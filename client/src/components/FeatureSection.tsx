import { Cat, Zap, Smartphone } from "lucide-react";

const FeatureSection = () => {
  return (
    <div className="mt-16 grid md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-[12px] shadow-md text-center">
        <div className="bg-[#FFB6C1] inline-flex p-4 rounded-full mb-4 shadow-sm">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8 0-1.12.23-2.18.65-3.15.41.28.85.53 1.33.71.86 3.45 2.53 6.24 4.68 8.53-2.76-2.13-4.98-5.03-6.11-8.22-.11-.04-.22-.09-.33-.14C4.67 8.8 4 10.33 4 12c0 4.41 3.59 8 8 8s8-3.59 8-8c0-.27-.02-.54-.04-.81-1.39-.25-2.76-.76-4.01-1.5-.11.75-.36 1.44-.7 2.06 2.31 1.17 5.33 1.65 8.07 1.19-.98 3.97-4.58 6.91-8.82 6.91zM17.15 8.94c1.29.9 2.73 1.49 4.26 1.75-.28-1.14-.83-2.2-1.54-3.11-.61.45-1.61.82-2.72.89v.47zM9.5 6.28c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm3.32.97c.43-.37.68-.91.68-1.47 0-1.1-.9-2-2-2s-2 .9-2 2c0 .56.24 1.1.68 1.47C7.64 8.17 6 10.63 6 13.5c0 1.18.78 2.2 1.84 2.58.38-1.55 1.8-2.74 3.47-2.83L12 16l.69-2.75c1.67.09 3.09 1.28 3.47 2.83 1.06-.38 1.84-1.4 1.84-2.58 0-2.87-1.64-5.33-4.18-6.25z" 
            fill="#FF4081"/>
          </svg>
        </div>
        <h3 className="font-nunito font-bold text-lg mb-2">Random Cats</h3>
        <p className="text-gray-600">Discover unique and adorable cat images from around the web.</p>
      </div>

      <div className="bg-white p-6 rounded-[12px] shadow-md text-center">
        <div className="bg-[#FFB6C1] inline-flex p-4 rounded-full mb-4 shadow-sm">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
            <path d="M12 2c-4 0-8 .5-8 4v9.5C4 17.43 5.57 19 7.5 19L6 20.5v.5h2.23l2-2H14l2 2h2v-.5L16.5 19c1.93 0 3.5-1.57 3.5-3.5V6c0-3.5-3.58-4-8-4zM7.5 17c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm3.5-7H6V6h5v4zm5.5 7c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-7h-5V6h5v4z" 
            fill="#FF4081"/>
          </svg>
        </div>
        <h3 className="font-nunito font-bold text-lg mb-2">Instant Loading</h3>
        <p className="text-gray-600">Optimized for speed with quick loading and smooth transitions.</p>
      </div>

      <div className="bg-white p-6 rounded-[12px] shadow-md text-center">
        <div className="bg-[#FFB6C1] inline-flex p-4 rounded-full mb-4 shadow-sm">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
            <path d="M17 12c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0 8c-1.65 0-3-1.35-3-3s1.35-3 3-3 3 1.35 3 3-1.35 3-3 3zm-1-5h2v2h-2v-2zm-6-5c.55 0 1-.45 1-1V3c0-.55-.45-1-1-1s-1 .45-1 1v6c0 .55.45 1 1 1zm-1 10.82l1.18 1.18 1.42-1.41-1.18-1.18c.31-.32.56-.68.75-1.08.2-.42.33-.85.38-1.33h-2.05c-.28 0-.5.22-.5.5s.22.5.5.5h1.06c-.04.19-.12.36-.22.52-.14.21-.32.39-.54.55l-.7.7zM2.6 4.43l1.42 1.42C2.35 8.27 1 11.03 1 14c0 .55.45 1 1 1s1-.45 1-1c0-2.49 1.24-4.80 3.29-6.25l1.42 1.42C5.12 10.67 4 12.28 4 14c0 .55.45 1 1 1s1-.45 1-1c0-1.19.6-2.29 1.59-2.95l1.42 1.42c-.51.26-.85.81-.85 1.41 0 .89.72 1.61 1.61 1.61.26 0 .5-.06.72-.17l.69.7L14.6 10l-10-10-2 4.43z" 
            fill="#FF4081"/>
          </svg>
        </div>
        <h3 className="font-nunito font-bold text-lg mb-2">Mobile Friendly</h3>
        <p className="text-gray-600">Enjoy cat images on any device with our responsive design.</p>
      </div>
    </div>
  );
};

export default FeatureSection;

import { Cat, Zap, Smartphone } from "lucide-react";

const FeatureSection = () => {
  return (
    <div className="mt-16 grid md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-[12px] shadow-md text-center">
        <div className="bg-[#FF4081] inline-flex p-4 rounded-full mb-4 shadow-sm">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12,8L10.67,8.09C9.81,7.07 7.4,4.5 5,4.5C5,4.5 3.03,7.46 4.96,11.41C4.41,12.24 4.07,12.67 4,13.66L2.07,13.95L2.28,14.93L4.04,14.67L4.18,15.38L2.61,16.32L3.08,17.21L4.53,16.32C5.68,18.76 8.59,20 12,20C15.41,20 18.32,18.76 19.47,16.32L20.92,17.21L21.39,16.32L19.82,15.38L19.96,14.67L21.72,14.93L21.93,13.95L20,13.66C19.93,12.67 19.59,12.24 19.04,11.41C20.97,7.46 19,4.5 19,4.5C16.6,4.5 14.19,7.07 13.33,8.09L12,8M9,11A1,1 0 0,1 10,12A1,1 0 0,1 9,13A1,1 0 0,1 8,12A1,1 0 0,1 9,11M15,11A1,1 0 0,1 16,12A1,1 0 0,1 15,13A1,1 0 0,1 14,12A1,1 0 0,1 15,11M11,14H13L12.3,15.39C12.5,16.03 13.06,16.5 13.75,16.5A1.5,1.5 0 0,0 15.25,15H15.75A2,2 0 0,1 13.75,17C13,17 12.35,16.59 12,16V16H12C11.65,16.59 11,17 10.25,17A2,2 0 0,1 8.25,15H8.75A1.5,1.5 0 0,0 10.25,16.5C10.94,16.5 11.5,16.03 11.7,15.39L11,14Z" 
            fill="white"/>
          </svg>
        </div>
        <h3 className="font-nunito font-bold text-lg mb-2">Random Cats</h3>
        <p className="text-gray-600">Discover unique and adorable cat images from around the web.</p>
      </div>

      <div className="bg-white p-6 rounded-[12px] shadow-md text-center">
        <div className="bg-[#FF4081] inline-flex p-4 rounded-full mb-4 shadow-sm">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11,6.5V9.33L8.33,12L11,14.67V17.5L5.5,12M13,6.43V9.33L15.67,12L13,14.67V17.57L18.57,12M5,3C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3H5M19,19H5V5H19V19Z" 
            fill="white"/>
          </svg>
        </div>
        <h3 className="font-nunito font-bold text-lg mb-2">Instant Loading</h3>
        <p className="text-gray-600">Optimized for speed with quick loading and smooth transitions.</p>
      </div>

      <div className="bg-white p-6 rounded-[12px] shadow-md text-center">
        <div className="bg-[#FF4081] inline-flex p-4 rounded-full mb-4 shadow-sm">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.5,17.5C14.5,17.5 12.1,15.4 11.4,12.8L10.2,12.9C8.3,13 6.6,11.5 6.4,9.5L6.3,8.4C6.2,7.7 6.3,7 6.7,6.3C7.1,5.6 7.7,5.1 8.4,4.9L8.9,4.8C10.2,4.6 11.4,5.4 11.9,6.7L12.3,7.9C12.8,7.1 13.7,6.6 14.7,6.6C16.2,6.6 17.3,7.7 17.4,9.2L17.5,9.9C17.5,10.1 17.5,10.4 17.5,10.6L20.5,10.6C20.2,6.8 18.7,3.6 16.4,1.4C15.9,0.9 15.1,0.9 14.6,1.4C13.9,2.1 13.1,3.1 12.5,4.1C11.9,3.1 11.1,2.1 10.4,1.4C9.9,0.9 9.1,0.9 8.6,1.4C5.8,4.2 4,8.4 4,12.7L4,17.5L1,17.5L1,19.5L4,19.5C4,20.7 4.7,21.7 5.8,22.2C6.9,22.7 8.1,22.5 9,21.8L12,19.5L15,21.8C15.9,22.5 17.1,22.7 18.2,22.2C19.3,21.7 20,20.7 20,19.5L22.5,19.5L22.5,17.5L17.5,17.5Z" 
            fill="white"/>
          </svg>
        </div>
        <h3 className="font-nunito font-bold text-lg mb-2">Mobile Friendly</h3>
        <p className="text-gray-600">Enjoy cat images on any device with our responsive design.</p>
      </div>
    </div>
  );
};

export default FeatureSection;

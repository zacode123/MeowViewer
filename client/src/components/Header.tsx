import { Cat } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-white shadow-md py-4">
      <div className="container mx-auto px-[24px]">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-bold text-secondary font-nunito flex items-center">
            <Cat className="mr-2" /> MeowViewer
          </h1>
          <p className="text-sm md:text-base text-text">Discover adorable cat images</p>
        </div>
      </div>
    </header>
  );
};

export default Header;

import { Cat } from "lucide-react";
import { Link } from "wouter";

const Header = () => {
  return (
    <header className="bg-white shadow-md py-4">
      <div className="container mx-auto px-[24px]">
        <div className="relative flex h-[40px] items-center">
          <Link href="/">
            <h1 className="text-2xl md:text-3xl font-bold font-nunito flex items-center cursor-pointer transition-colors duration-200">
              <Cat className="mr-2 text-[#FF4081]" size={32} /> 
              <span className="text-[#FF4081]">Meow</span>
              <span className="text-[#FF4081]">Viewer</span>
            </h1>
          </Link>
          <div className="absolute -right-5 top-1/2 -translate-y-1/2">
            <p className="text-sm md:text-base font-semibold bg-gradient-to-r from-[#FF4081] to-purple-500 text-transparent bg-clip-text">✨Discover adorable cats✨</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
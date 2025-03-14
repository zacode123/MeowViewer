import { Cat } from "lucide-react";
import { Link } from "wouter";

const Header = () => {
  return (
    <header className="bg-white shadow-md py-4">
      <div className="container mx-auto px-[24px]">
        <div className="flex justify-between items-center">
          <Link href="/">
            <h1 className="text-2xl md:text-3xl font-bold font-nunito flex items-center cursor-pointer transition-colors duration-200">
              <Cat className="mr-2 text-primary" size={32} /> 
              <span className="text-primary">Meow</span>
              <span className="text-secondary">Viewer</span>
            </h1>
          </Link>
          <p className="text-sm md:text-base text-secondary font-medium">Discover adorable cat images</p>
        </div>
      </div>
    </header>
  );
};

export default Header;

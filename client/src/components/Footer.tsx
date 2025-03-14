import { Twitter, Instagram, Facebook } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-100 py-6">
      <div className="container mx-auto px-[24px]">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-600 mb-2 md:mb-0">© {new Date().getFullYear()} MeowViewer. All cats reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="text-secondary hover:text-primary transition-colors">
              <Twitter size={18} />
            </a>
            <a href="#" className="text-secondary hover:text-primary transition-colors">
              <Instagram size={18} />
            </a>
            <a href="#" className="text-secondary hover:text-primary transition-colors">
              <Facebook size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

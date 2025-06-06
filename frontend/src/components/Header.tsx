import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import bacteriaImg from "@/assets/bacteria.png";
import { Github } from "lucide-react";

// Custom coronavirus icon as an inline SVG React component
export const CoronavirusIcon = ({ className = "", ...props }) => (
  <svg
    viewBox="0 0 64 64"
    fill="black"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <circle cx="32" cy="32" r="14" />
    <g>
      <circle cx="32" cy="32" r="4" fill="white" />
      <circle cx="32" cy="16" r="2" fill="white" />
      <circle cx="32" cy="48" r="2" fill="white" />
      <circle cx="48" cy="32" r="2" fill="white" />
      <circle cx="16" cy="32" r="2" fill="white" />
      <circle cx="42" cy="22" r="1.2" fill="white" />
      <circle cx="22" cy="42" r="1.2" fill="white" />
      <circle cx="42" cy="42" r="1.2" fill="white" />
      <circle cx="22" cy="22" r="1.2" fill="white" />
    </g>
    <g stroke="black" strokeWidth="3" strokeLinecap="round">
      <line x1="32" y1="2" x2="32" y2="18" />
      <line x1="32" y1="46" x2="32" y2="62" />
      <line x1="2" y1="32" x2="18" y2="32" />
      <line x1="46" y1="32" x2="62" y2="32" />
      <line x1="12" y1="12" x2="24" y2="24" />
      <line x1="52" y1="12" x2="40" y2="24" />
      <line x1="12" y1="52" x2="24" y2="40" />
      <line x1="52" y1="52" x2="40" y2="40" />
    </g>
  </svg>
);

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <div className="font-bold text-xl flex items-center gap-2">
              <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-white">
                <img src={bacteriaImg} alt="Bacteria" className="h-8 w-8 object-contain" />
              </span>
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">BacteriaVision</span>
            </div>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center">
            <a href="#" className="hover:underline hover:text-primary transition-colors flex items-center gap-1">
              <Github className="h-5 w-5" />
              GitHub{/* TODO: Add real GitHub link here */}
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;

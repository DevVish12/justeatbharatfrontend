import { X, Home, Info, Briefcase, Phone } from "lucide-react";
import { Link } from "react-router-dom";

const navLinks = [
  { label: "Home", icon: Home, path: "/" },
  { label: "About", icon: Info, path: "/about" },
  { label: "Job & Career", icon: Briefcase, path: "/jobs-career" },
  { label: "Contact Us", icon: Phone, path: "/contact" },
];

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <>
      <div
        className={`fixed inset-0 bg-foreground/50 z-50 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-card z-50 shadow-2xl transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"} flex flex-col`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-primary">
          <span className="text-primary-foreground font-bold text-base">Menu</span>
          <button onClick={onClose} className="text-primary-foreground hover:opacity-80 transition-opacity">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Main Navigation Links */}
          <div className="p-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.path}
                onClick={onClose}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-foreground hover:bg-accent transition-colors"
              >
                <link.icon className="w-5 h-5 text-primary" />
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;

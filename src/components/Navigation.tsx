import { useState, useEffect, memo } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";
import { useTranslation } from "react-i18next";
import { useLocation, Link } from "react-router-dom";

const Navigation = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: t('nav.home'), path: "/" },
    { name: t('nav.products'), path: "/simulators" },
    { name: t('nav.reviews'), path: "/reviews" },
    { name: t('nav.events'), path: "/events" },
    { name: t('nav.aboutUs'), path: "/about" },
    { name: t('nav.contact'), path: "/contact" },
    { name: t('nav.vr'), path: "/virtual-reality" },
    { name: t('nav.rentPurchase'), path: "/rent-purchase" },
  ];

  const filteredNavLinks = navLinks.filter(link => link.path !== location.pathname);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled || isMobileMenuOpen
        ? "bg-background/95 backdrop-blur-md shadow-lg"
        : "md:bg-transparent bg-background/95 backdrop-blur-md shadow-lg"
        }`}
    >
      {/* Mobile Menu Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 animate-fade-in md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0 mt-4">
            <Link to="/" className="flex items-center">
              <div className="relative z-50
                    px-3 py-2
                    rounded-lg">
                <img
                  src={logo}
                  alt="Devotion Sim Logo"
                  className="h-16 md:h-24 w-auto"
                />
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {filteredNavLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="font-inter text-sm font-medium text-foreground/80 hover:text-primary transition-colors duration-200 relative group"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-secondary group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-foreground p-2 relative z-50"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? (
              <X size={28} className="text-white drop-shadow-lg" strokeWidth={2.5} />
            ) : (
              <Menu size={24} />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-6 animate-fade-in relative z-50 bg-background/98 backdrop-blur-lg rounded-b-2xl shadow-2xl border-b border-border/50">
            <div className="flex flex-col space-y-1">
              {filteredNavLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="font-inter text-base font-medium text-foreground hover:text-primary hover:bg-primary/10 transition-all duration-200 py-3 px-4 block min-h-[44px] flex items-center rounded-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default memo(Navigation);

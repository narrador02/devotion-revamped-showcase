import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-rajdhani font-bold mb-4">
              <span className="text-primary">DEVOTION</span>
              <span className="text-foreground">SIM</span>
            </h3>
            <p className="text-muted-foreground font-inter text-sm leading-relaxed">
              {t('footer.description')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-rajdhani font-semibold text-lg mb-4 text-foreground">{t('footer.quickLinks')}</h4>
            <ul className="space-y-2">
              <li>
                <a href="#products" className="text-muted-foreground hover:text-primary transition-colors font-inter text-sm">
                  {t('nav.products')}
                </a>
              </li>
              <li>
                <a href="#media" className="text-muted-foreground hover:text-primary transition-colors font-inter text-sm">
                  {t('nav.media')}
                </a>
              </li>
              <li>
                <a href="#about" className="text-muted-foreground hover:text-primary transition-colors font-inter text-sm">
                  {t('nav.aboutUs')}
                </a>
              </li>
              <li>
                <a href="#contact" className="text-muted-foreground hover:text-primary transition-colors font-inter text-sm">
                  {t('nav.contact')}
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="font-rajdhani font-semibold text-lg mb-4 text-foreground">{t('footer.followUs')}</h4>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-card border border-border hover:border-primary hover:bg-primary/10 flex items-center justify-center transition-all duration-300"
                aria-label="Facebook"
              >
                <Facebook size={18} className="text-foreground hover:text-primary" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-card border border-border hover:border-primary hover:bg-primary/10 flex items-center justify-center transition-all duration-300"
                aria-label="Twitter"
              >
                <Twitter size={18} className="text-foreground hover:text-primary" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-card border border-border hover:border-primary hover:bg-primary/10 flex items-center justify-center transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram size={18} className="text-foreground hover:text-primary" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-card border border-border hover:border-primary hover:bg-primary/10 flex items-center justify-center transition-all duration-300"
                aria-label="YouTube"
              >
                <Youtube size={18} className="text-foreground hover:text-primary" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border text-center">
          <p className="text-muted-foreground font-inter text-sm">
            © {currentYear} {t('footer.copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

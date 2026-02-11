import { Instagram, Youtube } from "lucide-react";
import { useTranslation } from "react-i18next";
import { memo } from "react";

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
                <a href="/simulators" className="text-muted-foreground hover:text-primary transition-colors font-inter text-sm">
                  {t('nav.products')}
                </a>
              </li>
              <li>
                <a href="/contact" className="text-muted-foreground hover:text-primary transition-colors font-inter text-sm">
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
                href="https://www.instagram.com/devotion_sim/?hl=es"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-card border border-border hover:border-primary hover:bg-primary/10 flex items-center justify-center transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram size={18} className="text-foreground hover:text-primary" />
              </a>
              <a
                href="https://www.tiktok.com/@devotionsim_official?lang=es"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-card border border-border hover:border-primary hover:bg-primary/10 flex items-center justify-center transition-all duration-300"
                aria-label="TikTok"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="text-foreground hover:text-primary"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-5.394 10.692 6.33 6.33 0 0 0 10.857-4.424V8.687a8.182 8.182 0 0 0 4.773 1.526V6.79a4.831 4.831 0 0 1-1.003-.104z" />
                </svg>
              </a>
              <a
                href="https://www.youtube.com/@devotionsim"
                target="_blank"
                rel="noopener noreferrer"
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

export default memo(Footer);

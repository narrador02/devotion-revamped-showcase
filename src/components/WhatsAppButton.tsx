import { MessageCircle } from "lucide-react";

const WhatsAppButton = () => {
  return (
    <a
      href="https://wa.me/34696268312"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 left-6 z-50 flex items-center justify-center w-14 h-14 md:w-[60px] md:h-[60px] rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl"
      style={{ backgroundColor: '#25D366' }}
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="w-7 h-7 md:w-8 md:h-8 text-white" />
    </a>
  );
};

export default WhatsAppButton;

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Simuladores from "./pages/Simuladores";
import Reviews from "./pages/Reviews";
import Events from "./pages/Events";
import RentPurchase from "./pages/RentPurchase";
import NotFound from "./pages/NotFound";
import WhatsAppButton from "@/components/WhatsAppButton";
import ScrollToTop from "@/components/ScrollToTop";
import { HelmetProvider } from "react-helmet-async";
import About from "./pages/About";
import Contact from "./pages/Contact";
import VirtualReality from "./pages/VirtualReality";
import Specs from "./pages/Specs";
import Customization from "./pages/Customization";
import "./i18n/config";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/simuladores" element={<Simuladores />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/events" element={<Events />} />
            <Route path="/rent-purchase" element={<RentPurchase />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/virtual-reality" element={<VirtualReality />} />
            <Route path="/specs" element={<Specs />} />
            <Route path="/customization" element={<Customization />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <WhatsAppButton />
        </BrowserRouter>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;

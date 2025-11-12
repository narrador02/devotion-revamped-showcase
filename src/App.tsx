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
import "./i18n/config";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/simuladores" element={<Simuladores />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/events" element={<Events />} />
          <Route path="/rent-purchase" element={<RentPurchase />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <WhatsAppButton />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
import AdminProposals from "./pages/AdminProposals";
import Proposal from "./pages/Proposal";
import { VideoProvider } from "@/contexts/VideoContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import "./i18n/config";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <VideoProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/simuladores" element={<Simuladores />} />
              <Route path="/reviews" element={<Reviews />} />
              <Route path="/events" element={<ErrorBoundary><Events /></ErrorBoundary>} />
              <Route path="/events-test" element={<ErrorBoundary><Events /></ErrorBoundary>} />
              <Route path="/rent-purchase" element={<RentPurchase />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/virtual-reality" element={<VirtualReality />} />
              <Route path="/specs" element={<Specs />} />
              <Route path="/customization" element={<Customization />} />

              {/* Internal Route Aliases (for auto-scrolling) */}
              {/* Homepage Sections */}
              <Route path="/eventos" element={<Index />} />
              <Route path="/personalizacion" element={<Index />} />
              <Route path="/contacto" element={<Index />} />

              {/* Simulator Sections */}
              <Route path="/simuladores/motogp" element={<Simuladores />} />
              <Route path="/simuladores/top-gun" element={<Simuladores />} />
              <Route path="/simuladores/slady" element={<Simuladores />} />
              <Route path="/simuladores/time-attack" element={<Simuladores />} />
              <Route path="/simuladores/comparativa" element={<Simuladores />} />

              {/* Review Sections */}
              <Route path="/pro" element={<Navigate to="/reviews/testimonios" replace />} /> {/* Deprecated alias */}
              <Route path="/reviews/testimonios" element={<Reviews />} />
              <Route path="/opiniones/testimonios" element={<Reviews />} /> {/* Spanish alias */}

              {/* Admin routes */}
              <Route path="/admin/proposals" element={<AdminProposals />} />

              {/* Public proposal page */}
              <Route path="/p/:id" element={<Proposal />} />

              {/* Legacy URL redirects from old website */}
              <Route path="/riders/" element={<Navigate to="/reviews" replace />} />
              <Route path="/videos-devotion-sim/" element={<Navigate to="/simuladores" replace />} />
              <Route path="/es" element={<Navigate to="/" replace />} />
              <Route path="/es/contact/" element={<Navigate to="/contact" replace />} />
              <Route path="/es/riders/" element={<Navigate to="/reviews" replace />} />
              <Route path="/es/cookies/" element={<Navigate to="/" replace />} />
              <Route path="/es/author/maria/" element={<Navigate to="/" replace />} />

              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <WhatsAppButton />
          </BrowserRouter>
        </TooltipProvider>
      </VideoProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;


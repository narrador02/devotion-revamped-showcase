import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import WhatsAppButton from "@/components/WhatsAppButton";
import ScrollToTop from "@/components/ScrollToTop";
import { HelmetProvider } from "react-helmet-async";
import { VideoProvider } from "@/contexts/VideoContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import "./i18n/config";

// Lazy load page components for code splitting
const Index = lazy(() => import("./pages/Index"));
const Simuladores = lazy(() => import("./pages/Simuladores"));
const Reviews = lazy(() => import("./pages/Reviews"));
const Events = lazy(() => import("./pages/Events"));
const RentPurchase = lazy(() => import("./pages/RentPurchase"));
const NotFound = lazy(() => import("./pages/NotFound"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const VirtualReality = lazy(() => import("./pages/VirtualReality"));
const Specs = lazy(() => import("./pages/Specs"));
const Customization = lazy(() => import("./pages/Customization"));
const AdminProposals = lazy(() => import("./pages/AdminProposals"));
const Proposal = lazy(() => import("./pages/Proposal"));

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen bg-black flex items-center justify-center">
    <div className="animate-pulse text-red-500 text-lg">Loading...</div>
  </div>
);

// Create QueryClient outside component to prevent recreating on re-renders
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <VideoProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/simulators" element={<Simuladores />} />
                <Route path="/reviews" element={<Navigate to="/reviews/clients" replace />} />
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
                <Route path="/our-simulators" element={<Index />} />
                <Route path="/personalization" element={<Index />} />

                {/* Simulator Sections - Renamed base route to /simulators */}
                <Route path="/simulators/top-gun" element={<Simuladores />} />
                <Route path="/simulators/slady" element={<Simuladores />} />
                <Route path="/simulators/time-attack" element={<Simuladores />} />
                <Route path="/simulators/comparativa" element={<Simuladores />} />

                {/* Review Sections */}
                <Route path="/reviews/clients" element={<Reviews />} />
                <Route path="/reviews/pilots" element={<Reviews />} />

                {/* Events Sections */}
                <Route path="/events/motogp" element={<Events />} />

                {/* Contact Sections */}
                <Route path="/contact/questions" element={<Contact />} />

                {/* VR Sections */}
                <Route path="/virtual-reality/headsets" element={<VirtualReality />} />

                {/* Legacy / Redirects */}
                <Route path="/simuladores" element={<Navigate to="/simulators" replace />} />
                <Route path="/simuladores/*" element={<Navigate to="/simulators" replace />} />

                <Route path="/simulators/motogp" element={<Navigate to="/simulators/top-gun" replace />} />
                <Route path="/simuladores/motogp" element={<Navigate to="/simulators/top-gun" replace />} />
                <Route path="/simuladores/slady" element={<Navigate to="/simulators/slady" replace />} />
                <Route path="/simuladores/time-attack" element={<Navigate to="/simulators/time-attack" replace />} />
                <Route path="/simuladores/comparativa" element={<Navigate to="/simulators/comparativa" replace />} />
                <Route path="/pro" element={<Navigate to="/reviews/pilots" replace />} />

                {/* Admin routes */}
                <Route path="/admin/proposals" element={<AdminProposals />} />

                {/* Public proposal page */}
                <Route path="/p/:id" element={<Proposal />} />

                {/* Legacy URL redirects from old website */}
                <Route path="/riders/" element={<Navigate to="/reviews" replace />} />
                <Route path="/videos-devotion-sim/" element={<Navigate to="/simulators" replace />} />
                <Route path="/es" element={<Navigate to="/" replace />} />
                <Route path="/es/contact/" element={<Navigate to="/contact" replace />} />
                <Route path="/es/riders/" element={<Navigate to="/reviews" replace />} />
                <Route path="/es/cookies/" element={<Navigate to="/" replace />} />
                <Route path="/es/author/maria/" element={<Navigate to="/" replace />} />

                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
            <WhatsAppButton />
          </BrowserRouter>
        </TooltipProvider>
      </VideoProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;


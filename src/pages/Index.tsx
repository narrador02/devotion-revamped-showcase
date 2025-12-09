import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Products from "@/components/Products";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";
import UseCases from "@/components/UseCases";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import SpeedLinesBackground from "@/components/SpeedLinesBackground";

const Index = () => {
  return (
    <div className="min-h-screen bg-background font-inter relative">
      <Helmet>
        <title>DevotionSim | Professional Motorcycle Simulators</title>
        <meta name="description" content="Experience the thrill of the circuit with our high-performance motorcycle simulators. Perfect for training, entertainment, and events." />
      </Helmet>

      {/* Dynamic Speed Lines Background */}
      <SpeedLinesBackground />

      {/* Content with higher z-index */}
      <div className="relative z-10">
        <Navigation />
        <main>
          <Hero />
          <UseCases />
          <Products />
        </main>
        <Footer />
        <LanguageSwitcher />
      </div>
    </div>
  );
};

export default Index;

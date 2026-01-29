import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";

// ABSOLUTELY MINIMAL EVENTS PAGE
// No Framer Motion, No SEO, No heavy imports.
const Events = () => {
  return (
    <div className="min-h-screen bg-black text-white font-inter">
      <Navigation />

      <div className="pt-32 pb-20 container mx-auto px-4 text-center">
        <h1 className="text-4xl font-bold mb-8 text-green-500">EVENTS PAGE IS WORKING</h1>
        <p className="text-xl text-gray-400 mb-8">
          Since you can see this, the ROUTING is correct.
          The crash was caused by one of the components (likely animations or SEO).
          I will now add them back one by one.
        </p>
        <Link to="/" className="text-white underline">Back Home</Link>
      </div>

      <Footer />
    </div>
  );
};

export default Events;

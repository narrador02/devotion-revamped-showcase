import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Products from "@/components/Products";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background font-inter">
      <Navigation />
      <main>
        <Hero />
        <Products />
      </main>
      <Footer />
    </div>
  );
};

export default Index;

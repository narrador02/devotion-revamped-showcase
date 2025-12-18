import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

/**
 * Stub page for Customization & Branding.
 * Content to be filled later/by user request.
 */
const Customization = () => {
    return (
        <div className="min-h-screen bg-background font-inter flex flex-col">
            <SEO
                title="Customization | DevotionSim"
                description="Customize your simulator with bespoke branding."
                path="/customization"
            />
            <Navigation />

            <main className="flex-grow pt-32 pb-20 container mx-auto px-4 text-center flex flex-col items-center justify-center">
                <h1 className="text-5xl font-rajdhani font-bold mb-6">Customization</h1>
                <p className="text-xl text-muted-foreground max-w-2xl mb-12">
                    This page is under construction. Soon you will see our gallery of replica liveries and corporate branding options.
                </p>
                <Button asChild variant="outline">
                    <Link to="/simuladores">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Simulators
                    </Link>
                </Button>
            </main>

            <Footer />
        </div>
    );
};

export default Customization;

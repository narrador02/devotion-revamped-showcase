import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

// Step 1: minimal valid page - no framer motion, no heavy logic
const Eventsv2 = () => {
    return (
        <div className="min-h-screen bg-black text-white font-inter">
            {/* <Navigation /> */}
            {/* Commented out Navigation to test raw rendering first */}

            <div className="pt-32 pb-20 container mx-auto px-4 text-center">
                <h1 className="text-4xl font-bold mb-8 text-red-500">Events V2 - DEBUG MODE</h1>
                <p className="text-xl text-gray-400 mb-8">
                    If you see this, the ROUTING is 100% fine.
                    The issue is in one of the components (Navigation, SpeedLines, EventCard, etc).
                </p>
                <Link to="/" className="text-white underline">Back Home</Link>
            </div>

            {/* <Footer /> */}
        </div>
    );
};

export default Eventsv2;

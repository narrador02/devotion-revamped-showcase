import { useTranslation } from "react-i18next";
import { CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet-async";

export default function PaymentSuccess() {
    const { t } = useTranslation();

    return (
        <>
            <Helmet>
                <title>Devotion Sim – {t("paymentSuccess.title", "Payment Received!")}</title>
            </Helmet>

            <div className="min-h-screen bg-black flex items-center justify-center px-4">
                <div className="max-w-md w-full text-center space-y-8">
                    {/* Icon */}
                    <div className="flex justify-center">
                        <div className="relative">
                            <div className="absolute inset-0 rounded-full bg-green-500/20 animate-ping" />
                            <CheckCircle2 className="relative w-24 h-24 text-green-500" />
                        </div>
                    </div>

                    {/* Heading */}
                    <div className="space-y-4">
                        <h1 className="text-4xl md:text-5xl font-bold text-white font-rajdhani">
                            {t("paymentSuccess.title", "Payment Received!")}
                        </h1>
                        <p className="text-gray-300 text-lg leading-relaxed">
                            {t(
                                "paymentSuccess.message",
                                "Payment received. Thank you very much for your trust in Devotion Sim Experience. You will receive an email shortly with more information from our specialized team."
                            )}
                        </p>
                    </div>

                    {/* Logo */}
                    <div className="pt-4">
                        <img
                            src="/logo.png"
                            alt="DevotionSim"
                            className="h-10 mx-auto brightness-0 invert opacity-70"
                        />
                    </div>

                    {/* Return button */}
                    <div>
                        <Button asChild size="lg" className="bg-red-600 hover:bg-red-500 text-white font-bold uppercase tracking-wider px-10">
                            <Link to="/">
                                {t("paymentSuccess.returnHome", "Return to Home")}
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}

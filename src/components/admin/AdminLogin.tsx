import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Lock, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AdminLoginProps {
    onLoginSuccess: () => void;
}

export default function AdminLogin({ onLoginSuccess }: AdminLoginProps) {
    const { t } = useTranslation();
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [attemptsRemaining, setAttemptsRemaining] = useState<number | null>(null);
    const [retryAfter, setRetryAfter] = useState<number | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const response = await fetch("/api/admin/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ password }),
                credentials: "include",
            });

            const data = await response.json();

            if (response.ok) {
                onLoginSuccess();
            } else if (response.status === 429) {
                setRetryAfter(data.retryAfter);
                setError(t("admin.login.rateLimited", { seconds: data.retryAfter }));
            } else if (response.status === 401) {
                setAttemptsRemaining(data.attemptsRemaining);
                setError(t("admin.login.invalidPassword"));
            } else {
                setError(t("admin.login.error"));
            }
        } catch (err) {
            setError(t("admin.login.error"));
            console.error("Login error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            {/* Background gradient effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-900/10 via-transparent to-transparent" />

            <Card className="relative w-full max-w-md bg-gray-900/90 border-gray-800 backdrop-blur-sm shadow-2xl">
                <CardHeader className="text-center space-y-4">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center shadow-lg shadow-red-500/20">
                        <Lock className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-white">
                        {t("admin.login.title")}
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                        {t("admin.login.subtitle")}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <Alert variant="destructive" className="bg-red-900/50 border-red-800">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>
                                    {error}
                                    {attemptsRemaining !== null && attemptsRemaining > 0 && (
                                        <span className="block text-sm mt-1 text-red-300">
                                            {t("admin.login.attemptsRemaining", { count: attemptsRemaining })}
                                        </span>
                                    )}
                                </AlertDescription>
                            </Alert>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-gray-300">
                                {t("admin.login.passwordLabel")}
                            </Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 pr-10 focus:ring-red-500 focus:border-red-500"
                                    disabled={isLoading || (retryAfter !== null && retryAfter > 0)}
                                    autoComplete="current-password"
                                    autoFocus
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-5 shadow-lg shadow-red-500/20 transition-all"
                            disabled={isLoading || !password || (retryAfter !== null && retryAfter > 0)}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    {t("admin.login.loading")}
                                </>
                            ) : (
                                t("admin.login.submit")
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Sparkles, Loader2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PhraseGeneratorProps {
    clientName: string;
    onSelectPhrase: (phrase: string) => void;
    disabled?: boolean;
}

const MAX_SUGGESTIONS = 5;

export default function PhraseGenerator({ clientName, onSelectPhrase, disabled }: PhraseGeneratorProps) {
    const { t, i18n } = useTranslation();
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const remainingGenerations = MAX_SUGGESTIONS - suggestions.length;
    const canGenerate = remainingGenerations > 0 && clientName.trim().length > 0 && !disabled;

    const generatePhrase = async () => {
        if (!canGenerate) return;

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch("/api/ai/generate-phrase", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    clientName: clientName.trim(),
                    locale: i18n.language,
                }),
                credentials: "include",
            });

            if (!response.ok) {
                const data = await response.json().catch(() => ({}));
                console.error("API Error details:", data);
                if (response.status === 429) {
                    const isQuotaError = data.type === 'insufficient_quota' || data.details?.includes('quota');
                    if (isQuotaError) {
                        throw new Error(t("admin.proposals.openaiQuotaError", "OpenAI Quota Exceeded - Check Billing"));
                    }
                    throw new Error(t("admin.proposals.openaiRateLimit", "Too many requests - please wait"));
                }
                if (data.error === 'OpenAI not configured') {
                    throw new Error(t("admin.proposals.openaiNotConfigured"));
                }
                throw new Error(data.message || data.error || t("admin.proposals.phraseError", "Failed to generate phrase"));
            }

            const data = await response.json();

            if (data.phrase) {
                setSuggestions(prev => [...prev, data.phrase]);
            }
        } catch (err: any) {
            console.error("Error generating phrase:", err);
            setError(err.message || t("admin.proposals.phraseError"));
        } finally {
            setIsLoading(false);
        }
    };

    const removeSuggestion = (index: number) => {
        setSuggestions(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-3">
            {/* Generate button */}
            <div className="flex items-center gap-3">
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={generatePhrase}
                    disabled={!canGenerate || isLoading}
                    className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            {t("admin.proposals.generating")}
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-4 h-4 mr-2" />
                            {t("admin.proposals.generatePhrase")}
                        </>
                    )}
                </Button>

                <span className="text-sm text-gray-500">
                    {t("admin.proposals.suggestionsRemaining", { count: remainingGenerations })}
                </span>
            </div>

            {error && (
                <p className="text-sm text-red-400">{error}</p>
            )}

            {/* Suggestions list */}
            {suggestions.length > 0 && (
                <div className="space-y-2">
                    <p className="text-sm text-gray-400 font-medium">
                        {t("admin.proposals.suggestions")}
                    </p>
                    <div className="space-y-2">
                        {suggestions.map((phrase, index) => (
                            <div
                                key={index}
                                className="flex items-start gap-2 p-3 bg-gray-800/50 rounded-lg border border-gray-700 group"
                            >
                                <p className="flex-1 text-sm text-gray-300 italic">"{phrase}"</p>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onSelectPhrase(phrase)}
                                        className="h-8 px-2 text-green-400 hover:text-green-300 hover:bg-green-900/20"
                                    >
                                        <Check className="w-4 h-4" />
                                        <span className="ml-1 text-xs">{t("admin.proposals.usePhrase")}</span>
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeSuggestion(index)}
                                        className="h-8 px-2 text-gray-400 hover:text-gray-300 hover:bg-gray-800"
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

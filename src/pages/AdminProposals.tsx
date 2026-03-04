import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { LogOut, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEO from "@/components/SEO";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminProposalForm from "@/components/admin/AdminProposalForm";
import ProposalSuccess from "@/components/admin/ProposalSuccess";
import RecentProposals from "@/components/admin/RecentProposals";
import { ProposalListItem, Proposal } from "@/types/proposal";

interface RecentProposal {
    id: string;
    clientName: string;
    createdAt: string;
    expiresAt: string;
    isExpired: boolean;
    accepted?: boolean;
    acceptedAt?: string | null;
    customerDetails?: {
        fullName?: string;
        email?: string;
        phone?: string;
    } | null;
}

type ViewState = "form" | "success";

export default function AdminProposals() {
    const { t } = useTranslation();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [viewState, setViewState] = useState<ViewState>("form");
    const [successData, setSuccessData] = useState<{ id: string; clientName: string } | null>(null);
    const [recentProposals, setRecentProposals] = useState<RecentProposal[]>([]);
    const [isLoadingProposals, setIsLoadingProposals] = useState(false);
    const [editData, setEditData] = useState<Proposal | null>(null);
    const [isFetchingEdit, setIsFetchingEdit] = useState(false);

    // Verify authentication on mount
    // Verify admin authentication
    useEffect(() => {
        const verifyAuth = async () => {
            try {
                const response = await fetch('/api/admin?action=verify', {
                    credentials: 'include'
                });
                setIsAuthenticated(response.ok);
            } catch (error) {
                console.error('Auth verification failed:', error);
                setIsAuthenticated(false);
            }
        };

        verifyAuth();
    }, []);

    // Load recent proposals when authenticated
    const loadRecentProposals = useCallback(async () => {
        if (!isAuthenticated) return;

        setIsLoadingProposals(true);
        try {
            const response = await fetch("/api/proposals", {
                credentials: "include",
            });
            if (response.ok) {
                const data = await response.json();
                setRecentProposals(data.proposals || []);
            }
        } catch (err) {
            console.error("Error loading proposals:", err);
        } finally {
            setIsLoadingProposals(false);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        loadRecentProposals();
    }, [loadRecentProposals]);

    const handleLoginSuccess = () => {
        setIsAuthenticated(true);
    };

    const handleLogout = async () => {
        try {
            await fetch("/api/admin?action=logout", {
                method: "POST",
                credentials: "include",
            });
        } catch {
            // Ignore errors
        }
        setIsAuthenticated(false);
        setViewState("form");
        setSuccessData(null);
    };

    const handleProposalSuccess = (id: string, clientName: string) => {
        setSuccessData({ id, clientName });
        setViewState("success");
        // Add to recent proposals list
        setRecentProposals(prev => [
            {
                id,
                clientName,
                createdAt: new Date().toISOString(),
                expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                isExpired: false,
            },
            ...prev,
        ].slice(0, 10));
    };

    const handleCreateAnother = () => {
        setViewState("form");
        setSuccessData(null);
        setEditData(null);
    };

    const handleEditProposal = async (proposalId: string) => {
        setIsFetchingEdit(true);
        try {
            const response = await fetch(`/api/proposals/${proposalId}`, {
                credentials: "include",
            });
            if (response.ok) {
                const { proposal } = await response.json();
                setEditData(proposal);
                setViewState("form");
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                console.error("Failed to fetch proposal details for edit");
            }
        } catch (error) {
            console.error("Error fetching proposal details:", error);
        } finally {
            setIsFetchingEdit(false);
        }
    };

    // Loading state
    if (isAuthenticated === null) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
        );
    }

    // Not authenticated - show login
    if (!isAuthenticated) {
        return (
            <>
                <SEO
                    title={t("admin.login.pageTitle")}
                    noindex={true}
                />
                <AdminLogin onLoginSuccess={handleLoginSuccess} />
            </>
        );
    }

    // Authenticated - show admin panel
    return (
        <>
            <SEO
                title={t("admin.proposals.pageTitle")}
                noindex={true}
            />
            <div className="min-h-screen bg-black">
                {/* Background effects */}
                <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900" />
                <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-900/10 via-transparent to-transparent" />

                {/* Content */}
                <div className="relative">
                    {/* Header */}
                    <header className="sticky top-0 z-10 bg-black/80 backdrop-blur-sm border-b border-gray-800">
                        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">D</span>
                                </div>
                                <h1 className="text-lg font-semibold text-white">
                                    {t("admin.proposals.title")}
                                </h1>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleLogout}
                                className="text-gray-400 hover:text-white hover:bg-gray-800"
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                {t("admin.logout")}
                            </Button>
                        </div>
                    </header>

                    {/* Main content */}
                    <main className="max-w-4xl mx-auto px-4 py-8">
                        {viewState === "success" && successData ? (
                            <ProposalSuccess
                                proposalId={successData.id}
                                clientName={successData.clientName}
                                onCreateAnother={handleCreateAnother}
                            />
                        ) : (
                            <>
                                <div className="lg:col-span-2">
                                    {(isFetchingEdit) ? (
                                        <div className="flex justify-center items-center py-20 bg-gray-900 border border-gray-800 rounded-xl max-w-2xl mx-auto">
                                            <div className="flex flex-col items-center gap-4">
                                                <Loader2 className="w-8 h-8 animate-spin text-red-500" />
                                                <p className="text-gray-400 font-medium">Cargando propuesta para editar...</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <AdminProposalForm
                                            key={editData ? editData.id : 'new'}
                                            onSuccess={handleProposalSuccess}
                                            initialData={editData}
                                        />
                                    )}
                                </div>

                                {/* Recent proposals - Full Width */}
                                <div className="mt-12">
                                    {isLoadingProposals ? (
                                        <div className="flex justify-center py-8">
                                            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                                        </div>
                                    ) : (
                                        <RecentProposals
                                            proposals={recentProposals}
                                            onDelete={loadRecentProposals}
                                            onEdit={handleEditProposal}
                                        />
                                    )}
                                </div>
                            </>
                        )}
                    </main >
                </div >
            </div >
        </>
    );
}

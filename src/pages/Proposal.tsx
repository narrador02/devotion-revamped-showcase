import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react";
import SEO from "@/components/SEO";
import ProposalDisplay from "@/components/proposal/ProposalDisplay";
import ExpiredProposal from "@/components/proposal/ExpiredProposal";

import { Proposal as ProposalType } from "@/types/proposal";

type PageState = "loading" | "found" | "expired" | "not_found";

export default function Proposal() {
    const { id } = useParams<{ id: string }>();
    const { t } = useTranslation();
    const [pageState, setPageState] = useState<PageState>("loading");
    const [proposalData, setProposalData] = useState<ProposalType | null>(null);

    useEffect(() => {
        const fetchProposal = async () => {
            if (!id) {
                setPageState("not_found");
                return;
            }

            try {
                const response = await fetch(`/api/proposals/${id}`);

                if (response.ok) {
                    const data = await response.json();
                    setProposalData(data.proposal);
                    setPageState("found");
                } else if (response.status === 410) {
                    setPageState("expired");
                } else {
                    setPageState("not_found");
                }
            } catch (err) {
                console.error("Error fetching proposal:", err);
                setPageState("not_found");
            }
        };

        fetchProposal();
    }, [id]);

    // Loading
    if (pageState === "loading") {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
        );
    }

    // Expired
    if (pageState === "expired") {
        return (
            <>
                <SEO
                    title={t("proposal.expiredTitle")}
                    noindex={true}
                />
                <ExpiredProposal />
            </>
        );
    }

    // Not found (same UI as expired for security)
    if (pageState === "not_found" || !proposalData) {
        return (
            <>
                <SEO
                    title={t("proposal.expiredTitle")}
                    noindex={true}
                />
                <ExpiredProposal />
            </>
        );
    }

    // Found - display proposal
    return (
        <>
            <SEO
                title={t("proposal.pageTitle", { clientName: proposalData.clientName })}
                description={t("proposal.pageDescription", { clientName: proposalData.clientName })}
                noindex={true}
            />
            <ProposalDisplay proposal={proposalData} />
        </>
    );
}

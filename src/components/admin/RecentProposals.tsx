import { useTranslation } from "react-i18next";
import { Copy, Check, ExternalLink, Clock, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";

interface Proposal {
    id: string;
    clientName: string;
    createdAt: string;
    expiresAt: string;
    isExpired: boolean;
}

interface RecentProposalsProps {
    proposals: Proposal[];
}

function formatDate(dateString: string, locale: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
}

function CopyButton({ proposalId }: { proposalId: string }) {
    const { t } = useTranslation();
    const [copied, setCopied] = useState(false);
    const url = `${window.location.origin}/p/${proposalId}`;

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={copy}
            className="h-8 px-2"
            title={t("admin.proposals.copyLink")}
        >
            {copied ? (
                <Check className="w-4 h-4 text-green-500" />
            ) : (
                <Copy className="w-4 h-4 text-gray-400" />
            )}
        </Button>
    );
}

export default function RecentProposals({ proposals }: RecentProposalsProps) {
    const { t, i18n } = useTranslation();

    if (proposals.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>{t("admin.proposals.noProposals")}</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">
                {t("admin.proposals.recentProposals")}
            </h3>

            {/* Desktop table */}
            <div className="hidden md:block overflow-hidden rounded-lg border border-gray-800">
                <Table>
                    <TableHeader className="bg-gray-800/50">
                        <TableRow className="border-gray-700 hover:bg-transparent">
                            <TableHead className="text-gray-400">{t("admin.proposals.clientName")}</TableHead>
                            <TableHead className="text-gray-400">{t("admin.proposals.createdAt")}</TableHead>
                            <TableHead className="text-gray-400">{t("admin.proposals.expiresAt")}</TableHead>
                            <TableHead className="text-gray-400 text-right">{t("admin.proposals.actions")}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {proposals.map((proposal) => (
                            <TableRow
                                key={proposal.id}
                                className={`border-gray-800 ${proposal.isExpired ? 'opacity-50' : ''}`}
                            >
                                <TableCell className="font-medium text-white">
                                    <div className="flex items-center gap-2">
                                        {proposal.clientName}
                                        {proposal.isExpired && (
                                            <span className="px-2 py-0.5 text-xs bg-red-900/50 text-red-400 rounded">
                                                {t("admin.proposals.expired")}
                                            </span>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="text-gray-400">
                                    {formatDate(proposal.createdAt, i18n.language)}
                                </TableCell>
                                <TableCell className="text-gray-400">
                                    {formatDate(proposal.expiresAt, i18n.language)}
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-1">
                                        <CopyButton proposalId={proposal.id} />
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 px-2"
                                            onClick={() => window.open(`/p/${proposal.id}`, '_blank')}
                                            title={t("admin.proposals.openProposal")}
                                        >
                                            <ExternalLink className="w-4 h-4 text-gray-400" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Mobile list */}
            <div className="md:hidden space-y-3">
                {proposals.map((proposal) => (
                    <div
                        key={proposal.id}
                        className={`p-4 bg-gray-800/50 rounded-lg border border-gray-700 ${proposal.isExpired ? 'opacity-50' : ''}`}
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-white truncate">
                                    {proposal.clientName}
                                </p>
                                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-gray-400">
                                    <span>{formatDate(proposal.createdAt, i18n.language)}</span>
                                    <span className="flex items-center gap-1">
                                        {proposal.isExpired ? (
                                            <>
                                                <AlertTriangle className="w-3 h-3 text-red-400" />
                                                <span className="text-red-400">{t("admin.proposals.expired")}</span>
                                            </>
                                        ) : (
                                            <>
                                                <Clock className="w-3 h-3" />
                                                {formatDate(proposal.expiresAt, i18n.language)}
                                            </>
                                        )}
                                    </span>
                                </div>
                            </div>
                            <div className="flex gap-1">
                                <CopyButton proposalId={proposal.id} />
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 px-2"
                                    onClick={() => window.open(`/p/${proposal.id}`, '_blank')}
                                >
                                    <ExternalLink className="w-4 h-4 text-gray-400" />
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

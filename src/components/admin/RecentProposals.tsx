import { useTranslation } from "react-i18next";
import { Copy, Check, ExternalLink, Clock, AlertTriangle, Trash2, Loader2, CheckCircle2, User, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Proposal {
    id: string;
    clientName: string;
    createdAt: string;
    expiresAt: string;
    isExpired: boolean;
    price?: number | null;
    accepted?: boolean;
    acceptedAt?: string | null;
    customerDetails?: {
        fullName?: string;
        email?: string;
        phone?: string;
    } | null;
}

interface RecentProposalsProps {
    proposals: Proposal[];
    onDelete?: () => void;
}

function formatDate(dateString: string, locale: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
}

function formatPrice(price: number | null | undefined, locale: string): string {
    if (price === null || price === undefined) return "-";
    return new Intl.NumberFormat(locale === 'es' ? 'es-ES' : 'en-US', {
        style: 'currency',
        currency: 'EUR',
        maximumFractionDigits: 0
    }).format(price);
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

function DeleteButton({ proposalId, clientName, onDelete }: { proposalId: string, clientName: string, onDelete?: () => void }) {
    const { t } = useTranslation();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const response = await fetch(`/api/proposals/${proposalId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                onDelete?.();
            } else {
                console.error("Failed to delete proposal");
            }
        } catch (error) {
            console.error("Error deleting proposal:", error);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 hover:bg-red-900/20 hover:text-red-400"
                    title={t("admin.proposals.delete", "Delete")}
                    disabled={isDeleting}
                >
                    {isDeleting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Trash2 className="w-4 h-4" />
                    )}
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-gray-900 border-gray-800 text-white">
                <AlertDialogHeader>
                    <AlertDialogTitle>{t("admin.proposals.deleteTitle", "Delete Proposal")}</AlertDialogTitle>
                    <AlertDialogDescription className="text-gray-400">
                        {t("admin.proposals.deleteConfirm", "Are you sure you want to delete the proposal for {{clientName}}? This action cannot be undone.", { clientName })}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="bg-gray-800 text-white border-gray-700 hover:bg-gray-700">
                        {t("common.cancel", "Cancel")}
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        className="bg-red-600 hover:bg-red-700 text-white border-none"
                    >
                        {t("common.delete", "Delete")}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

function ProposalTable({ proposals, onDelete, showAcceptedInfo = false }: { proposals: Proposal[], onDelete?: () => void, showAcceptedInfo?: boolean }) {
    const { i18n, t } = useTranslation();

    return (
        <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-hidden rounded-lg border border-gray-800">
                <Table>
                    <TableHeader className="bg-gray-800/50">
                        <TableRow className="border-gray-700 hover:bg-transparent">
                            <TableHead className="text-gray-400 w-[28%]">{t("admin.proposals.name", "Nombre")}</TableHead>
                            <TableHead className="text-gray-400">{t("proposal.price", "Precio")}</TableHead>
                            <TableHead className="text-gray-400">{t("admin.proposals.createdAt", "Creado")}</TableHead>
                            {showAcceptedInfo ? (
                                <TableHead className="text-gray-400">Aceptado el</TableHead>
                            ) : (
                                <TableHead className="text-gray-400">{t("admin.proposals.expiresAt", "Expira")}</TableHead>
                            )}
                            {showAcceptedInfo && (
                                <TableHead className="text-gray-400">Contacto</TableHead>
                            )}
                            <TableHead className="text-gray-400 text-right">{t("admin.proposals.actions", "Acciones")}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {proposals.map((proposal) => (
                            <TableRow
                                key={proposal.id}
                                className={`border-gray-800 ${proposal.isExpired && !showAcceptedInfo ? 'opacity-50' : ''}`}
                            >
                                <TableCell className="font-medium text-white">
                                    <div className="flex items-center gap-2">
                                        {proposal.clientName}
                                        {proposal.isExpired && !showAcceptedInfo && (
                                            <span className="px-2 py-0.5 text-xs bg-red-900/50 text-red-400 rounded">
                                                {t("admin.proposals.expired", "Expirado")}
                                            </span>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="text-gray-400 font-mono">
                                    {formatPrice(proposal.price, i18n.language)}
                                </TableCell>
                                <TableCell className="text-gray-400">
                                    {formatDate(proposal.createdAt, i18n.language)}
                                </TableCell>
                                {showAcceptedInfo ? (
                                    <TableCell className="text-green-400">
                                        {proposal.acceptedAt ? formatDate(proposal.acceptedAt, i18n.language) : "—"}
                                    </TableCell>
                                ) : (
                                    <TableCell className="text-gray-400">
                                        {formatDate(proposal.expiresAt, i18n.language)}
                                    </TableCell>
                                )}
                                {showAcceptedInfo && (
                                    <TableCell className="text-gray-400 text-sm">
                                        {proposal.customerDetails ? (
                                            <div className="flex flex-col gap-0.5">
                                                {proposal.customerDetails.fullName && (
                                                    <span className="flex items-center gap-1">
                                                        <User className="w-3 h-3 flex-shrink-0" />
                                                        {proposal.customerDetails.fullName}
                                                    </span>
                                                )}
                                                {proposal.customerDetails.email && (
                                                    <span className="flex items-center gap-1 text-xs text-gray-500">
                                                        <Mail className="w-3 h-3 flex-shrink-0" />
                                                        {proposal.customerDetails.email}
                                                    </span>
                                                )}
                                                {proposal.customerDetails.phone && (
                                                    <span className="flex items-center gap-1 text-xs text-gray-500">
                                                        <Phone className="w-3 h-3 flex-shrink-0" />
                                                        {proposal.customerDetails.phone}
                                                    </span>
                                                )}
                                            </div>
                                        ) : "—"}
                                    </TableCell>
                                )}
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-1">
                                        <CopyButton proposalId={proposal.id} />
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 px-2"
                                            onClick={() => window.open(`/p/${proposal.id}`, '_blank')}
                                            title={t("admin.proposals.openProposal", "Abrir")}
                                        >
                                            <ExternalLink className="w-4 h-4 text-gray-400" />
                                        </Button>
                                        <DeleteButton
                                            proposalId={proposal.id}
                                            clientName={proposal.clientName}
                                            onDelete={onDelete}
                                        />
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
                        className={`p-4 bg-gray-800/50 rounded-lg border ${showAcceptedInfo ? 'border-green-900/40' : 'border-gray-700'} ${proposal.isExpired && !showAcceptedInfo ? 'opacity-50' : ''}`}
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-white truncate text-lg">{proposal.clientName}</p>
                                <p className="text-red-400 font-mono font-medium mb-1">
                                    {formatPrice(proposal.price, i18n.language)}
                                </p>
                                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-gray-400">
                                    <span>{formatDate(proposal.createdAt, i18n.language)}</span>
                                    {showAcceptedInfo && proposal.acceptedAt && (
                                        <span className="flex items-center gap-1 text-green-400">
                                            <CheckCircle2 className="w-3 h-3" />
                                            {formatDate(proposal.acceptedAt, i18n.language)}
                                        </span>
                                    )}
                                    {!showAcceptedInfo && (
                                        <span className="flex items-center gap-1">
                                            {proposal.isExpired ? (
                                                <>
                                                    <AlertTriangle className="w-3 h-3 text-red-400" />
                                                    <span className="text-red-400">{t("admin.proposals.expired", "Expirado")}</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Clock className="w-3 h-3" />
                                                    {formatDate(proposal.expiresAt, i18n.language)}
                                                </>
                                            )}
                                        </span>
                                    )}
                                </div>
                                {showAcceptedInfo && proposal.customerDetails && (
                                    <div className="mt-2 text-xs text-gray-500 space-y-0.5">
                                        {proposal.customerDetails.fullName && <p className="flex items-center gap-1"><User className="w-3 h-3" />{proposal.customerDetails.fullName}</p>}
                                        {proposal.customerDetails.email && <p className="flex items-center gap-1"><Mail className="w-3 h-3" />{proposal.customerDetails.email}</p>}
                                        {proposal.customerDetails.phone && <p className="flex items-center gap-1"><Phone className="w-3 h-3" />{proposal.customerDetails.phone}</p>}
                                    </div>
                                )}
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
                                <DeleteButton
                                    proposalId={proposal.id}
                                    clientName={proposal.clientName}
                                    onDelete={onDelete}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

export default function RecentProposals({ proposals, onDelete }: RecentProposalsProps) {
    const { t } = useTranslation();

    const pending = proposals.filter(p => !p.accepted);
    const accepted = proposals.filter(p => p.accepted);

    return (
        <div className="space-y-12">
            {/* Propuestas Pendientes */}
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <h3 className="text-2xl font-semibold text-white">Propuestas Pendientes</h3>
                    {pending.length > 0 && (
                        <span className="px-2 py-0.5 text-xs bg-gray-800 text-gray-400 rounded-full border border-gray-700">
                            {pending.length}
                        </span>
                    )}
                </div>
                {pending.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 border border-gray-800 rounded-lg">
                        <Clock className="w-10 h-10 mx-auto mb-3 opacity-40" />
                        <p>{t("admin.proposals.noProposals", "No hay propuestas pendientes")}</p>
                    </div>
                ) : (
                    <ProposalTable proposals={pending} onDelete={onDelete} showAcceptedInfo={false} />
                )}
            </div>

            {/* Propuestas Aceptadas */}
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <h3 className="text-2xl font-semibold text-white">Propuestas Aceptadas</h3>
                    {accepted.length > 0 && (
                        <span className="px-2 py-0.5 text-xs bg-green-900/30 text-green-400 rounded-full border border-green-900/50">
                            {accepted.length}
                        </span>
                    )}
                </div>
                {accepted.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 border border-gray-800 rounded-lg">
                        <CheckCircle2 className="w-10 h-10 mx-auto mb-3 opacity-40" />
                        <p>No hay propuestas aceptadas aún</p>
                    </div>
                ) : (
                    <ProposalTable proposals={accepted} onDelete={onDelete} showAcceptedInfo={true} />
                )}
            </div>
        </div>
    );
}

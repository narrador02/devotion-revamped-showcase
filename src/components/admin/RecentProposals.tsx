import { useTranslation } from "react-i18next";
import { Copy, Check, ExternalLink, Clock, AlertTriangle, Trash2, Loader2, CheckCircle2, User, Mail, Phone, Calendar } from "lucide-react";
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
import DownloadInvoiceButton from "./DownloadInvoiceButton";
import { toast } from "sonner";

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
    rentalDetails?: any | null;
    proposalType?: "rental" | "purchase";
    notes?: string;
}

interface RecentProposalsProps {
    proposals: Proposal[];
    onDelete?: () => void;
    onEdit?: (proposalId: string) => void;
    googleConnected?: boolean;
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
                credentials: 'include',
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

function SyncCalendarButton({ proposal, googleConnected }: { proposal: Proposal, googleConnected: boolean }) {
    const { t } = useTranslation();
    const [isSyncing, setIsSyncing] = useState(false);

    if (proposal.proposalType !== "rental" || !googleConnected) return null;

    const handleSync = async () => {
        setIsSyncing(true);
        try {
            const rd = proposal.rentalDetails;
            const startDate = rd?.startDate || proposal.createdAt;
            const endDate = rd?.endDate || new Date(new Date(startDate).getTime() + (rd?.numberOfDays || 1) * 24 * 60 * 60 * 1000).toISOString();

            const response = await fetch("/api/admin?action=google-calendar-event", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    proposalId: proposal.id,
                    title: `Devotion Sim: ${proposal.clientName}`,
                    description: `Event for ${proposal.clientName}. ${proposal.notes || ""}`,
                    startDate,
                    endDate,
                }),
                credentials: "include",
            });

            if (response.ok) {
                toast.success(t("admin.proposals.google.calendarSuccess", "Synced to Google Calendar"));
            } else {
                const data = await response.json();
                toast.error(data.error || "Failed to sync to calendar");
            }
        } catch (error) {
            console.error("Sync error:", error);
            toast.error("An error occurred during sync");
        } finally {
            setIsSyncing(false);
        }
    };

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={handleSync}
            disabled={isSyncing}
            className="h-8 px-2 hover:bg-blue-900/20 hover:text-blue-400"
            title={t("admin.proposals.google.syncCalendar", "Sync to Calendar")}
        >
            {isSyncing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
                <Calendar className="w-4 h-4" />
            )}
        </Button>
    );
}

function ProposalTable({ 
    proposals, 
    onDelete, 
    onEdit, 
    googleConnected = false, 
    showAcceptedInfo = false 
}: { 
    proposals: Proposal[], 
    onDelete?: () => void, 
    onEdit?: (id: string) => void, 
    googleConnected?: boolean, 
    showAcceptedInfo?: boolean 
}) {
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
                                <TableHead className="text-gray-400">{t('admin.proposals.acceptedOn', 'Aceptado el')}</TableHead>
                            ) : (
                                <TableHead className="text-gray-400">{t("admin.proposals.expiresAt", "Expira")}</TableHead>
                            )}
                            {showAcceptedInfo && (
                                <TableHead className="text-gray-400">{t('admin.proposals.contact', 'Contacto')}</TableHead>
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
                                        {!showAcceptedInfo && onEdit && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 px-2"
                                                onClick={() => onEdit(proposal.id)}
                                                title={t("admin.proposals.edit", "Editar")}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-gray-400"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
                                            </Button>
                                        )}
                                        <SyncCalendarButton proposal={proposal} googleConnected={googleConnected} />
                                        <CopyButton proposalId={proposal.id} />
                                        <DownloadInvoiceButton proposalId={proposal.id} clientName={proposal.clientName} />
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
                                <div className="flex flex-row items-center justify-between w-full mt-4 pt-3 border-t border-gray-700/50">
                                    {!showAcceptedInfo && onEdit && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-10 px-3 hover:bg-gray-800"
                                            onClick={() => onEdit(proposal.id)}
                                            title={t("admin.proposals.edit", "Editar")}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
                                        </Button>
                                    )}
                                    <SyncCalendarButton proposal={proposal} googleConnected={googleConnected} />
                                    <CopyButton proposalId={proposal.id} />
                                    <DownloadInvoiceButton proposalId={proposal.id} clientName={proposal.clientName} />
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-10 px-3 hover:bg-gray-800"
                                        onClick={() => window.open(`/p/${proposal.id}`, '_blank')}
                                        title={t("admin.proposals.openProposal", "Abrir")}
                                    >
                                        <ExternalLink className="w-5 h-5 text-gray-400" />
                                    </Button>
                                    <DeleteButton
                                        proposalId={proposal.id}
                                        clientName={proposal.clientName}
                                        onDelete={onDelete}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

export default function RecentProposals({ proposals, onDelete, onEdit, googleConnected = false }: RecentProposalsProps) {
    const { t } = useTranslation();

    const pending = proposals.filter(p => !p.accepted);
    const accepted = proposals.filter(p => p.accepted);

    return (
        <div className="space-y-12">
            {/* Propuestas Pendientes */}
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <h3 className="text-2xl font-semibold text-white">{t('admin.proposals.pendingTitle', 'Propuestas Pendientes')}</h3>
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
                    <ProposalTable 
                        proposals={pending} 
                        onDelete={onDelete} 
                        onEdit={onEdit} 
                        showAcceptedInfo={false} 
                        googleConnected={googleConnected} 
                    />
                )}
            </div>

            {/* Propuestas Aceptadas */}
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <h3 className="text-2xl font-semibold text-white">{t('admin.proposals.acceptedTitle', 'Propuestas Aceptadas')}</h3>
                    {accepted.length > 0 && (
                        <span className="px-2 py-0.5 text-xs bg-green-900/30 text-green-400 rounded-full border border-green-900/50">
                            {accepted.length}
                        </span>
                    )}
                </div>
                {accepted.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 border border-gray-800 rounded-lg">
                        <CheckCircle2 className="w-10 h-10 mx-auto mb-3 opacity-40" />
                        <p>{t('admin.proposals.noAccepted', 'No hay propuestas aceptadas aún')}</p>
                    </div>
                ) : (
                    <ProposalTable 
                        proposals={accepted} 
                        onDelete={onDelete} 
                        onEdit={onEdit}
                        showAcceptedInfo={true} 
                        googleConnected={googleConnected} 
                    />
                )}
            </div>
        </div>
    );
}

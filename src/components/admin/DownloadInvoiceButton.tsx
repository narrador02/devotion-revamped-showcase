import { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { Proposal } from '@/types/proposal';
import { pdf } from '@react-pdf/renderer';
import InvoicePDF from './InvoicePDF';

interface DownloadInvoiceButtonProps {
    proposalId: string;
    clientName: string;
}

export default function DownloadInvoiceButton({ proposalId, clientName }: DownloadInvoiceButtonProps) {
    const { t } = useTranslation();
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownload = async () => {
        setIsDownloading(true);
        try {
            // 1. Fetch the full proposal data using the API
            const response = await fetch(`/api/proposals/${proposalId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch full proposal data');
            }

            const data = await response.json();
            const proposal: Proposal = data.proposal;

            if (!proposal) {
                throw new Error('Proposal not found in response');
            }

            // 2. Generate the PDF Blob using @react-pdf/renderer
            const locale = localStorage.getItem('i18nextLng') || 'es';
            const blob = await pdf(<InvoicePDF proposal={proposal} locale={locale} />).toBlob();

            // 3. Create a download link and trigger it
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            // Windows filename sanitization: remove invalid characters (\ / : * ? " < > |)
            const safeClientName = clientName
                .replace(/[\\/:*?"<>|]/g, '')
                .replace(/\s+/g, '_');
                
            link.download = `Factura_${safeClientName}_${proposalId.substring(0, 8)}.pdf`;

            // Append, click, and cleanup
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

        } catch (error: any) {
            console.error("Error generating invoice:", error);
            alert(`Error al generar la factura: ${error.message || 'Error desconocido'}`);
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={handleDownload}
            disabled={isDownloading}
            className="h-8 px-2 hover:bg-gray-800"
            title={t("admin.proposals.downloadInvoice", "Descargar Factura")}
        >
            {isDownloading ? (
                <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
            ) : (
                <Download className="w-4 h-4 text-gray-400" />
            )}
        </Button>
    );
}

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
            const blob = await pdf(<InvoicePDF proposal={proposal} />).toBlob();

            // 3. Create a download link and trigger it
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `Factura_${clientName.replace(/\s+/g, '_')}_${proposalId.substring(0, 8)}.pdf`;

            // Append, click, and cleanup
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

        } catch (error) {
            console.error("Error generating invoice:", error);
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

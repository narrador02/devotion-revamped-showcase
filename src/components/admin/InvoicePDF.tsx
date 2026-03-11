import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';
import { Proposal } from '@/types/proposal';

// Note: To use custom fonts in react-pdf, we typically need to register them.
// We'll stick to built-in fonts for simplicity, or we can use Helvetica.
Font.register({
    family: 'Inter',
    fonts: [
        { src: 'https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfAZ9hjQ.ttf', fontWeight: 400 },
        { src: 'https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuGKYAZ9hjQ.ttf', fontWeight: 600 },
        { src: 'https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuFuYAZ9hjQ.ttf', fontWeight: 700 }
    ]
});

// Since we cannot easily import assets directly as URLs in the serverless/react-pdf environment without public URLs,
// we will provide the logo directly or assume it's publicly accessible in the production build.
// For now, we will use a text header if the image fails, or try to load it from the public directory:
// '/logo.png' -> https://devotion.com/logo.png for example. We'll use a placeholder URL for the Devotion logo if needed.

// Removed devLogo since we will use window.location.origin dynamically

const styles = StyleSheet.create({
    page: {
        padding: 40,
        backgroundColor: '#FFFFFF',
        fontFamily: 'Inter',
        color: '#1a1a1a',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        paddingBottom: 20,
        marginBottom: 30,
    },
    logo: {
        width: 140,
    },
    invoiceTitle: {
        fontSize: 24,
        fontWeight: 700,
        color: '#000000',
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
    infoGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 40,
    },
    infoBlock: {
        width: '45%',
    },
    label: {
        fontSize: 10,
        color: '#6B7280',
        textTransform: 'uppercase',
        marginBottom: 4,
        fontWeight: 600,
    },
    value: {
        fontSize: 12,
        fontWeight: 600,
        color: '#111827',
    },
    dateValue: {
        fontSize: 12,
        color: '#374151',
    },
    tableHeader: {
        flexDirection: 'row',
        borderBottomWidth: 2,
        borderBottomColor: '#111827',
        paddingBottom: 8,
        marginBottom: 12,
    },
    tableHeaderCell: {
        fontSize: 10,
        fontWeight: 700,
        color: '#111827',
        textTransform: 'uppercase',
    },
    tableRow: {
        flexDirection: 'row',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    tableCellDesc: {
        flex: 3,
        paddingRight: 10,
    },
    tableCellAmount: {
        flex: 1,
        textAlign: 'right',
    },
    itemName: {
        fontSize: 12,
        fontWeight: 600,
        color: '#111827',
        marginBottom: 2,
    },
    itemDesc: {
        fontSize: 10,
        color: '#6B7280',
    },
    itemPrice: {
        fontSize: 12,
        fontWeight: 600,
        color: '#111827',
    },
    summaryContainer: {
        marginTop: 30,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    summaryBox: {
        width: 250,
        borderTopWidth: 2,
        borderTopColor: '#111827',
        paddingTop: 16,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    summaryLabel: {
        fontSize: 12,
        color: '#4B5563',
        fontWeight: 600,
    },
    summaryValue: {
        fontSize: 12,
        fontWeight: 600,
        color: '#111827',
    },
    grandTotalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    grandTotalLabel: {
        fontSize: 16,
        fontWeight: 700,
        color: '#111827',
        textTransform: 'uppercase',
    },
    grandTotalValue: {
        fontSize: 18,
        fontWeight: 700,
        color: '#DC2626', // Red color for final total
    },
    footerLabel: {
        fontSize: 10,
        color: '#9CA3AF',
        textAlign: 'center',
        marginTop: 50,
    }
});

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'EUR',
        maximumFractionDigits: 0
    }).format(amount);
};

export default function InvoicePDF({ proposal, locale = 'es' }: { proposal: Proposal; locale?: string }) {
    const isSpanish = locale === 'es' || locale.startsWith('es-') || locale === 'ca' || locale.startsWith('ca-');
    const ivaLabel = isSpanish ? 'IVA (21%)' : 'VAT (21%)';
    const isRental = proposal.proposalType === 'rental';

    // Calculate subtotal based on type
    let subtotal = 0;

    if (isRental && proposal.rentalDetails) {
        const rd = proposal.rentalDetails;
        const addOns = proposal.acceptedAddOns;
        
        // Use accepted add-ons when available (i.e. client has accepted), otherwise fall back to proposal prices
        const simulatorDays = rd.numberOfDays || rd.staff?.numberOfDays || 1;
        const brandingTotal = addOns ? (addOns.branding?.price || 0) : (proposal.brandingPrices?.full || proposal.brandingPrices?.simulator || proposal.brandingPrices?.platform || 0);
        const flightCaseAmt = addOns ? (addOns.flightCase || 0) : (proposal.flightCasePrice || 0);
        const pianolaAmt = addOns ? (addOns.pianola || 0) : (proposal.pianolaPrice || 0);
        const audioAmt = addOns ? (addOns.audioSystem || 0) : (proposal.audioSystemPrice || 0);
        
        const calcSubtotal = (rd.basePrice * (rd.numberOfSimulators || 1) * simulatorDays) +
            (rd.transport?.totalCost || 0) +
            (rd.staff?.totalCost || 0) +
            flightCaseAmt +
            pianolaAmt +
            audioAmt +
            brandingTotal;

        // ALWAYS use calculated subtotal because old proposals might have saved only simulator cost under 'subtotal'.
        subtotal = calcSubtotal;
    } else if (proposal.purchaseDetails) {
        // For accepted proposals use the exact add-ons the client selected
        const addOns = proposal.acceptedAddOns as any;
        const pd = proposal.purchaseDetails;
        // Only include the accepted simulator (if proposal was accepted with one selected)
        const acceptedSim = proposal.acceptedSimulator as string | undefined;
        let simTotal = 0;
        if (acceptedSim) {
            const simKey = acceptedSim === 'Time Attack' ? 'timeAttack' : acceptedSim === 'Top Gun' ? 'topGun' : 'slady';
            simTotal = pd.packages?.[simKey] || 0;
        } else {
            simTotal = (pd.packages?.timeAttack || 0) + (pd.packages?.slady || 0) + (pd.packages?.topGun || 0);
        }
        const flightCaseAmt = addOns ? (addOns.flightCase || 0) : (proposal.flightCasePrice || 0);
        const pianolaAmt = addOns ? (addOns.pianola || 0) : (proposal.pianolaPrice || 0);
        const audioAmt = addOns ? (addOns.audioSystem || 0) : (proposal.audioSystemPrice || 0);
        const brandingAmt = addOns ? (addOns.branding?.price || 0) : (proposal.brandingPrices?.full || proposal.brandingPrices?.simulator || proposal.brandingPrices?.platform || 0);
        subtotal = simTotal + flightCaseAmt + pianolaAmt + audioAmt + brandingAmt;
    }

    const discountAmount = isRental ? (proposal.rentalDetails?.discountAmount || 0) : 0;
    const finalSubtotal = subtotal - discountAmount;
    const ivaAmount = finalSubtotal * 0.21;
    const grandTotal = finalSubtotal + ivaAmount;

    // Date formatting
    const createdDate = new Date(proposal.createdAt).toLocaleDateString('es-ES', {
        year: 'numeric', month: 'long', day: 'numeric'
    });

    const invoiceId = `FAC-${proposal.id.toUpperCase().substring(0, 8)}`;

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <Image style={styles.logo} src={typeof window !== 'undefined' ? `${window.location.origin}/logo.png` : '/logo.png'} />
                    <Text style={styles.invoiceTitle}>Factura Proforma</Text>
                </View>

                {/* Info Grid */}
                <View style={styles.infoGrid}>
                    <View style={styles.infoBlock}>
                        <Text style={styles.label}>Facturado A:</Text>
                        <Text style={styles.value}>{proposal.clientName}</Text>
                        {proposal.rentalDetails?.eventReference && (
                            <Text style={styles.dateValue}>Ref: {proposal.rentalDetails.eventReference}</Text>
                        )}
                        {!isRental && proposal.purchaseDetails?.paymentTerms && (
                            <Text style={styles.dateValue}>Pago: {proposal.purchaseDetails.paymentTerms}</Text>
                        )}
                    </View>
                    <View style={styles.infoBlock}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                            <Text style={styles.label}>Nº Factura:</Text>
                            <Text style={styles.value}>{invoiceId}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                            <Text style={styles.label}>Fecha:</Text>
                            <Text style={styles.dateValue}>{createdDate}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                            <Text style={styles.label}>Tipo:</Text>
                            <Text style={styles.dateValue}>{isRental ? 'Alquiler' : 'Compra'}</Text>
                        </View>
                    </View>
                </View>

                {/* Line Items Table */}
                <View style={styles.tableHeader}>
                    <View style={styles.tableCellDesc}>
                        <Text style={styles.tableHeaderCell}>Descripción</Text>
                    </View>
                    <View style={styles.tableCellAmount}>
                        <Text style={styles.tableHeaderCell}>Importe</Text>
                    </View>
                </View>

                {/* RENTAL ITEMS */}
                {isRental && proposal.rentalDetails && (
                    <>
                        {/* Simulator Base */}
                        <View style={styles.tableRow}>
                            <View style={styles.tableCellDesc}>
                                <Text style={styles.itemName}>
                                    Alquiler Simulador MotoGP {proposal.rentalDetails.isVIP ? 'VIP' : 'Estándar'}
                                </Text>
                                <Text style={styles.itemDesc}>
                                    {proposal.rentalDetails.numberOfSimulators} Simulador(es) x {proposal.rentalDetails.numberOfDays || proposal.rentalDetails.staff?.numberOfDays || 1} día(s)
                                </Text>
                            </View>
                            <View style={styles.tableCellAmount}>
                                <Text style={styles.itemPrice}>
                                    {formatCurrency((proposal.rentalDetails.basePrice) * (proposal.rentalDetails.numberOfSimulators || 1) * (proposal.rentalDetails.numberOfDays || proposal.rentalDetails.staff?.numberOfDays || 1))}
                                </Text>
                            </View>
                        </View>

                        {/* Transport */}
                        {proposal.rentalDetails.transport && proposal.rentalDetails.transport.totalCost > 0 && (
                            <View style={styles.tableRow}>
                                <View style={styles.tableCellDesc}>
                                    <Text style={styles.itemName}>Transporte y Logística</Text>
                                    <Text style={styles.itemDesc}>{proposal.rentalDetails.transport.kilometers} km (Ida y vuelta)</Text>
                                </View>
                                <View style={styles.tableCellAmount}>
                                    <Text style={styles.itemPrice}>{formatCurrency(proposal.rentalDetails.transport.totalCost)}</Text>
                                </View>
                            </View>
                        )}

                        {/* Staff */}
                        {proposal.rentalDetails.staff && proposal.rentalDetails.staff.totalCost > 0 && (
                            <View style={styles.tableRow}>
                                <View style={styles.tableCellDesc}>
                                    <Text style={styles.itemName}>Personal Técnico</Text>
                                    <Text style={styles.itemDesc}>
                                        {proposal.rentalDetails.staff.numberOfStaff} Técnico(s) x {proposal.rentalDetails.staff.numberOfDays} día(s)
                                    </Text>
                                </View>
                                <View style={styles.tableCellAmount}>
                                    <Text style={styles.itemPrice}>{formatCurrency(proposal.rentalDetails.staff.totalCost)}</Text>
                                </View>
                            </View>
                        )}

                        {/* Add-ons for Rental — use acceptedAddOns when available */}
                        {(() => {
                            const addOns = proposal.acceptedAddOns;
                            const flightCaseAmt: number = addOns ? (addOns.flightCase || 0) : (proposal.flightCasePrice || 0);
                            const pianolaAmt: number = addOns ? (addOns.pianola || 0) : (proposal.pianolaPrice || 0);
                            const audioAmt: number = addOns ? (addOns.audioSystem || 0) : (proposal.audioSystemPrice || 0);
                            const brandingAmt: number = addOns ? (addOns.branding?.price || 0) : 0;
                            const brandingLabel: string = addOns?.branding?.label || 'Branding';
                            return (
                                <>
                                    {flightCaseAmt > 0 && (
                                        <View style={styles.tableRow}>
                                            <View style={styles.tableCellDesc}>
                                                <Text style={styles.itemName}>Flight Case de transporte profesional</Text>
                                            </View>
                                            <View style={styles.tableCellAmount}>
                                                <Text style={styles.itemPrice}>{formatCurrency(flightCaseAmt)}</Text>
                                            </View>
                                        </View>
                                    )}
                                    {pianolaAmt > 0 && (
                                        <View style={styles.tableRow}>
                                            <View style={styles.tableCellDesc}>
                                                <Text style={styles.itemName}>Sistema de Pianolas (Movilidad)</Text>
                                            </View>
                                            <View style={styles.tableCellAmount}>
                                                <Text style={styles.itemPrice}>{formatCurrency(pianolaAmt)}</Text>
                                            </View>
                                        </View>
                                    )}
                                    {audioAmt > 0 && (
                                        <View style={styles.tableRow}>
                                            <View style={styles.tableCellDesc}>
                                                <Text style={styles.itemName}>Sistema de Audio Profesional 2.1</Text>
                                            </View>
                                            <View style={styles.tableCellAmount}>
                                                <Text style={styles.itemPrice}>{formatCurrency(audioAmt)}</Text>
                                            </View>
                                        </View>
                                    )}
                                    {brandingAmt > 0 && (
                                        <View style={styles.tableRow}>
                                            <View style={styles.tableCellDesc}>
                                                <Text style={styles.itemName}>Branding: {brandingLabel}</Text>
                                            </View>
                                            <View style={styles.tableCellAmount}>
                                                <Text style={styles.itemPrice}>{formatCurrency(brandingAmt)}</Text>
                                            </View>
                                        </View>
                                    )}
                                </>
                            );
                        })()}
                    </>
                )}

                {/* PURCHASE ITEMS */}
                {!isRental && proposal.purchaseDetails && (() => {
                    const addOns = proposal.acceptedAddOns as any;
                    const acceptedSim = proposal.acceptedSimulator as string | undefined;
                    const pd = proposal.purchaseDetails;
                    const flightCaseAmt: number = addOns ? (addOns.flightCase || 0) : (proposal.flightCasePrice || 0);
                    const pianolaAmt: number = addOns ? (addOns.pianola || 0) : (proposal.pianolaPrice || 0);
                    const audioAmt: number = addOns ? (addOns.audioSystem || 0) : (proposal.audioSystemPrice || 0);
                    const brandingAmt: number = addOns ? (addOns.branding?.price || 0) : 0;
                    const brandingLabel: string = addOns?.branding?.label || '';

                    // Determine which simulators to show
                    const showTimeAttack = !acceptedSim ? pd.packages?.timeAttack > 0 : acceptedSim === 'Time Attack';
                    const showSlady = !acceptedSim ? pd.packages?.slady > 0 : acceptedSim === 'Slady';
                    const showTopGun = !acceptedSim ? pd.packages?.topGun > 0 : acceptedSim === 'Top Gun';

                    return (
                        <>
                            {showTimeAttack && (
                                <View style={styles.tableRow}>
                                    <View style={styles.tableCellDesc}>
                                        <Text style={styles.itemName}>Simulador MotoGP - Time Attack</Text>
                                    </View>
                                    <View style={styles.tableCellAmount}>
                                        <Text style={styles.itemPrice}>{formatCurrency(pd.packages.timeAttack)}</Text>
                                    </View>
                                </View>
                            )}
                            {showSlady && (
                                <View style={styles.tableRow}>
                                    <View style={styles.tableCellDesc}>
                                        <Text style={styles.itemName}>Simulador MotoGP - Slady</Text>
                                    </View>
                                    <View style={styles.tableCellAmount}>
                                        <Text style={styles.itemPrice}>{formatCurrency(pd.packages.slady)}</Text>
                                    </View>
                                </View>
                            )}
                            {showTopGun && (
                                <View style={styles.tableRow}>
                                    <View style={styles.tableCellDesc}>
                                        <Text style={styles.itemName}>Simulador MotoGP - Top Gun</Text>
                                    </View>
                                    <View style={styles.tableCellAmount}>
                                        <Text style={styles.itemPrice}>{formatCurrency(pd.packages.topGun)}</Text>
                                    </View>
                                </View>
                            )}

                            {/* Purchase Add-ons — only those the client selected */}
                            {flightCaseAmt > 0 && (
                                <View style={styles.tableRow}>
                                    <View style={styles.tableCellDesc}>
                                        <Text style={styles.itemName}>Flight Case</Text>
                                        <Text style={styles.itemDesc}>Maleta de transporte a medida</Text>
                                    </View>
                                    <View style={styles.tableCellAmount}>
                                        <Text style={styles.itemPrice}>{formatCurrency(flightCaseAmt)}</Text>
                                    </View>
                                </View>
                            )}
                            {pianolaAmt > 0 && (
                                <View style={styles.tableRow}>
                                    <View style={styles.tableCellDesc}>
                                        <Text style={styles.itemName}>Pianos</Text>
                                        <Text style={styles.itemDesc}>Simulación extrema de paso por curva</Text>
                                    </View>
                                    <View style={styles.tableCellAmount}>
                                        <Text style={styles.itemPrice}>{formatCurrency(pianolaAmt)}</Text>
                                    </View>
                                </View>
                            )}
                            {audioAmt > 0 && (
                                <View style={styles.tableRow}>
                                    <View style={styles.tableCellDesc}>
                                        <Text style={styles.itemName}>Sistema de Audio Profesional</Text>
                                        <Text style={styles.itemDesc}>Altavoces 2.1 + Bass Shaker</Text>
                                    </View>
                                    <View style={styles.tableCellAmount}>
                                        <Text style={styles.itemPrice}>{formatCurrency(audioAmt)}</Text>
                                    </View>
                                </View>
                            )}
                            {brandingAmt > 0 && (
                                <View style={styles.tableRow}>
                                    <View style={styles.tableCellDesc}>
                                        <Text style={styles.itemName}>Branding: {brandingLabel}</Text>
                                    </View>
                                    <View style={styles.tableCellAmount}>
                                        <Text style={styles.itemPrice}>{formatCurrency(brandingAmt)}</Text>
                                    </View>
                                </View>
                            )}
                        </>
                    );
                })()}


                {/* Summary */}
                <View style={styles.summaryContainer}>
                    <View style={styles.summaryBox}>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Subtotal</Text>
                            <Text style={styles.summaryValue}>{formatCurrency(subtotal)}</Text>
                        </View>

                        {discountAmount > 0 && (
                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryLabel}>Descuento ({proposal.rentalDetails?.discountConcept || 'Promo'})</Text>
                                <Text style={[styles.summaryValue, { color: '#059669' }]}>-{formatCurrency(discountAmount)}</Text>
                            </View>
                        )}

                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Base Imponible</Text>
                            <Text style={styles.summaryValue}>{formatCurrency(finalSubtotal)}</Text>
                        </View>

                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>{ivaLabel}</Text>
                            <Text style={styles.summaryValue}>{formatCurrency(ivaAmount)}</Text>
                        </View>

                        <View style={styles.grandTotalRow}>
                            <Text style={styles.grandTotalLabel}>Total</Text>
                            <Text style={styles.grandTotalValue}>{formatCurrency(grandTotal)}</Text>
                        </View>
                    </View>
                </View>

                {/* Footer */}
                <Text style={styles.footerLabel}>Gracias por confiar en Devotion Simulators. Esta es una factura proforma generada automáticamente.</Text>

            </Page>
        </Document>
    );
}

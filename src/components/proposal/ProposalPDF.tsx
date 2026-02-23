import { Document, Page, Text, View, StyleSheet, Image, Font } from "@react-pdf/renderer";
import { Proposal } from "@/types/proposal";

// Register fonts
Font.register({
    family: "Inter",
    fonts: [
        { src: "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.ttf" },
        { src: "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fAZ9hjp-Ek-_EeA.ttf", fontWeight: "bold" },
    ],
});

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontFamily: "Inter",
        backgroundColor: "#FFFFFF",
        color: "#111827",
    },
    header: {
        marginBottom: 40,
        textAlign: "center",
    },
    logo: {
        height: 80,
        marginBottom: 20,
        objectFit: "contain",
        marginHorizontal: "auto",
    },
    preparedFor: {
        fontSize: 10,
        textTransform: "uppercase",
        color: "#EF4444", // Red-500
        marginBottom: 5,
        letterSpacing: 2,
    },
    clientName: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },
    personalMessage: {
        fontSize: 12,
        fontStyle: "italic",
        color: "#4B5563",
        textAlign: "center",
        marginBottom: 30,
        paddingHorizontal: 40,
        lineHeight: 1.5,
    },
    section: {
        marginBottom: 30,
        padding: 20,
        backgroundColor: "#F9FAFB",
        borderRadius: 8,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: "bold",
        textTransform: "uppercase",
        marginBottom: 15,
        color: "#374151",
        borderBottomWidth: 1,
        borderBottomColor: "#E5E7EB",
        paddingBottom: 5,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8,
        fontSize: 10,
    },
    totalRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: "#D1D5DB",
        fontSize: 12,
        fontWeight: "bold",
        color: "#EF4444",
    },
    label: {
        color: "#4B5563",
    },
    value: {
        color: "#111827",
        fontWeight: "bold",
    },
    notes: {
        fontSize: 10,
        color: "#6B7280",
        marginTop: 30,
        lineHeight: 1.5,
        borderTopWidth: 1,
        borderTopColor: "#E5E7EB",
        paddingTop: 15,
    },
    footer: {
        position: "absolute",
        bottom: 30,
        left: 40,
        right: 40,
        textAlign: "center",
        fontSize: 9,
        color: "#9CA3AF",
        borderTopWidth: 1,
        borderTopColor: "#E5E7EB",
        paddingTop: 10,
    },
    // Purchase specific
    grid: {
        flexDirection: "row",
        gap: 10,
    },
    card: {
        flex: 1,
        padding: 10,
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 4,
        alignItems: "center",
    },
    cardTitle: {
        fontSize: 10,
        textTransform: "uppercase",
        marginBottom: 10,
        color: "#6B7280",
    },
    cardPrice: {
        fontSize: 14,
        fontWeight: "bold",
    },
    vipBadge: {
        backgroundColor: "#FEF2F2",
        color: "#EF4444",
        fontSize: 8,
        padding: 4,
        borderRadius: 4,
        marginTop: 5,
        alignSelf: "center",
    },
});

interface ProposalPDFProps {
    proposal: Proposal;
}

export default function ProposalPDF({ proposal }: ProposalPDFProps) {
    const { proposalType, rentalDetails, purchaseDetails } = proposal;

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <Image src={proposal.clientLogoUrl} style={styles.logo} />
                    <Text style={styles.preparedFor}>Propuesta preparada para</Text>
                    <Text style={styles.clientName}>{proposal.clientName}</Text>
                    {proposal.personalMessage && (
                        <Text style={styles.personalMessage}>"{proposal.personalMessage}"</Text>
                    )}
                </View>

                {/* Rental Proposal Content */}
                {proposalType === "rental" && rentalDetails && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Detalles del Alquiler</Text>

                        <View style={styles.row}>
                            <Text style={styles.label}>
                                Simuladores ({rentalDetails.numberOfSimulators}x)
                            </Text>
                            <Text style={styles.value}>{rentalDetails.subtotal.toLocaleString()}€</Text>
                        </View>

                        {rentalDetails.isVIP && (
                            <View style={styles.row}>
                                <Text style={{ ...styles.label, fontSize: 8 }}>Tarifa VIP aplicada</Text>
                            </View>
                        )}

                        {rentalDetails.transport && (
                            <View style={styles.row}>
                                <Text style={styles.label}>
                                    Transporte ({rentalDetails.transport.kilometers}km)
                                </Text>
                                <Text style={styles.value}>
                                    {rentalDetails.transport.totalCost.toLocaleString()}€
                                </Text>
                            </View>
                        )}

                        {rentalDetails.staff && (
                            <>
                                <View style={styles.row}>
                                    <Text style={styles.label}>
                                        Staff ({rentalDetails.staff.numberOfStaff} técnicos x {rentalDetails.staff.numberOfDays} días)
                                    </Text>
                                    <Text style={styles.value}>
                                        {(rentalDetails.staff.numberOfStaff! * rentalDetails.staff.numberOfDays! * rentalDetails.staff.pricePerStaffDay).toLocaleString()}€
                                    </Text>
                                </View>
                                {(rentalDetails.staff.travelExpenses || 0) > 0 && (
                                    <View style={styles.row}>
                                        <Text style={[styles.label, { paddingLeft: 10 }]}>- Gastos de viaje</Text>
                                        <Text style={styles.value}>{rentalDetails.staff.travelExpenses}€</Text>
                                    </View>
                                )}
                                {(rentalDetails.staff.hotelExpenses || 0) > 0 && (
                                    <View style={styles.row}>
                                        <Text style={[styles.label, { paddingLeft: 10 }]}>- Dietas / Hotel</Text>
                                        <Text style={styles.value}>{rentalDetails.staff.hotelExpenses}€</Text>
                                    </View>
                                )}
                            </>
                        )}

                        <View style={styles.totalRow}>
                            <Text>TOTAL ESTIMADO (Sin IVA)</Text>
                            <Text>{rentalDetails.total.toLocaleString("es-ES")}€</Text>
                        </View>

                        {(!rentalDetails.transport || !rentalDetails.staff) && (
                            <Text style={{ fontSize: 8, color: "#9CA3AF", marginTop: 10, fontStyle: "italic" }}>
                                * Precios de transporte del simulador y staff no incluidos salvo que se especifique. IVA no incluido.
                            </Text>
                        )}
                    </View>
                )}

                {/* Purchase Proposal Content */}
                {proposalType === "purchase" && purchaseDetails && (
                    <>
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Opciones de Compra</Text>
                            <View style={styles.grid}>
                                <View style={styles.card}>
                                    <Text style={styles.cardTitle}>Time Attack</Text>
                                    <Text style={styles.cardPrice}>{purchaseDetails.packages.timeAttack.toLocaleString("es-ES")}€</Text>
                                </View>
                                <View style={[styles.card, { borderColor: "#EF4444", borderWidth: 2 }]}>
                                    <Text style={[styles.cardTitle, { color: "#EF4444" }]}>Slady</Text>
                                    <Text style={styles.cardPrice}>{purchaseDetails.packages.slady.toLocaleString("es-ES")}€</Text>
                                </View>
                                <View style={styles.card}>
                                    <Text style={styles.cardTitle}>Top Gun</Text>
                                    <Text style={styles.cardPrice}>{purchaseDetails.packages.topGun.toLocaleString("es-ES")}€</Text>
                                </View>
                            </View>
                        </View>

                        {purchaseDetails.paymentTerms && (
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Condiciones de Pago</Text>
                                <Text style={{ fontSize: 10, lineHeight: 1.5 }}>{purchaseDetails.paymentTerms}</Text>
                            </View>
                        )}
                    </>
                )}

                {/* Notes */}
                {proposal.notes && (
                    <View style={styles.notes}>
                        <Text style={{ fontWeight: "bold", marginBottom: 5 }}>Notas Adicionales:</Text>
                        <Text>{proposal.notes}</Text>
                    </View>
                )}

                {/* Footer */}
                <View style={styles.footer}>
                    <Text>DevotionSim - MotoGP Simulator Showcase</Text>
                    <Text>Generado el {formatDate(proposal.createdAt)} • Validez: 15 días</Text>
                </View>
            </Page>
        </Document>
    );
}

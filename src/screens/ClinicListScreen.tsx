import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import MaterialIcons from "@expo/vector-icons/MaterialIcons"
import { useState } from "react"

import { useClinics } from "../hooks/useClinics"
import { usePlansByClinic } from "../hooks/usePlans"
import LoadingView from "../components/LoadingView"
import ErrorView from "../components/ErrorView"
import { getApiErrorMessage } from "../api/client"
import { Clinic } from "../types/api"
import { colors } from "../theme/colors"

function ClinicCard({ clinic }: { clinic: Clinic }) {
    const [isOpen, setIsOpen] = useState(false)
    const { data: plans, isLoading: plansLoading } = usePlansByClinic(clinic.id, isOpen)

    return (
        <View style={styles.card}>
            <TouchableOpacity style={styles.cardHeader} onPress={() => setIsOpen(!isOpen)}>
                <View style={styles.iconBox}>
                    <MaterialIcons name="local-hospital" size={26} color={colors.primary} />
                </View>
                <View style={styles.cardInfo}>
                    <Text style={styles.clinicName}>{clinic.name}</Text>
                    {!!clinic.address && (
                        <Text style={styles.clinicAddress} numberOfLines={1}>{clinic.address}</Text>
                    )}
                </View>
                <MaterialIcons name={isOpen ? "expand-less" : "expand-more"} size={24} color={colors.textMuted} />
            </TouchableOpacity>

            {isOpen && (
                <View style={styles.cardBody}>
                    {!!clinic.phone && (
                        <View style={styles.contactRow}>
                            <MaterialIcons name="phone" size={16} color={colors.textSecondary} />
                            <Text style={styles.contactText}>{clinic.phone}</Text>
                        </View>
                    )}
                    <View style={styles.contactRow}>
                        <MaterialIcons name="business" size={16} color={colors.textSecondary} />
                        <Text style={styles.contactText}>CNPJ: {clinic.cnpj}</Text>
                    </View>

                    <Text style={styles.subSection}>PLANOS DISPONÍVEIS</Text>
                    {plansLoading ? (
                        <ActivityIndicator color={colors.primary} style={{ marginTop: 8 }} />
                    ) : !plans || plans.length === 0 ? (
                        <Text style={styles.noPlans}>Nenhum plano cadastrado</Text>
                    ) : (
                        plans.map(plan => (
                            <View key={plan.id} style={styles.planBox}>
                                <View style={styles.planTitleRow}>
                                    <Text style={styles.planName}>{plan.name}</Text>
                                    <Text style={styles.planPrice}>
                                        R$ {plan.price.toFixed(2).replace('.', ',')}
                                    </Text>
                                </View>
                                {!!plan.description && <Text style={styles.planDesc}>{plan.description}</Text>}
                                <View style={styles.benefitRow}>
                                    <MaterialIcons name="check" size={14} color={colors.primary} />
                                    <Text style={styles.benefitText}>
                                        {plan.pointsPerEvent} pts por evento • {plan.durationDays} dias
                                    </Text>
                                </View>
                            </View>
                        ))
                    )}
                </View>
            )}
        </View>
    )
}

export default function ClinicListScreen() {
    const { data: clinics, isLoading, isError, error, isFetching, refetch } = useClinics()

    if (isLoading) {
        return (
            <SafeAreaView style={styles.container}>
                <LoadingView label="Carregando clínicas..." />
            </SafeAreaView>
        )
    }

    if (isError) {
        return (
            <SafeAreaView style={styles.container}>
                <ErrorView message={getApiErrorMessage(error)} onRetry={() => refetch()} />
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Clínicas</Text>
                <Text style={styles.subtitle}>{clinics?.length ?? 0} parceiras</Text>
            </View>

            <ScrollView
                style={styles.list}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={isFetching && !isLoading} onRefresh={refetch} colors={[colors.primary]} />
                }
            >
                {clinics?.map(clinic => (
                    <ClinicCard key={clinic.id} clinic={clinic} />
                ))}
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        paddingTop: 20,
        paddingHorizontal: 20,
    },
    header: { marginBottom: 16 },
    title: {
        fontSize: 36,
        fontWeight: 'bold',
        color: colors.textPrimary,
    },
    subtitle: {
        fontSize: 14,
        color: colors.textSecondary,
        marginTop: 4,
    },
    list: {
        flex: 1,
    },
    card: {
        backgroundColor: colors.surface,
        borderRadius: 12,
        marginBottom: 12,
        overflow: 'hidden',
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
    },
    iconBox: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: colors.primaryLight,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    cardInfo: {
        flex: 1,
    },
    clinicName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.textPrimary,
    },
    clinicAddress: {
        fontSize: 12,
        color: colors.textSecondary,
        marginTop: 2,
    },
    cardBody: {
        padding: 14,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    contactRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 6,
    },
    contactText: {
        fontSize: 13,
        color: '#444',
    },
    subSection: {
        fontSize: 11,
        color: colors.textLabel,
        marginTop: 14,
        marginBottom: 8,
    },
    noPlans: {
        fontSize: 13,
        color: colors.textMuted,
    },
    planBox: {
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        padding: 12,
        marginTop: 8,
    },
    planTitleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    planName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.textPrimary,
    },
    planPrice: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.primary,
    },
    planDesc: {
        fontSize: 12,
        color: colors.textSecondary,
        marginTop: 4,
        marginBottom: 6,
    },
    benefitRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 2,
    },
    benefitText: {
        fontSize: 12,
        color: '#444',
    },
})

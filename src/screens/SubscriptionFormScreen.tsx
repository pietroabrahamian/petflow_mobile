import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Alert,
    ActivityIndicator,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { useLayoutEffect, useState } from "react"

import { useCreateSubscription } from "../hooks/useSubscriptions"
import { useClinics } from "../hooks/useClinics"
import { usePlansByClinic } from "../hooks/usePlans"
import InlineRetry from "../components/InlineRetry"
import { getApiErrorMessage } from "../api/client"
import { parseDateBR, isValidDateBR } from "../utils/date"
import { AppStackParamList } from "../navigation/types"
import { colors } from "../theme/colors"

function todayBR(): string {
    const hoje = new Date()
    const dd = String(hoje.getDate()).padStart(2, "0")
    const mm = String(hoje.getMonth() + 1).padStart(2, "0")
    return `${dd}/${mm}/${hoje.getFullYear()}`
}

export default function SubscriptionFormScreen() {
    const route = useRoute<RouteProp<AppStackParamList, "SubscriptionFormScreen">>()
    const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>()
    const { petId } = route.params

    const { data: clinics, isLoading: clinicsLoading, isError: clinicsError, refetch: refetchClinics } = useClinics()
    const [clinicId, setClinicId] = useState<number | null>(null)
    const { data: plans, isLoading: plansLoading, isError: plansError, refetch: refetchPlans } = usePlansByClinic(clinicId ?? 0, clinicId != null)
    const [planId, setPlanId] = useState<number | null>(null)
    const [startDate, setStartDate] = useState(todayBR())

    const createSubscription = useCreateSubscription()

    useLayoutEffect(() => {
        navigation.setOptions({ title: "Vincular Convênio" })
    }, [])

    const handleSelectClinic = (id: number) => {
        setClinicId(id)
        setPlanId(null)
    }

    const handleSave = async () => {
        if (!isValidDateBR(startDate)) {
            Alert.alert("Data inválida", "Digite uma data de início válida no formato DD/MM/AAAA")
            return
        }
        if (planId == null) {
            Alert.alert("Campo inválido", "Selecione um plano")
            return
        }

        try {
            await createSubscription.mutateAsync({
                startDate: parseDateBR(startDate),
                status: "ATIVO",
                petId,
                planId,
            })
            navigation.goBack()
        } catch (error) {
            Alert.alert("Ops!", getApiErrorMessage(error, "Não foi possível vincular o convênio."))
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={{ padding: 20, backgroundColor: colors.background }}>

                <Text style={styles.sectionTitle}>CLÍNICA</Text>
                {clinicsLoading ? (
                    <ActivityIndicator color={colors.primary} style={{ marginVertical: 16 }} />
                ) : clinicsError ? (
                    <InlineRetry message="Não foi possível carregar as clínicas." onRetry={() => refetchClinics()} />
                ) : !clinics || clinics.length === 0 ? (
                    <Text style={styles.emptyText}>Nenhuma clínica cadastrada</Text>
                ) : (
                    <View style={styles.optionsRow}>
                        {clinics.map(clinic => (
                            <TouchableOpacity
                                key={clinic.id}
                                style={[styles.option, clinicId === clinic.id && styles.optionActive]}
                                onPress={() => handleSelectClinic(clinic.id)}
                            >
                                <Text style={[styles.optionText, clinicId === clinic.id && styles.optionTextActive]} numberOfLines={1}>
                                    {clinic.name}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                <Text style={styles.sectionTitle}>PLANO</Text>
                {clinicId == null ? (
                    <Text style={styles.emptyText}>Selecione uma clínica para ver os planos</Text>
                ) : plansLoading ? (
                    <ActivityIndicator color={colors.primary} style={{ marginVertical: 16 }} />
                ) : plansError ? (
                    <InlineRetry message="Não foi possível carregar os planos." onRetry={() => refetchPlans()} />
                ) : !plans || plans.length === 0 ? (
                    <Text style={styles.emptyText}>Essa clínica não tem planos cadastrados</Text>
                ) : (
                    <View style={styles.optionsRow}>
                        {plans.map(plan => (
                            <TouchableOpacity
                                key={plan.id}
                                style={[styles.planOption, planId === plan.id && styles.optionActive]}
                                onPress={() => setPlanId(plan.id)}
                            >
                                <Text style={[styles.optionText, planId === plan.id && styles.optionTextActive]}>
                                    {plan.name}
                                </Text>
                                <Text style={styles.planDetails}>
                                    R$ {plan.price.toFixed(2)} · {plan.durationDays} dias
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                <Text style={styles.sectionTitle}>DATA DE INÍCIO</Text>
                <TextInput
                    style={styles.input}
                    value={startDate}
                    onChangeText={setStartDate}
                    placeholder="DD/MM/AAAA"
                    keyboardType="numeric"
                />

            </ScrollView>

            <View style={styles.buttonArea}>
                <TouchableOpacity onPress={handleSave} style={styles.button} disabled={createSubscription.isPending}>
                    {createSubscription.isPending ? (
                        <ActivityIndicator color={colors.surface} />
                    ) : (
                        <Text style={{ color: 'white', fontSize: 18 }}>Vincular Convênio</Text>
                    )}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.surface,
    },
    sectionTitle: {
        fontSize: 12,
        color: colors.formLabel,
        marginTop: 4,
    },
    emptyText: {
        color: colors.textMuted,
        fontSize: 13,
        marginTop: 10,
        marginBottom: 20,
    },
    input: {
        height: 42,
        backgroundColor: 'white',
        borderRadius: 8,
        paddingHorizontal: 10,
        marginTop: 10,
        marginBottom: 20,
    },
    optionsRow: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 10,
        marginBottom: 20,
        flexWrap: 'wrap',
    },
    option: {
        flexGrow: 1,
        minWidth: 90,
        maxWidth: '100%',
        height: 42,
        borderRadius: 8,
        backgroundColor: colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
        borderColor: colors.borderStrong,
        paddingHorizontal: 10,
    },
    planOption: {
        flexGrow: 1,
        minWidth: 140,
        borderRadius: 8,
        backgroundColor: colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
        borderColor: colors.borderStrong,
        paddingHorizontal: 10,
        paddingVertical: 10,
    },
    planDetails: {
        color: colors.textMuted,
        fontSize: 11,
        marginTop: 2,
    },
    optionActive: {
        borderColor: colors.primary,
        backgroundColor: colors.primaryLight,
    },
    optionText: {
        color: colors.textSecondary,
        fontWeight: '500',
    },
    optionTextActive: {
        color: colors.primary,
        fontWeight: 'bold',
    },
    buttonArea: {
        paddingHorizontal: 20,
        paddingVertical: 20,
        backgroundColor: 'white',
        height: 86,
    },
    button: {
        flex: 1,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
    },
})

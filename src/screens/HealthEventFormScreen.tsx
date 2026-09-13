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
import { useEffect, useLayoutEffect, useState } from "react"

import { useCreateHealthEvent, useUpdateHealthEvent } from "../hooks/useHealthEvents"
import { useEventTypes } from "../hooks/useReferenceData"
import { useClinics } from "../hooks/useClinics"
import InlineRetry from "../components/InlineRetry"
import { getApiErrorMessage } from "../api/client"
import { formatDateBR, parseDateBR, isValidDateBR } from "../utils/date"
import { AppStackParamList } from "../navigation/types"
import { HealthEventStatus } from "../types/api"
import { colors } from "../theme/colors"

const STATUS_OPTIONS: { value: HealthEventStatus; label: string }[] = [
    { value: "AGENDADO", label: "Agendado" },
    { value: "REALIZADO", label: "Realizado" },
    { value: "CANCELADO", label: "Cancelado" },
]

export default function HealthEventFormScreen() {
    const route = useRoute<RouteProp<AppStackParamList, "HealthEventFormScreen">>()
    const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>()
    const { petId, event } = route.params

    const { data: eventTypes, isLoading: eventTypesLoading, isError: eventTypesError, refetch: refetchEventTypes } = useEventTypes()
    const { data: clinics, isLoading: clinicsLoading, isError: clinicsError, refetch: refetchClinics } = useClinics()
    const createEvent = useCreateHealthEvent()
    const updateEvent = useUpdateHealthEvent()
    const isSaving = createEvent.isPending || updateEvent.isPending

    const [description, setDescription] = useState(event?.description ?? "")
    const [eventDate, setEventDate] = useState(event ? formatDateBR(event.eventDate) : "")
    const [status, setStatus] = useState<HealthEventStatus>(event?.status ?? "AGENDADO")
    const [eventTypeId, setEventTypeId] = useState<number | null>(event?.eventTypeId ?? null)
    const [clinicId, setClinicId] = useState<number | null>(event?.clinicId ?? null)

    useLayoutEffect(() => {
        navigation.setOptions({ title: event ? "Editar Evento" : "Novo Evento de Saúde" })
    }, [])

    useEffect(() => {
        if (!event && eventTypes && eventTypes.length > 0 && eventTypeId == null) {
            setEventTypeId(eventTypes[0].id)
        }
    }, [eventTypes])

    const handleSave = async () => {
        if (!isValidDateBR(eventDate)) {
            Alert.alert("Data inválida", "Digite uma data válida no formato DD/MM/AAAA")
            return
        }
        if (eventTypeId == null) {
            Alert.alert("Campo inválido", "Selecione o tipo de evento")
            return
        }

        const payload = {
            description: description.trim() || undefined,
            eventDate: parseDateBR(eventDate),
            status,
            petId,
            eventTypeId,
            clinicId: clinicId ?? undefined,
        }

        try {
            if (event) {
                await updateEvent.mutateAsync({ id: event.id, payload })
            } else {
                await createEvent.mutateAsync(payload)
            }
            navigation.goBack()
        } catch (error) {
            Alert.alert("Ops!", getApiErrorMessage(error, "Não foi possível salvar o evento."))
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={{ padding: 20, backgroundColor: colors.background }}>

                <Text style={styles.sectionTitle}>TIPO DE EVENTO</Text>
                {eventTypesLoading ? (
                    <ActivityIndicator color={colors.primary} style={{ marginVertical: 16 }} />
                ) : eventTypesError ? (
                    <InlineRetry message="Não foi possível carregar os tipos de evento." onRetry={() => refetchEventTypes()} />
                ) : (
                    <View style={styles.optionsRow}>
                        {eventTypes?.map(type => (
                            <TouchableOpacity
                                key={type.id}
                                style={[styles.option, eventTypeId === type.id && styles.optionActive]}
                                onPress={() => setEventTypeId(type.id)}
                            >
                                <Text style={[styles.optionText, eventTypeId === type.id && styles.optionTextActive]}>
                                    {type.name}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                <Text style={styles.sectionTitle}>DATA DO EVENTO</Text>
                <TextInput
                    style={styles.input}
                    value={eventDate}
                    onChangeText={setEventDate}
                    placeholder="DD/MM/AAAA"
                    keyboardType="numeric"
                />

                <Text style={styles.sectionTitle}>STATUS</Text>
                <View style={styles.optionsRow}>
                    {STATUS_OPTIONS.map(opt => (
                        <TouchableOpacity
                            key={opt.value}
                            style={[styles.option, status === opt.value && styles.optionActive]}
                            onPress={() => setStatus(opt.value)}
                        >
                            <Text style={[styles.optionText, status === opt.value && styles.optionTextActive]}>
                                {opt.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <Text style={styles.sectionTitle}>CLÍNICA (OPCIONAL)</Text>
                {clinicsLoading ? (
                    <ActivityIndicator color={colors.primary} style={{ marginVertical: 16 }} />
                ) : clinicsError ? (
                    <InlineRetry message="Não foi possível carregar as clínicas." onRetry={() => refetchClinics()} />
                ) : (
                    <View style={styles.optionsRow}>
                        <TouchableOpacity
                            style={[styles.option, clinicId === null && styles.optionActive]}
                            onPress={() => setClinicId(null)}
                        >
                            <Text style={[styles.optionText, clinicId === null && styles.optionTextActive]}>Nenhuma</Text>
                        </TouchableOpacity>
                        {clinics?.map(clinic => (
                            <TouchableOpacity
                                key={clinic.id}
                                style={[styles.option, clinicId === clinic.id && styles.optionActive]}
                                onPress={() => setClinicId(clinic.id)}
                            >
                                <Text style={[styles.optionText, clinicId === clinic.id && styles.optionTextActive]} numberOfLines={1}>
                                    {clinic.name}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                <Text style={styles.sectionTitle}>OBSERVAÇÕES</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    value={description}
                    onChangeText={setDescription}
                    placeholder="Ex: Vacina antirrábica aplicada, sem reações"
                    multiline
                    numberOfLines={3}
                />

            </ScrollView>

            <View style={styles.buttonArea}>
                <TouchableOpacity onPress={handleSave} style={styles.button} disabled={isSaving}>
                    {isSaving ? (
                        <ActivityIndicator color={colors.surface} />
                    ) : (
                        <Text style={{ color: 'white', fontSize: 18 }}>
                            {event ? "Salvar Alterações" : "Registrar Evento"}
                        </Text>
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
    input: {
        height: 42,
        backgroundColor: 'white',
        borderRadius: 8,
        paddingHorizontal: 10,
        marginTop: 10,
        marginBottom: 20,
    },
    textArea: {
        height: 80,
        paddingTop: 10,
        textAlignVertical: 'top',
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

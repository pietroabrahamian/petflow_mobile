import {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
} from "react-native"
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { SafeAreaView } from "react-native-safe-area-context"
import MaterialIcons from "@expo/vector-icons/MaterialIcons"
import { useEffect, useState } from "react"

import { getPetImageSource } from "../utils/petImages"
import { getPetPhoto } from "../utils/petPhotoStore"
import { usePet, useDeletePet } from "../hooks/usePets"
import { useHealthEvents, useDeleteHealthEvent } from "../hooks/useHealthEvents"
import { useSubscriptions, useUpdateSubscriptionStatus } from "../hooks/useSubscriptions"
import { useSpecies } from "../hooks/useReferenceData"
import { getApiErrorMessage } from "../api/client"
import { formatDateBR, getAgeInYears } from "../utils/date"
import LoadingView from "../components/LoadingView"
import ErrorView from "../components/ErrorView"
import { AppStackParamList } from "../navigation/types"
import { colors } from "../theme/colors"

const STATUS_LABEL: Record<string, string> = {
    AGENDADO: "Agendado",
    REALIZADO: "Realizado",
    CANCELADO: "Cancelado",
}

export default function PetDetailsScreen() {
    const route = useRoute<RouteProp<AppStackParamList, "PetDetailsScreen">>()
    const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>()
    const petId = route.params.pet.id

    const { data: pet, isLoading, isError, error, refetch } = usePet(petId)
    const { data: species } = useSpecies()
    const { data: events, isLoading: eventsLoading } = useHealthEvents(petId)
    const { data: subscriptions, isLoading: subscriptionsLoading } = useSubscriptions(petId)
    const deletePet = useDeletePet()
    const deleteEvent = useDeleteHealthEvent()
    const updateSubscriptionStatus = useUpdateSubscriptionStatus()

    const [photoUri, setPhotoUri] = useState<string | null>(null)

    useEffect(() => {
        getPetPhoto(petId).then(setPhotoUri)
    }, [petId])

    if (isLoading) {
        return (
            <SafeAreaView style={styles.container}>
                <LoadingView label="Carregando pet..." />
            </SafeAreaView>
        )
    }

    if (isError || !pet) {
        return (
            <SafeAreaView style={styles.container}>
                <ErrorView message={getApiErrorMessage(error, "Pet não encontrado.")} onRetry={() => refetch()} />
            </SafeAreaView>
        )
    }

    const speciesName = species?.find(s => s.id === pet.speciesId)?.name ?? "—"
    const age = getAgeInYears(pet.birthDate)
    const activeSubscription = subscriptions?.find(s => s.status === "ATIVO")

    const handleDeletePet = () => {
        Alert.alert(
            "Excluir pet",
            `Tem certeza que deseja excluir ${pet.name}? Essa ação não pode ser desfeita.`,
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Excluir",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deletePet.mutateAsync(pet.id)
                            navigation.goBack()
                        } catch (err) {
                            Alert.alert("Ops!", getApiErrorMessage(err, "Não foi possível excluir o pet."))
                        }
                    },
                },
            ]
        )
    }

    const handleDeleteEvent = (eventId: number) => {
        Alert.alert("Remover evento", "Deseja remover este evento de saúde?", [
            { text: "Cancelar", style: "cancel" },
            {
                text: "Remover",
                style: "destructive",
                onPress: () => deleteEvent.mutate({ id: eventId, petId: pet.id }),
            },
        ])
    }

    const handleCancelSubscription = () => {
        if (!activeSubscription) return
        Alert.alert(
            "Cancelar convênio",
            `Deseja cancelar o convênio "${activeSubscription.planName}"?`,
            [
                { text: "Voltar", style: "cancel" },
                {
                    text: "Cancelar convênio",
                    style: "destructive",
                    onPress: () => {
                        updateSubscriptionStatus.mutate({
                            id: activeSubscription.id,
                            petId: pet.id,
                            status: "CANCELADO",
                        })
                    },
                },
            ]
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>

                <View style={styles.photoSection}>
                    <Image source={getPetImageSource(photoUri, pet.speciesId)} style={styles.photo} />
                    <Text style={styles.name}>{pet.name}</Text>
                    {!!pet.breed && <Text style={styles.breed}>{pet.breed}</Text>}
                </View>

                <View style={styles.infoRow}>
                    <View style={styles.infoCard}>
                        <Text style={styles.infoLabel}>IDADE</Text>
                        <Text style={styles.infoValue}>{age ?? "—"}</Text>
                        <Text style={styles.infoUnit}>{age === 1 ? "ano" : "anos"}</Text>
                    </View>
                    <View style={styles.infoCard}>
                        <Text style={styles.infoLabel}>PESO</Text>
                        <Text style={styles.infoValue}>{pet.weight ?? "—"}</Text>
                        <Text style={styles.infoUnit}>kg</Text>
                    </View>
                    <View style={styles.infoCard}>
                        <Text style={styles.infoLabel}>ESPÉCIE</Text>
                        <Text style={styles.infoValueSm}>{speciesName}</Text>
                    </View>
                </View>

                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>HISTÓRICO DE SAÚDE</Text>
                    <TouchableOpacity
                        onPress={() => navigation.navigate("HealthEventFormScreen", { petId: pet.id })}
                    >
                        <Text style={styles.addEventText}>+ Novo evento</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.eventsCard}>
                    {eventsLoading ? (
                        <ActivityIndicator color={colors.primary} style={{ paddingVertical: 12 }} />
                    ) : !events || events.length === 0 ? (
                        <Text style={styles.emptyText}>Nenhum evento registrado</Text>
                    ) : (
                        events.map((evt, idx) => (
                            <View key={evt.id}>
                                <TouchableOpacity
                                    style={styles.eventRow}
                                    onPress={() => navigation.navigate("HealthEventFormScreen", { petId: pet.id, event: evt })}
                                    onLongPress={() => handleDeleteEvent(evt.id)}
                                >
                                    <View style={[styles.eventDot, evt.status === "REALIZADO" && styles.eventDotDone]} />
                                    <View style={styles.eventInfo}>
                                        <Text style={styles.eventType}>{evt.description || "Evento de saúde"}</Text>
                                        {!!evt.clinicName && <Text style={styles.eventClinic}>{evt.clinicName}</Text>}
                                        <Text style={styles.eventStatus}>{STATUS_LABEL[evt.status] ?? evt.status}</Text>
                                        <Text style={styles.eventDate}>
                                            {formatDateBR(evt.eventDate)}
                                        </Text>
                                    </View>
                                    <MaterialIcons name="chevron-right" size={20} color={colors.inactive} />
                                </TouchableOpacity>
                                {idx < events.length - 1 && <View style={styles.eventSep} />}
                            </View>
                        ))
                    )}
                </View>

                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>CONVÊNIO MÉDICO</Text>
                    {!activeSubscription && (
                        <TouchableOpacity
                            onPress={() => navigation.navigate("SubscriptionFormScreen", { petId: pet.id })}
                        >
                            <Text style={styles.addEventText}>+ Vincular</Text>
                        </TouchableOpacity>
                    )}
                </View>

                <View style={styles.eventsCard}>
                    {subscriptionsLoading ? (
                        <ActivityIndicator color={colors.primary} style={{ paddingVertical: 12 }} />
                    ) : !activeSubscription ? (
                        <Text style={styles.emptyText}>Nenhum convênio vinculado</Text>
                    ) : (
                        <View>
                            <View style={styles.eventRow}>
                                <View style={[styles.eventDot, styles.eventDotDone]} />
                                <View style={styles.eventInfo}>
                                    <Text style={styles.eventType}>{activeSubscription.planName}</Text>
                                    <Text style={styles.eventStatus}>Ativo</Text>
                                    <Text style={styles.eventDate}>
                                        Desde {formatDateBR(activeSubscription.startDate)}
                                        {activeSubscription.endDate ? ` até ${formatDateBR(activeSubscription.endDate)}` : ""}
                                    </Text>
                                </View>
                            </View>
                            <TouchableOpacity onPress={handleCancelSubscription} disabled={updateSubscriptionStatus.isPending}>
                                <Text style={styles.cancelSubscriptionText}>
                                    {updateSubscriptionStatus.isPending ? "Cancelando..." : "Cancelar convênio"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => navigation.navigate("PetFormScreen", { pet })}
                >
                    <Text style={styles.editButtonText}>Editar Pet</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={handleDeletePet}
                    disabled={deletePet.isPending}
                >
                    {deletePet.isPending ? (
                        <ActivityIndicator color={colors.danger} />
                    ) : (
                        <Text style={styles.deleteButtonText}>Excluir Pet</Text>
                    )}
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    photoSection: {
        alignItems: 'center',
        paddingVertical: 24,
        backgroundColor: colors.surface,
    },
    photo: {
        width: 140,
        height: 140,
        borderRadius: 70,
        marginBottom: 12,
    },
    name: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.textPrimary,
    },
    breed: {
        fontSize: 14,
        color: colors.textSecondary,
        marginTop: 4,
    },
    infoRow: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 16,
        gap: 12,
    },
    infoCard: {
        flex: 1,
        backgroundColor: colors.surface,
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
    },
    infoLabel: {
        fontSize: 11,
        color: colors.textMuted,
        marginBottom: 4,
    },
    infoValue: {
        fontSize: 26,
        fontWeight: 'bold',
        color: colors.primary,
    },
    infoValueSm: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.primary,
        marginTop: 4,
    },
    infoUnit: {
        fontSize: 11,
        color: colors.textMuted,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 12,
        marginBottom: 8,
        marginHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 12,
        color: colors.textLabel,
    },
    addEventText: {
        fontSize: 12,
        color: colors.primary,
        fontWeight: 'bold',
    },
    eventsCard: {
        backgroundColor: colors.surface,
        marginHorizontal: 20,
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
    },
    eventRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingVertical: 8,
    },
    eventDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: colors.inactive,
        marginTop: 5,
        marginRight: 12,
    },
    eventDotDone: {
        backgroundColor: colors.primary,
    },
    eventInfo: {
        flex: 1,
    },
    eventType: {
        fontSize: 15,
        fontWeight: 'bold',
        color: colors.textPrimary,
    },
    eventClinic: {
        fontSize: 12,
        color: colors.textSecondary,
        marginTop: 2,
    },
    eventStatus: {
        fontSize: 12,
        color: colors.primary,
        fontWeight: '600',
        marginTop: 4,
    },
    eventDate: {
        fontSize: 11,
        color: colors.textMuted,
        marginTop: 4,
    },
    eventSep: {
        height: 1,
        backgroundColor: colors.border,
        marginVertical: 4,
    },
    emptyText: {
        textAlign: 'center',
        color: colors.textMuted,
        fontSize: 14,
        paddingVertical: 12,
    },
    cancelSubscriptionText: {
        color: colors.danger,
        fontSize: 13,
        fontWeight: '600',
        textAlign: 'center',
        marginTop: 12,
    },
    editButton: {
        backgroundColor: colors.primary,
        marginHorizontal: 20,
        marginBottom: 12,
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: 'center',
    },
    editButtonText: {
        color: colors.surface,
        fontSize: 16,
        fontWeight: 'bold',
    },
    deleteButton: {
        borderColor: colors.danger,
        borderWidth: 1.5,
        marginHorizontal: 20,
        marginBottom: 30,
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: 'center',
    },
    deleteButtonText: {
        color: colors.danger,
        fontSize: 16,
        fontWeight: 'bold',
    },
})

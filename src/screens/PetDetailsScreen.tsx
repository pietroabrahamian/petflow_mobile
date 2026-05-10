import {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    TouchableOpacity
} from "react-native"
import { useRoute, useNavigation } from "@react-navigation/native"
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context"
import MaterialIcons from "@expo/vector-icons/MaterialIcons"

import data from "../data/petflow.json"
import { Pet } from "../components/PetRow"


export default function PetDetailsScreen() {
    const route = useRoute<any>()
    const navigation = useNavigation<any>()
    const pet: Pet = route.params?.pet

    const plan = data.plans.find(p => p.id === pet.plan_id)
    const clinic = data.clinics.find(c => c.id === pet.clinic_id)
    const events = data.health_events.filter(e => e.pet_id === pet.id)

    const age = new Date().getFullYear() - new Date(pet.birth_date).getFullYear()

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <ScrollView showsVerticalScrollIndicator={false}>

                    {/* Foto e nome */}
                    <View style={styles.photoSection}>
                        <Image source={{ uri: pet.photo }} style={styles.photo} />
                        <Text style={styles.name}>{pet.name}</Text>
                        <Text style={styles.breed}>{pet.breed}</Text>
                    </View>

                    {/* Cards de informações */}
                    <View style={styles.infoRow}>
                        <View style={styles.infoCard}>
                            <Text style={styles.infoLabel}>IDADE</Text>
                            <Text style={styles.infoValue}>{age}</Text>
                            <Text style={styles.infoUnit}>anos</Text>
                        </View>
                        <View style={styles.infoCard}>
                            <Text style={styles.infoLabel}>PESO</Text>
                            <Text style={styles.infoValue}>{pet.weight}</Text>
                            <Text style={styles.infoUnit}>kg</Text>
                        </View>
                        <View style={styles.infoCard}>
                            <Text style={styles.infoLabel}>ESPÉCIE</Text>
                            <Text style={styles.infoValueSm}>{pet.species_name}</Text>
                        </View>
                    </View>

                    {/* Plano de saúde */}
                    <Text style={styles.sectionTitle}>PLANO DE SAÚDE</Text>
                    {plan && clinic ? (
                        <View style={styles.planCard}>
                            <View style={styles.planHeader}>
                                <MaterialIcons name="verified" size={22} color="#2D6A4F" />
                                <Text style={styles.planName}>{plan.name}</Text>
                            </View>
                            <Text style={styles.planClinic}>{clinic.name}</Text>
                            <Text style={styles.planPrice}>
                                R$ {plan.price.toFixed(2).replace('.', ',')}/mês
                            </Text>

                            <View style={styles.benefitsBox}>
                                {plan.benefits.map((b, i) => (
                                    <View key={i} style={styles.benefit}>
                                        <MaterialIcons name="check-circle" size={14} color="#2D6A4F" />
                                        <Text style={styles.benefitText}>{b}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    ) : (
                        <View style={styles.noPlanCard}>
                            <Text style={styles.noPlanText}>Sem plano ativo</Text>
                        </View>
                    )}

                    {/* Eventos de saúde */}
                    <Text style={styles.sectionTitle}>HISTÓRICO DE SAÚDE</Text>
                    <View style={styles.eventsCard}>
                        {events.length === 0 ? (
                            <Text style={styles.emptyText}>Nenhum evento registrado</Text>
                        ) : (
                            events.map((evt, idx) => {
                                const evtClinic = data.clinics.find(c => c.id === evt.clinic_id)
                                return (
                                    <View key={evt.id}>
                                        <View style={styles.eventRow}>
                                            <View style={styles.eventDot} />
                                            <View style={styles.eventInfo}>
                                                <Text style={styles.eventType}>{evt.event_type}</Text>
                                                <Text style={styles.eventClinic}>{evtClinic?.name}</Text>
                                                <Text style={styles.eventNotes}>{evt.notes}</Text>
                                                <Text style={styles.eventDate}>
                                                    {new Date(evt.event_date).toLocaleDateString('pt-BR')}
                                                </Text>
                                            </View>
                                        </View>
                                        {idx < events.length - 1 && <View style={styles.eventSep} />}
                                    </View>
                                )
                            })
                        )}
                    </View>

                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => navigation.navigate("PetFormScreen", { pet })}
                    >
                        <Text style={styles.editButtonText}>Editar Pet</Text>
                    </TouchableOpacity>

                </ScrollView>
            </SafeAreaView>
        </SafeAreaProvider>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f2f2f2",
    },
    photoSection: {
        alignItems: 'center',
        paddingVertical: 24,
        backgroundColor: '#fff',
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
        color: '#1a1a1a',
    },
    breed: {
        fontSize: 14,
        color: '#666',
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
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
    },
    infoLabel: {
        fontSize: 11,
        color: '#999',
        marginBottom: 4,
    },
    infoValue: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#2D6A4F',
    },
    infoValueSm: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2D6A4F',
        marginTop: 4,
    },
    infoUnit: {
        fontSize: 11,
        color: '#999',
    },
    sectionTitle: {
        fontSize: 12,
        color: '#8d8d8d',
        marginTop: 12,
        marginBottom: 8,
        marginHorizontal: 20,
    },
    planCard: {
        backgroundColor: '#fff',
        marginHorizontal: 20,
        marginBottom: 8,
        borderRadius: 12,
        padding: 16,
    },
    planHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 6,
    },
    planName: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    planClinic: {
        fontSize: 14,
        color: '#666',
    },
    planPrice: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2D6A4F',
        marginTop: 8,
    },
    benefitsBox: {
        marginTop: 12,
        gap: 6,
    },
    benefit: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    benefitText: {
        fontSize: 13,
        color: '#444',
    },
    noPlanCard: {
        backgroundColor: '#fff',
        marginHorizontal: 20,
        borderRadius: 12,
        padding: 20,
        alignItems: 'center',
    },
    noPlanText: {
        color: '#999',
        fontSize: 14,
    },
    eventsCard: {
        backgroundColor: '#fff',
        marginHorizontal: 20,
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
    },
    eventRow: {
        flexDirection: 'row',
        paddingVertical: 8,
    },
    eventDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#2D6A4F',
        marginTop: 5,
        marginRight: 12,
    },
    eventInfo: {
        flex: 1,
    },
    eventType: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    eventClinic: {
        fontSize: 12,
        color: '#666',
        marginTop: 2,
    },
    eventNotes: {
        fontSize: 13,
        color: '#444',
        marginTop: 4,
        lineHeight: 18,
    },
    eventDate: {
        fontSize: 11,
        color: '#999',
        marginTop: 4,
    },
    eventSep: {
        height: 1,
        backgroundColor: '#eee',
        marginVertical: 4,
    },
    emptyText: {
        textAlign: 'center',
        color: '#999',
        fontSize: 14,
        paddingVertical: 12,
    },
    editButton: {
        backgroundColor: '#2D6A4F',
        marginHorizontal: 20,
        marginBottom: 30,
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: 'center',
    },
    editButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
})

import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity
} from "react-native"
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context"
import MaterialIcons from "@expo/vector-icons/MaterialIcons"
import { useState } from "react"

import data from "../data/petflow.json"

export default function ClinicListScreen() {
    const [expandedId, setExpandedId] = useState<number | null>(null)

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Clínicas</Text>
                    <Text style={styles.subtitle}>{data.clinics.length} parceiras</Text>
                </View>

                <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
                    {data.clinics.map(clinic => {
                        const isOpen = expandedId === clinic.id
                        const clinicPlans = data.plans.filter(p => p.clinic_id === clinic.id)
                        const enrolledPets = data.pets.filter(p => p.clinic_id === clinic.id)

                        return (
                            <View key={clinic.id} style={styles.card}>
                                <TouchableOpacity
                                    style={styles.cardHeader}
                                    onPress={() => setExpandedId(isOpen ? null : clinic.id)}
                                >
                                    <View style={styles.iconBox}>
                                        <MaterialIcons name="local-hospital" size={26} color="#2D6A4F" />
                                    </View>
                                    <View style={styles.cardInfo}>
                                        <Text style={styles.clinicName}>{clinic.name}</Text>
                                        <Text style={styles.clinicAddress} numberOfLines={1}>
                                            {clinic.address}
                                        </Text>
                                        <Text style={styles.clinicMeta}>
                                            {clinicPlans.length} plano(s) • {enrolledPets.length} pet(s)
                                        </Text>
                                    </View>
                                    <MaterialIcons
                                        name={isOpen ? "expand-less" : "expand-more"}
                                        size={24}
                                        color="#999"
                                    />
                                </TouchableOpacity>

                                {isOpen && (
                                    <View style={styles.cardBody}>
                                        <View style={styles.contactRow}>
                                            <MaterialIcons name="phone" size={16} color="#666" />
                                            <Text style={styles.contactText}>{clinic.phone}</Text>
                                        </View>
                                        <View style={styles.contactRow}>
                                            <MaterialIcons name="business" size={16} color="#666" />
                                            <Text style={styles.contactText}>CNPJ: {clinic.cnpj}</Text>
                                        </View>

                                        {enrolledPets.length > 0 && (
                                            <>
                                                <Text style={styles.subSection}>SEUS PETS NESTA CLÍNICA</Text>
                                                <View style={styles.petsRow}>
                                                    {enrolledPets.map(p => (
                                                        <View key={p.id} style={styles.petChip}>
                                                            <Text style={styles.petChipText}>{p.name}</Text>
                                                        </View>
                                                    ))}
                                                </View>
                                            </>
                                        )}

                                        <Text style={styles.subSection}>PLANOS DISPONÍVEIS</Text>
                                        {clinicPlans.map(plan => (
                                            <View key={plan.id} style={styles.planBox}>
                                                <View style={styles.planTitleRow}>
                                                    <Text style={styles.planName}>{plan.name}</Text>
                                                    <Text style={styles.planPrice}>
                                                        R$ {plan.price.toFixed(2).replace('.', ',')}
                                                    </Text>
                                                </View>
                                                <Text style={styles.planDesc}>{plan.description}</Text>
                                                {plan.benefits.map((b, i) => (
                                                    <View key={i} style={styles.benefitRow}>
                                                        <MaterialIcons name="check" size={14} color="#2D6A4F" />
                                                        <Text style={styles.benefitText}>{b}</Text>
                                                    </View>
                                                ))}
                                            </View>
                                        ))}
                                    </View>
                                )}
                            </View>
                        )
                    })}
                </ScrollView>
            </SafeAreaView>
        </SafeAreaProvider>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f2f2f2",
        paddingTop: 20,
        paddingHorizontal: 20,
    },
    header: { marginBottom: 16 },
    title: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    list: {
        flex: 1,
    },
    card: {
        backgroundColor: '#fff',
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
        backgroundColor: '#D8F3DC',
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
        color: '#1a1a1a',
    },
    clinicAddress: {
        fontSize: 12,
        color: '#666',
        marginTop: 2,
    },
    clinicMeta: {
        fontSize: 11,
        color: '#999',
        marginTop: 4,
    },
    cardBody: {
        padding: 14,
        borderTopWidth: 1,
        borderTopColor: '#eee',
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
        color: '#8d8d8d',
        marginTop: 14,
        marginBottom: 8,
    },
    petsRow: {
        flexDirection: 'row',
        gap: 6,
        flexWrap: 'wrap',
    },
    petChip: {
        backgroundColor: '#D8F3DC',
        borderRadius: 16,
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    petChipText: {
        color: '#2D6A4F',
        fontSize: 12,
        fontWeight: '600',
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
        color: '#1a1a1a',
    },
    planPrice: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#2D6A4F',
    },
    planDesc: {
        fontSize: 12,
        color: '#666',
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

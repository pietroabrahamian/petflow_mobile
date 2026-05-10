import {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
} from "react-native"
import { useRoute } from "@react-navigation/native"
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context"

import { Pet } from "../components/PetRow"

export default function PetDetailsScreen() {
    const route = useRoute<any>()
    const pet: Pet = route.params?.pet

    const age = new Date().getFullYear() - new Date(pet.birth_date).getFullYear()

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <ScrollView showsVerticalScrollIndicator={false}>

                    <View style={styles.photoSection}>
                        <Image source={{ uri: pet.photo }} style={styles.photo} />
                        <Text style={styles.name}>{pet.name}</Text>
                        <Text style={styles.breed}>{pet.breed}</Text>
                    </View>

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

                </ScrollView>
            </SafeAreaView>
        </SafeAreaProvider>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f2f2f2" },
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
    name: { fontSize: 28, fontWeight: 'bold', color: '#1a1a1a' },
    breed: { fontSize: 14, color: '#666', marginTop: 4 },
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
    infoLabel: { fontSize: 11, color: '#999', marginBottom: 4 },
    infoValue: { fontSize: 26, fontWeight: 'bold', color: '#2D6A4F' },
    infoValueSm: { fontSize: 16, fontWeight: 'bold', color: '#2D6A4F', marginTop: 4 },
    infoUnit: { fontSize: 11, color: '#999' },
})

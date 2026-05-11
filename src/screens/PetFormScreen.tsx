import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
} from "react-native"
import { s } from 'react-native-size-matters'
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context"
import { useNavigation, useRoute } from "@react-navigation/native"
import { useState, useLayoutEffect } from "react"

import data from "../data/petflow.json"

export default function PetFormScreen() {
    const [name, setName] = useState("")
    const [breed, setBreed] = useState("")
    const [birthDate, setBirthDate] = useState("")
    const [weight, setWeight] = useState("")
    const [speciesId, setSpeciesId] = useState<number | null>(null)

    const route = useRoute<any>()
    const navigation = useNavigation<any>()
    const pet = route.params?.pet ?? null

    useLayoutEffect(() => {
        navigation.setOptions({ title: pet == null ? "Cadastrar Pet" : "Editar Pet" })
    }, [])

    const handleSave = () => {
        console.log("Salvando:", { name, breed, birthDate, weight, speciesId })
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <ScrollView style={{ padding: 20, backgroundColor: "#f2f2f2" }}>

                    <Text style={styles.sectionTitle}>NOME</Text>
                    <TextInput
                        style={styles.input}
                        value={name}
                        onChangeText={setName}
                        placeholder="Ex: Thor"
                    />

                    <Text style={styles.sectionTitle}>RAÇA</Text>
                    <TextInput
                        style={styles.input}
                        value={breed}
                        onChangeText={setBreed}
                        placeholder="Ex: Labrador Retriever"
                    />

                    <Text style={styles.sectionTitle}>NASCIMENTO E PESO</Text>
                    <View style={{ flexDirection: 'row', gap: 10 }}>
                        <TextInput
                            style={styles.input}
                            value={birthDate}
                            onChangeText={setBirthDate}
                            placeholder="DD/MM/AAAA"
                            keyboardType="numeric"
                        />
                        <TextInput
                            style={styles.input}
                            value={weight}
                            onChangeText={setWeight}
                            placeholder="Peso (kg)"
                            keyboardType="decimal-pad"
                        />
                    </View>

                    <Text style={styles.sectionTitle}>ESPÉCIE</Text>
                    <View style={styles.optionsRow}>
                        {data.species.map(sp => (
                            <TouchableOpacity
                                key={sp.id}
                                style={[
                                    styles.option,
                                    speciesId === sp.id && styles.optionActive
                                ]}
                                onPress={() => setSpeciesId(sp.id)}
                            >
                                <Text style={[
                                    styles.optionText,
                                    speciesId === sp.id && styles.optionTextActive
                                ]}>
                                    {sp.name}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                </ScrollView>

                <View style={styles.buttonArea}>
                    <TouchableOpacity onPress={handleSave} style={styles.button}>
                        <Text style={{ color: 'white', fontSize: 18 }}>
                            {pet == null ? "Cadastrar Pet" : "Salvar Alterações"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },
    sectionTitle: { fontSize: s(12), color: '#3d3d3d', marginTop: 4 },
    input: {
        flex: 1, height: 42, backgroundColor: 'white', borderRadius: 8,
        paddingHorizontal: 10, marginTop: 10, marginBottom: 20,
    },
    optionsRow: { flexDirection: 'row', gap: 10, marginTop: 10, marginBottom: 20 },
    option: {
        flex: 1, height: 42, borderRadius: 8, backgroundColor: '#fff',
        alignItems: 'center', justifyContent: 'center',
        borderWidth: 1.5, borderColor: '#ddd',
    },
    optionActive: { borderColor: '#2D6A4F', backgroundColor: '#D8F3DC' },
    optionText: { color: '#666', fontWeight: '500' },
    optionTextActive: { color: '#2D6A4F', fontWeight: 'bold' },
    buttonArea: { paddingHorizontal: 20, paddingVertical: 20, backgroundColor: 'white', height: 86 },
    button: { flex: 1, backgroundColor: '#2D6A4F', alignItems: 'center', justifyContent: 'center', borderRadius: 8 },
})

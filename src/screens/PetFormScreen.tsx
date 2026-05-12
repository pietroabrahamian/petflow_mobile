import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Alert,
} from "react-native"
import { s } from 'react-native-size-matters'
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context"
import { useNavigation, useRoute } from "@react-navigation/native"
import { useState, useEffect, useLayoutEffect } from "react"

import data from "../data/petflow.json"
import { addPet, updatePet } from "../services/petService"

export default function PetFormScreen() {
    const [name, setName] = useState("")
    const [breed, setBreed] = useState("")
    const [birthDate, setBirthDate] = useState("")
    const [weight, setWeight] = useState("")
    const [speciesId, setSpeciesId] = useState<number | null>(null)
    const [planId, setPlanId] = useState<number | null>(null)

    const route = useRoute<any>()
    const navigation = useNavigation<any>()
    const pet = route.params?.pet ?? null

    useLayoutEffect(() => {
        navigation.setOptions({ title: pet == null ? "Cadastrar Pet" : "Editar Pet" })
    }, [])

    useEffect(() => {
        if (pet) {
            setName(pet.name)
            setBreed(pet.breed)
            setBirthDate(formatDateBR(pet.birth_date))
            setWeight(String(pet.weight))
            setSpeciesId(pet.species_id)
            setPlanId(pet.plan_id)
        }
    }, [])

    const formatDateBR = (isoDate: string) => {
        const d = new Date(isoDate)
        const dd = String(d.getDate()).padStart(2, '0')
        const mm = String(d.getMonth() + 1).padStart(2, '0')
        return `${dd}/${mm}/${d.getFullYear()}`
    }

    const parseDateBR = (dateBR: string): string => {
        const [dd, mm, yyyy] = dateBR.split('/')
        return `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`
    }

    const handleSave = async () => {
        if (name.length === 0) {
            Alert.alert("Campo inválido", "Digite o nome do pet")
            return
        }
        if (breed.length === 0) {
            Alert.alert("Campo inválido", "Digite a raça do pet")
            return
        }
        if (birthDate.length < 10 || !birthDate.includes('/')) {
            Alert.alert("Campo inválido", "Digite a data no formato DD/MM/AAAA")
            return
        }
        const parsedWeight = parseFloat(weight.replace(",", "."))
        if (Number.isNaN(parsedWeight)) {
            Alert.alert("Campo inválido", "Informe um peso válido")
            return
        }
        if (speciesId == null) {
            Alert.alert("Campo inválido", "Selecione a espécie")
            return
        }

        const species = data.species.find(sp => sp.id === speciesId)
        const petData = {
            species_id: speciesId,
            species_name: species?.name || "",
            name,
            breed,
            birth_date: parseDateBR(birthDate),
            weight: parsedWeight,
            plan_id: planId ?? 0,
            clinic_id: planId
                ? (data.plans.find(p => p.id === planId)?.clinic_id ?? 0)
                : 0,
            photo: speciesId === 1
                ? "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400"
                : speciesId === 2
                ? "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400"
                : "https://images.unsplash.com/photo-1452570053594-1b985d6ea890?w=400",
        }

        try {
            if (pet) {
                await updatePet(pet.id, petData)
            } else {
                await addPet(petData)
            }
            Alert.alert(
                "Sucesso!",
                pet ? "Pet atualizado." : "Pet cadastrado.",
                [{ text: "OK", onPress: () => navigation.goBack() }]
            )
        } catch (error) {
            Alert.alert("Ops!", "Não foi possível salvar.")
        }
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

                    <Text style={styles.sectionTitle}>PLANO DE SAÚDE (opcional)</Text>
                    {data.plans.map(plan => {
                        const clinic = data.clinics.find(c => c.id === plan.clinic_id)
                        return (
                            <TouchableOpacity
                                key={plan.id}
                                style={[
                                    styles.planOption,
                                    planId === plan.id && styles.planOptionActive
                                ]}
                                onPress={() => setPlanId(planId === plan.id ? null : plan.id)}
                            >
                                <Text style={styles.planOptionName}>{plan.name}</Text>
                                <Text style={styles.planOptionClinic}>{clinic?.name}</Text>
                                <Text style={styles.planOptionPrice}>
                                    R$ {plan.price.toFixed(2).replace('.', ',')}/mês
                                </Text>
                            </TouchableOpacity>
                        )
                    })}

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
    planOption: {
        backgroundColor: '#fff', borderRadius: 8, padding: 12, marginTop: 10,
        borderWidth: 1.5, borderColor: '#ddd',
    },
    planOptionActive: { borderColor: '#2D6A4F', backgroundColor: '#D8F3DC' },
    planOptionName: { fontSize: 15, fontWeight: 'bold', color: '#1a1a1a' },
    planOptionClinic: { fontSize: 12, color: '#666', marginTop: 2 },
    planOptionPrice: { fontSize: 14, color: '#2D6A4F', fontWeight: 'bold', marginTop: 4 },
    buttonArea: { paddingHorizontal: 20, paddingVertical: 20, backgroundColor: 'white', height: 86 },
    button: { flex: 1, backgroundColor: '#2D6A4F', alignItems: 'center', justifyContent: 'center', borderRadius: 8 },
})

import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Alert,
    Image
} from "react-native"
import { s } from 'react-native-size-matters'
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context"
import { useRoute, useNavigation } from "@react-navigation/native"
import { useState, useEffect, useLayoutEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import MaterialIcons from "@expo/vector-icons/MaterialIcons"

import data from "../data/petflow.json"
import { addPet, updatePet } from "../services/petService"
import { pickImageFromGallery } from "../services/imageService"

const DRAFT_KEY = "@petflow:pet_draft"

export default function PetFormScreen() {
    const [name, setName] = useState("")
    const [breed, setBreed] = useState("")
    const [birthDate, setBirthDate] = useState("")
    const [weight, setWeight] = useState("")
    const [speciesId, setSpeciesId] = useState<number | null>(null)
    const [planId, setPlanId] = useState<number | null>(null)
    const [photoUri, setPhotoUri] = useState<string | null>(null)

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
            setPhotoUri(pet.photo || null)
        } else {
            loadDraft()
        }
    }, [])

    useEffect(() => {
        if (!pet) saveDraft()
    }, [name, breed, birthDate, weight, speciesId, planId, photoUri])

    const loadDraft = async () => {
        try {
            const raw = await AsyncStorage.getItem(DRAFT_KEY)
            if (raw) {
                const draft = JSON.parse(raw)
                setName(draft.name || "")
                setBreed(draft.breed || "")
                setBirthDate(draft.birthDate || "")
                setWeight(draft.weight || "")
                setSpeciesId(draft.speciesId ?? null)
                setPlanId(draft.planId ?? null)
                setPhotoUri(draft.photoUri ?? null)
            }
        } catch (error) {
            console.log("Erro ao carregar rascunho:", error)
        }
    }

    const saveDraft = async () => {
        try {
            const draft = { name, breed, birthDate, weight, speciesId, planId, photoUri }
            await AsyncStorage.setItem(DRAFT_KEY, JSON.stringify(draft))
        } catch (error) {
            console.log("Erro ao salvar rascunho:", error)
        }
    }

    const handlePickPhoto = async () => {
        try {
            const uri = await pickImageFromGallery()
            if (uri) {
                setPhotoUri(uri)
            } else {
                // Usuário cancelou ou negou permissão
                Alert.alert(
                    "Permissão necessária",
                    "Para escolher uma foto, permita o acesso à galeria nas configurações."
                )
            }
        } catch (error) {
            console.log("Erro ao escolher foto:", error)
            Alert.alert("Ops!", "Não foi possível abrir a galeria.")
        }
    }

    const formatDateBR = (isoDate: string) => {
        const d = new Date(isoDate)
        const dd = String(d.getDate()).padStart(2, '0')
        const mm = String(d.getMonth() + 1).padStart(2, '0')
        return `${dd}/${mm}/${d.getFullYear()}`
    }

    // DD/MM/AAAA → AAAA-MM-DD (formato ISO do banco)
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
            Alert.alert("Campo inválido", "Digite a data de nascimento no formato DD/MM/AAAA")
            return
        }
        const parsedWeight = parseFloat(weight.replace(",", "."))
        if (Number.isNaN(parsedWeight)) {
            Alert.alert("Campo inválido", "Informe um peso válido (ex.: 4,5)")
            return
        }
        if (speciesId == null) {
            Alert.alert("Campo inválido", "Selecione a espécie do pet")
            return
        }

        const species = data.species.find(s => s.id === speciesId)

        // Foto: usa a escolhida pelo usuário (galeria), ou fallback por espécie
        const defaultPhoto = speciesId === 1
            ? "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400"
            : speciesId === 2
            ? "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400"
            : "https://images.unsplash.com/photo-1452570053594-1b985d6ea890?w=400"

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
            photo: photoUri || defaultPhoto,
        }

        try {
            if (pet) {
                await updatePet(pet.id, petData)
            } else {
                await addPet(petData)
                await AsyncStorage.removeItem(DRAFT_KEY)
            }

            Alert.alert(
                "Sucesso!",
                pet ? "Pet atualizado com sucesso." : "Pet cadastrado com sucesso.",
                [{ text: "OK", onPress: () => navigation.goBack() }]
            )
        } catch (error) {
            console.log(error)
            Alert.alert("Ops!", "Não foi possível salvar o pet.")
        }
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <ScrollView style={{ padding: 20, backgroundColor: "#f2f2f2" }}>

                    <Text style={styles.sectionTitle}>FOTO DO PET</Text>
                    <TouchableOpacity
                        style={styles.photoPicker}
                        onPress={handlePickPhoto}
                        activeOpacity={0.7}
                    >
                        {photoUri ? (
                            <>
                                <Image
                                    source={{ uri: photoUri }}
                                    style={styles.photoPreview}
                                />
                                <View style={styles.photoOverlay}>
                                    <MaterialIcons name="edit" size={18} color="#fff" />
                                    <Text style={styles.photoOverlayText}>Trocar</Text>
                                </View>
                            </>
                        ) : (
                            <View style={styles.photoPlaceholder}>
                                <MaterialIcons name="add-a-photo" size={32} color="#2D6A4F" />
                                <Text style={styles.photoPlaceholderText}>Escolher foto da galeria</Text>
                            </View>
                        )}
                    </TouchableOpacity>

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
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    sectionTitle: {
        fontSize: s(12),
        color: '#3d3d3d',
        marginTop: 4,
    },
    input: {
        flex: 1,
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
    },
    option: {
        flex: 1,
        height: 42,
        borderRadius: 8,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
        borderColor: '#ddd',
    },
    optionActive: {
        borderColor: '#2D6A4F',
        backgroundColor: '#D8F3DC',
    },
    optionText: {
        color: '#666',
        fontWeight: '500',
    },
    optionTextActive: {
        color: '#2D6A4F',
        fontWeight: 'bold',
    },
    planOption: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 12,
        marginTop: 10,
        borderWidth: 1.5,
        borderColor: '#ddd',
    },
    planOptionActive: {
        borderColor: '#2D6A4F',
        backgroundColor: '#D8F3DC',
    },
    planOptionName: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    planOptionClinic: {
        fontSize: 12,
        color: '#666',
        marginTop: 2,
    },
    planOptionPrice: {
        fontSize: 14,
        color: '#2D6A4F',
        fontWeight: 'bold',
        marginTop: 4,
    },
    buttonArea: {
        paddingHorizontal: 20,
        paddingVertical: 20,
        backgroundColor: 'white',
        height: 86,
    },
    button: {
        flex: 1,
        backgroundColor: '#2D6A4F',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
    },
    photoPicker: {
        alignSelf: 'center',
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: '#fff',
        marginTop: 10,
        marginBottom: 20,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: '#D8F3DC',
        borderStyle: 'dashed',
    },
    photoPreview: {
        width: '100%',
        height: '100%',
    },
    photoOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(45,106,79,0.85)',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 6,
        gap: 4,
    },
    photoOverlayText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    photoPlaceholder: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 14,
    },
    photoPlaceholderText: {
        color: '#2D6A4F',
        fontSize: 11,
        fontWeight: '600',
        marginTop: 6,
        textAlign: 'center',
    },
})

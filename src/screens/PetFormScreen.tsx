import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Alert,
    Image,
    ActivityIndicator,
} from "react-native"
import { s } from 'react-native-size-matters'
import { SafeAreaView } from "react-native-safe-area-context"
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { useState, useEffect, useLayoutEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import MaterialIcons from "@expo/vector-icons/MaterialIcons"

import { useCreatePet, useUpdatePet } from "../hooks/usePets"
import { useSpecies } from "../hooks/useReferenceData"
import InlineRetry from "../components/InlineRetry"
import { pickImageFromGallery } from "../services/imageService"
import { getPetImageSource } from "../utils/petImages"
import { getPetPhoto, setPetPhoto } from "../utils/petPhotoStore"
import { getApiErrorMessage } from "../api/client"
import { formatDateBR, parseDateBR, isValidDateBR } from "../utils/date"
import { useAuth } from "../contexts/AuthContext"
import { AppStackParamList } from "../navigation/types"
import { colors } from "../theme/colors"

const DRAFT_KEY = "@petflow:pet_draft"

export default function PetFormScreen() {
    const [name, setName] = useState("")
    const [breed, setBreed] = useState("")
    const [birthDate, setBirthDate] = useState("")
    const [weight, setWeight] = useState("")
    const [speciesId, setSpeciesId] = useState<number | null>(null)
    const [photoUri, setPhotoUri] = useState<string | null>(null)

    const route = useRoute<RouteProp<AppStackParamList, "PetFormScreen">>()
    const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>()
    const pet = route.params?.pet ?? null

    const { user } = useAuth()
    const { data: species, isLoading: speciesLoading, isError: speciesError, refetch: refetchSpecies } = useSpecies()
    const createPet = useCreatePet()
    const updatePet = useUpdatePet()
    const isSaving = createPet.isPending || updatePet.isPending

    useLayoutEffect(() => {
        navigation.setOptions({ title: pet == null ? "Cadastrar Pet" : "Editar Pet" })
    }, [])

    useEffect(() => {
        if (pet) {
            setName(pet.name)
            setBreed(pet.breed ?? "")
            setBirthDate(pet.birthDate ? formatDateBR(pet.birthDate) : "")
            setWeight(pet.weight != null ? String(pet.weight) : "")
            setSpeciesId(pet.speciesId)
            getPetPhoto(pet.id).then(setPhotoUri)
        } else {
            loadDraft()
        }
    }, [])

    useEffect(() => {
        if (!pet) saveDraft()
    }, [name, breed, birthDate, weight, speciesId])

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
            }
        } catch (error) {
            console.log("Erro ao carregar rascunho:", error)
        }
    }

    const saveDraft = async () => {
        try {
            const draft = { name, breed, birthDate, weight, speciesId }
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

    const handleSave = async () => {
        if (!user) return

        if (name.trim().length === 0) {
            Alert.alert("Campo inválido", "Digite o nome do pet")
            return
        }
        if (birthDate.length > 0 && !isValidDateBR(birthDate)) {
            Alert.alert("Data inválida", "Digite uma data de nascimento válida no formato DD/MM/AAAA")
            return
        }
        let parsedWeight: number | undefined
        if (weight.trim().length > 0) {
            parsedWeight = parseFloat(weight.replace(",", "."))
            if (Number.isNaN(parsedWeight)) {
                Alert.alert("Campo inválido", "Informe um peso válido (ex.: 4,5)")
                return
            }
        }
        if (speciesId == null) {
            Alert.alert("Campo inválido", "Selecione a espécie do pet")
            return
        }

        const payload = {
            name: name.trim(),
            breed: breed.trim() || undefined,
            birthDate: birthDate.length > 0 ? parseDateBR(birthDate) : undefined,
            weight: parsedWeight,
            tutorId: user.id,
            speciesId,
        }

        try {
            let savedId: number
            if (pet) {
                const updated = await updatePet.mutateAsync({ id: pet.id, payload })
                savedId = updated.id
            } else {
                const created = await createPet.mutateAsync(payload)
                savedId = created.id
                await AsyncStorage.removeItem(DRAFT_KEY)
            }

            if (photoUri) {
                await setPetPhoto(savedId, photoUri)
            }

            Alert.alert(
                "Sucesso!",
                pet ? "Pet atualizado com sucesso." : "Pet cadastrado com sucesso.",
                [{ text: "OK", onPress: () => navigation.goBack() }]
            )
        } catch (error) {
            Alert.alert("Ops!", getApiErrorMessage(error, "Não foi possível salvar o pet."))
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={{ padding: 20, backgroundColor: colors.background }}>

                <Text style={styles.sectionTitle}>FOTO DO PET</Text>
                <TouchableOpacity
                    style={styles.photoPicker}
                    onPress={handlePickPhoto}
                    activeOpacity={0.7}
                >
                    {photoUri ? (
                        <>
                            <Image
                                source={getPetImageSource(photoUri, speciesId ?? undefined)}
                                style={styles.photoPreview}
                            />
                            <View style={styles.photoOverlay}>
                                <MaterialIcons name="edit" size={18} color={colors.surface} />
                                <Text style={styles.photoOverlayText}>Trocar</Text>
                            </View>
                        </>
                    ) : (
                        <View style={styles.photoPlaceholder}>
                            <MaterialIcons name="add-a-photo" size={32} color={colors.primary} />
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
                {speciesLoading ? (
                    <ActivityIndicator color={colors.primary} style={{ marginVertical: 16 }} />
                ) : speciesError ? (
                    <InlineRetry message="Não foi possível carregar as espécies." onRetry={() => refetchSpecies()} />
                ) : (
                    <View style={styles.optionsRow}>
                        {species?.map(sp => (
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
                )}

            </ScrollView>

            <View style={styles.buttonArea}>
                <TouchableOpacity onPress={handleSave} style={styles.button} disabled={isSaving}>
                    {isSaving ? (
                        <ActivityIndicator color={colors.surface} />
                    ) : (
                        <Text style={{ color: 'white', fontSize: 18 }}>
                            {pet == null ? "Cadastrar Pet" : "Salvar Alterações"}
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
        fontSize: s(12),
        color: colors.formLabel,
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
        flexWrap: 'wrap',
    },
    option: {
        flexGrow: 1,
        minWidth: 80,
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
    photoPicker: {
        alignSelf: 'center',
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: colors.surface,
        marginTop: 10,
        marginBottom: 20,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: colors.primaryLight,
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
        color: colors.surface,
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
        color: colors.primary,
        fontSize: 11,
        fontWeight: '600',
        marginTop: 6,
        textAlign: 'center',
    },
})

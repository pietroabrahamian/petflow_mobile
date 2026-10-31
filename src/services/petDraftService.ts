import AsyncStorage from "@react-native-async-storage/async-storage"

const DRAFT_KEY = "@petflow:pet_draft"

/** Campos do formulário de pet como o usuário digitou (antes de converter para a API) */
export type PetDraft = {
    name: string
    breed: string
    birthDate: string
    weight: string
    speciesId: number | null
}

export async function loadPetDraft(): Promise<PetDraft | null> {
    try {
        const raw = await AsyncStorage.getItem(DRAFT_KEY)
        return raw ? JSON.parse(raw) : null
    } catch (error) {
        console.log("[petDraftService] Erro ao carregar rascunho:", error)
        return null
    }
}

export async function savePetDraft(draft: PetDraft): Promise<void> {
    try {
        await AsyncStorage.setItem(DRAFT_KEY, JSON.stringify(draft))
    } catch (error) {
        console.log("[petDraftService] Erro ao salvar rascunho:", error)
    }
}

export async function clearPetDraft(): Promise<void> {
    await AsyncStorage.removeItem(DRAFT_KEY)
}

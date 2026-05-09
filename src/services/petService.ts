import AsyncStorage from "@react-native-async-storage/async-storage"
import data from "../data/petflow.json"
import { Pet } from "../components/PetRow"

const PETS_KEY = "@petflow:pets"

// Lista combinada: pets do JSON (mock) + pets cadastrados pelo usuário (AsyncStorage)
export const getPets = async (): Promise<Pet[]> => {
    try {
        const stored = await AsyncStorage.getItem(PETS_KEY)
        const userPets: Pet[] = stored ? JSON.parse(stored) : []
        const combined = [...data.pets, ...userPets]
        console.log("[petService] getPets - JSON:", data.pets.length, "| User:", userPets.length, "| Total:", combined.length)
        return combined
    } catch (error) {
        console.log("[petService] Erro ao carregar pets:", error)
        return data.pets
    }
}

// Adiciona um pet novo no AsyncStorage
export const addPet = async (petData: Omit<Pet, "id" | "tutor_id">): Promise<Pet> => {
    try {
        const stored = await AsyncStorage.getItem(PETS_KEY)
        const userPets: Pet[] = stored ? JSON.parse(stored) : []

        const newPet: Pet = {
            ...petData,
            id: Date.now(),
            tutor_id: 1,
        }

        const updated = [...userPets, newPet]
        await AsyncStorage.setItem(PETS_KEY, JSON.stringify(updated))

        console.log("[petService] Pet salvo:", newPet.name, "| Total no storage:", updated.length)

        return newPet
    } catch (error) {
        console.log("[petService] Erro ao adicionar pet:", error)
        throw error
    }
}

// Atualiza um pet existente
export const updatePet = async (petId: number, petData: Partial<Pet>): Promise<Pet> => {
    try {
        const stored = await AsyncStorage.getItem(PETS_KEY)
        const userPets: Pet[] = stored ? JSON.parse(stored) : []

        const idx = userPets.findIndex(p => p.id === petId)
        if (idx === -1) {
            // Pet vem do JSON estático — não dá pra atualizar fisicamente,
            // mas podemos sobrescrever criando uma cópia no AsyncStorage
            const mockPet = data.pets.find(p => p.id === petId)
            if (!mockPet) throw new Error("Pet não encontrado")
            const updated = { ...mockPet, ...petData }
            await AsyncStorage.setItem(PETS_KEY, JSON.stringify([...userPets, updated]))
            return updated
        }

        userPets[idx] = { ...userPets[idx], ...petData }
        await AsyncStorage.setItem(PETS_KEY, JSON.stringify(userPets))
        return userPets[idx]
    } catch (error) {
        console.log("Erro ao atualizar pet:", error)
        throw error
    }
}

// Remove um pet (apenas os cadastrados pelo usuário)
export const deletePet = async (petId: number): Promise<void> => {
    try {
        const stored = await AsyncStorage.getItem(PETS_KEY)
        const userPets: Pet[] = stored ? JSON.parse(stored) : []
        const filtered = userPets.filter(p => p.id !== petId)
        await AsyncStorage.setItem(PETS_KEY, JSON.stringify(filtered))
    } catch (error) {
        console.log("Erro ao deletar pet:", error)
        throw error
    }
}

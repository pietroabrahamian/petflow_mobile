import { api } from "../api/client"
import { Page, Pet, PetRequest } from "../types/api"

export async function listPets(tutorId: number): Promise<Pet[]> {
    const { data } = await api.get<Page<Pet>>("/pets", {
        params: { tutorId, size: 100, sortBy: "name", direction: "asc" },
    })
    return data.content
}

export async function getPet(id: number): Promise<Pet> {
    const { data } = await api.get<Pet>(`/pets/${id}`)
    return data
}

export async function createPet(payload: PetRequest): Promise<Pet> {
    const { data } = await api.post<Pet>("/pets", payload)
    return data
}

export async function updatePet(id: number, payload: PetRequest): Promise<Pet> {
    const { data } = await api.put<Pet>(`/pets/${id}`, payload)
    return data
}

export async function deletePet(id: number): Promise<void> {
    await api.delete(`/pets/${id}`)
}

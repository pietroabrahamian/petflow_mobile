import { api } from "../api/client"
import { EventType, Species } from "../types/api"

export async function listSpecies(): Promise<Species[]> {
    const { data } = await api.get<Species[]>("/species")
    return data
}

export async function listEventTypes(): Promise<EventType[]> {
    const { data } = await api.get<EventType[]>("/event-types")
    return data
}

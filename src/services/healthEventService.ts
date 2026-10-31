import { api } from "../api/client"
import { HealthEvent, HealthEventRequest, Page } from "../types/api"

export async function listHealthEvents(petId: number): Promise<HealthEvent[]> {
    const { data } = await api.get<Page<HealthEvent>>("/health-events", {
        params: { petId, size: 100, sortBy: "eventDate", direction: "desc" },
    })
    return data.content
}

export async function createHealthEvent(payload: HealthEventRequest): Promise<HealthEvent> {
    const { data } = await api.post<HealthEvent>("/health-events", payload)
    return data
}

export async function updateHealthEvent(id: number, payload: HealthEventRequest): Promise<HealthEvent> {
    const { data } = await api.put<HealthEvent>(`/health-events/${id}`, payload)
    return data
}

export async function deleteHealthEvent(id: number): Promise<void> {
    await api.delete(`/health-events/${id}`)
}

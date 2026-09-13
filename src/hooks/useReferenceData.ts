import { useQuery } from "@tanstack/react-query"
import { api } from "../api/client"
import { EventType, Species } from "../types/api"

const REFERENCE_STALE_TIME = 5 * 60 * 1000

export function useSpecies() {
    return useQuery({
        queryKey: ["species"],
        queryFn: async () => {
            const { data } = await api.get<Species[]>("/species")
            return data
        },
        staleTime: REFERENCE_STALE_TIME,
    })
}

export function useEventTypes() {
    return useQuery({
        queryKey: ["eventTypes"],
        queryFn: async () => {
            const { data } = await api.get<EventType[]>("/event-types")
            return data
        },
        staleTime: REFERENCE_STALE_TIME,
    })
}

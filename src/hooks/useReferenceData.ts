import { useQuery } from "@tanstack/react-query"
import { listEventTypes, listSpecies } from "../services/referenceDataService"

const REFERENCE_STALE_TIME = 5 * 60 * 1000

export function useSpecies() {
    return useQuery({
        queryKey: ["species"],
        queryFn: listSpecies,
        staleTime: REFERENCE_STALE_TIME,
    })
}

export function useEventTypes() {
    return useQuery({
        queryKey: ["eventTypes"],
        queryFn: listEventTypes,
        staleTime: REFERENCE_STALE_TIME,
    })
}

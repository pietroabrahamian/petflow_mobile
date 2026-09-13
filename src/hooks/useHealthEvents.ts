import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { api } from "../api/client"
import { HealthEvent, HealthEventRequest, Page } from "../types/api"

export function useHealthEvents(petId: number | undefined) {
    return useQuery({
        queryKey: ["healthEvents", petId],
        queryFn: async () => {
            const { data } = await api.get<Page<HealthEvent>>("/health-events", {
                params: { petId, size: 100, sortBy: "eventDate", direction: "desc" },
            })
            return data.content
        },
        enabled: petId != null,
    })
}

export function useCreateHealthEvent() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (payload: HealthEventRequest) => {
            const { data } = await api.post<HealthEvent>("/health-events", payload)
            return data
        },
        onSuccess: (created) => {
            queryClient.invalidateQueries({ queryKey: ["healthEvents", created.petId] })
            queryClient.invalidateQueries({ queryKey: ["gamification"] })
        },
    })
}

export function useUpdateHealthEvent() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async ({ id, payload }: { id: number; payload: HealthEventRequest }) => {
            const { data } = await api.put<HealthEvent>(`/health-events/${id}`, payload)
            return data
        },
        onSuccess: (updated) => {
            queryClient.invalidateQueries({ queryKey: ["healthEvents", updated.petId] })
            queryClient.invalidateQueries({ queryKey: ["gamification"] })
        },
    })
}

export function useDeleteHealthEvent() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async ({ id }: { id: number; petId: number }) => {
            await api.delete(`/health-events/${id}`)
        },
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["healthEvents", variables.petId] })
        },
    })
}

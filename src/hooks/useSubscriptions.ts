import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { api } from "../api/client"
import { Page, Subscription, SubscriptionRequest, SubscriptionStatus } from "../types/api"

export function useSubscriptions(petId: number | undefined) {
    return useQuery({
        queryKey: ["subscriptions", petId],
        queryFn: async () => {
            const { data } = await api.get<Page<Subscription>>("/subscriptions", {
                params: { petId, size: 50, sortBy: "createdAt", direction: "desc" },
            })
            return data.content
        },
        enabled: petId != null,
    })
}

export function useCreateSubscription() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (payload: SubscriptionRequest) => {
            const { data } = await api.post<Subscription>("/subscriptions", payload)
            return data
        },
        onSuccess: (created) => {
            queryClient.invalidateQueries({ queryKey: ["subscriptions", created.petId] })
            queryClient.invalidateQueries({ queryKey: ["gamification"] })
        },
    })
}

export function useUpdateSubscriptionStatus() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async ({ id, status }: { id: number; petId: number; status: SubscriptionStatus }) => {
            const { data } = await api.put<Subscription>(`/subscriptions/${id}/status`, null, {
                params: { status },
            })
            return data
        },
        onSuccess: (_updated, variables) => {
            queryClient.invalidateQueries({ queryKey: ["subscriptions", variables.petId] })
        },
    })
}

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { SubscriptionRequest, SubscriptionStatus } from "../types/api"
import {
    createSubscription,
    listSubscriptions,
    updateSubscriptionStatus,
} from "../services/subscriptionService"
import { runWithRewardCheck } from "../services/rewardAlertService"

export function useSubscriptions(petId: number | undefined) {
    return useQuery({
        queryKey: ["subscriptions", petId],
        queryFn: () => listSubscriptions(petId!),
        enabled: petId != null,
    })
}

export function useCreateSubscription() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (payload: SubscriptionRequest) => runWithRewardCheck(() => createSubscription(payload)),
        onSuccess: (created) => {
            queryClient.invalidateQueries({ queryKey: ["subscriptions", created.petId] })
            queryClient.invalidateQueries({ queryKey: ["gamification"] })
        },
    })
}

export function useUpdateSubscriptionStatus() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, status }: { id: number; petId: number; status: SubscriptionStatus }) =>
            updateSubscriptionStatus(id, status),
        onSuccess: (_updated, variables) => {
            queryClient.invalidateQueries({ queryKey: ["subscriptions", variables.petId] })
        },
    })
}

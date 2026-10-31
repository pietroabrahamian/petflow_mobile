import { api } from "../api/client"
import { Page, Subscription, SubscriptionRequest, SubscriptionStatus } from "../types/api"

export async function listSubscriptions(petId: number): Promise<Subscription[]> {
    const { data } = await api.get<Page<Subscription>>("/subscriptions", {
        params: { petId, size: 50, sortBy: "createdAt", direction: "desc" },
    })
    return data.content
}

export async function createSubscription(payload: SubscriptionRequest): Promise<Subscription> {
    const { data } = await api.post<Subscription>("/subscriptions", payload)
    return data
}

export async function updateSubscriptionStatus(id: number, status: SubscriptionStatus): Promise<Subscription> {
    const { data } = await api.put<Subscription>(`/subscriptions/${id}/status`, null, {
        params: { status },
    })
    return data
}

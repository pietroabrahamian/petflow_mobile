import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { api } from "../api/client"
import { CouponCatalogItem, Page, Redeem, TutorPoints } from "../types/api"

export function useTutorPoints() {
    return useQuery({
        queryKey: ["gamification", "points"],
        queryFn: async () => {
            const { data } = await api.get<TutorPoints>("/gamification/points")
            return data
        },
    })
}

export function useAvailableCoupons() {
    return useQuery({
        queryKey: ["gamification", "coupons"],
        queryFn: async () => {
            const { data } = await api.get<Page<CouponCatalogItem>>("/gamification/coupons/available", {
                params: { size: 50 },
            })
            return data.content
        },
    })
}

export function useRedeemCoupon() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (couponId: number) => {
            const { data } = await api.post<Redeem>("/gamification/redeem", { couponId })
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["gamification"] })
            queryClient.invalidateQueries({ queryKey: ["redeems"] })
        },
    })
}

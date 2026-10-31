import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getTutorPoints, listAvailableCoupons, redeemCoupon } from "../services/gamificationService"

export function useTutorPoints() {
    return useQuery({
        queryKey: ["gamification", "points"],
        queryFn: getTutorPoints,
    })
}

export function useAvailableCoupons() {
    return useQuery({
        queryKey: ["gamification", "coupons"],
        queryFn: listAvailableCoupons,
    })
}

export function useRedeemCoupon() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (couponId: number) => redeemCoupon(couponId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["gamification"] })
            queryClient.invalidateQueries({ queryKey: ["redeems"] })
        },
    })
}

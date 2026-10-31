import { api } from "../api/client"
import { CouponCatalogItem, Page, Redeem, TutorPoints } from "../types/api"

export async function getTutorPoints(): Promise<TutorPoints> {
    const { data } = await api.get<TutorPoints>("/gamification/points")
    return data
}

export async function listAvailableCoupons(): Promise<CouponCatalogItem[]> {
    const { data } = await api.get<Page<CouponCatalogItem>>("/gamification/coupons/available", {
        params: { size: 50 },
    })
    return data.content
}

export async function redeemCoupon(couponId: number): Promise<Redeem> {
    const { data } = await api.post<Redeem>("/gamification/redeem", { couponId })
    return data
}

export async function listRedeems(tutorId: number): Promise<Redeem[]> {
    const { data } = await api.get<Page<Redeem>>("/redeems", {
        params: { tutorId, size: 20, sortBy: "createdAt", direction: "desc" },
    })
    return data.content
}

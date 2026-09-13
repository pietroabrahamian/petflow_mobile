import { useQuery } from "@tanstack/react-query"
import { api } from "../api/client"
import { Page, Redeem } from "../types/api"
import { useAuth } from "../contexts/AuthContext"

export function useMyRedeems() {
    const { user } = useAuth()

    return useQuery({
        queryKey: ["redeems", user?.id],
        queryFn: async () => {
            const { data } = await api.get<Page<Redeem>>("/redeems", {
                params: { tutorId: user!.id, size: 20, sortBy: "createdAt", direction: "desc" },
            })
            return data.content
        },
        enabled: !!user,
    })
}

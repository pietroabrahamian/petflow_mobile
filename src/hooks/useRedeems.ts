import { useQuery } from "@tanstack/react-query"
import { useAuth } from "../contexts/AuthContext"
import { listRedeems } from "../services/gamificationService"

export function useMyRedeems() {
    const { user } = useAuth()

    return useQuery({
        queryKey: ["redeems", user?.id],
        queryFn: () => listRedeems(user!.id),
        enabled: !!user,
    })
}

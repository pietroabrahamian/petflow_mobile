import { useQuery } from "@tanstack/react-query"
import { api } from "../api/client"
import { Page, Plan } from "../types/api"

export function usePlansByClinic(clinicId: number, enabled: boolean) {
    return useQuery({
        queryKey: ["plans", clinicId],
        queryFn: async () => {
            const { data } = await api.get<Page<Plan>>("/plans", {
                params: { clinicId, size: 50 },
            })
            return data.content
        },
        enabled,
    })
}

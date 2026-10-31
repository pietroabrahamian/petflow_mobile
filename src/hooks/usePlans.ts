import { useQuery } from "@tanstack/react-query"
import { listPlansByClinic } from "../services/clinicService"

export function usePlansByClinic(clinicId: number, enabled: boolean) {
    return useQuery({
        queryKey: ["plans", clinicId],
        queryFn: () => listPlansByClinic(clinicId),
        enabled,
    })
}

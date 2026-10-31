import { useQuery } from "@tanstack/react-query"
import { listClinics } from "../services/clinicService"

export function useClinics() {
    return useQuery({
        queryKey: ["clinics"],
        queryFn: listClinics,
    })
}

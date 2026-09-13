import { useQuery } from "@tanstack/react-query"
import { api } from "../api/client"
import { Clinic, Page } from "../types/api"

export function useClinics() {
    return useQuery({
        queryKey: ["clinics"],
        queryFn: async () => {
            const { data } = await api.get<Page<Clinic>>("/clinics", {
                params: { size: 100, sortBy: "name", direction: "asc" },
            })
            return data.content
        },
    })
}

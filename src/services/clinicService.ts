import { api } from "../api/client"
import { Clinic, Page, Plan } from "../types/api"

export async function listClinics(): Promise<Clinic[]> {
    const { data } = await api.get<Page<Clinic>>("/clinics", {
        params: { size: 100, sortBy: "name", direction: "asc" },
    })
    return data.content
}

export async function listPlansByClinic(clinicId: number): Promise<Plan[]> {
    const { data } = await api.get<Page<Plan>>("/plans", {
        params: { clinicId, size: 50 },
    })
    return data.content
}

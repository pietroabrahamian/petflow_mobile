import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { api } from "../api/client"
import { Page, Pet, PetRequest } from "../types/api"
import { useAuth } from "../contexts/AuthContext"

export function usePets() {
    const { user } = useAuth()

    return useQuery({
        queryKey: ["pets", user?.id],
        queryFn: async () => {
            const { data } = await api.get<Page<Pet>>("/pets", {
                params: { tutorId: user!.id, size: 100, sortBy: "name", direction: "asc" },
            })
            return data.content
        },
        enabled: !!user,
    })
}

export function usePet(petId: number | undefined) {
    return useQuery({
        queryKey: ["pets", "detail", petId],
        queryFn: async () => {
            const { data } = await api.get<Pet>(`/pets/${petId}`)
            return data
        },
        enabled: petId != null,
    })
}

export function useCreatePet() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (payload: PetRequest) => {
            const { data } = await api.post<Pet>("/pets", payload)
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["pets"] })
        },
    })
}

export function useUpdatePet() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async ({ id, payload }: { id: number; payload: PetRequest }) => {
            const { data } = await api.put<Pet>(`/pets/${id}`, payload)
            return data
        },
        onSuccess: (updated) => {
            queryClient.invalidateQueries({ queryKey: ["pets"] })
            queryClient.invalidateQueries({ queryKey: ["pets", "detail", updated.id] })
        },
    })
}

export function useDeletePet() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (id: number) => {
            await api.delete(`/pets/${id}`)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["pets"] })
        },
    })
}

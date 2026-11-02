import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { PetRequest } from "../types/api"
import { useAuth } from "../contexts/AuthContext"
import { createPet, deletePet, getPet, listPets, updatePet } from "../services/petService"
import { runWithRewardCheck } from "../services/rewardAlertService"

export function usePets() {
    const { user } = useAuth()

    return useQuery({
        queryKey: ["pets", user?.id],
        queryFn: () => listPets(user!.id),
        enabled: !!user,
    })
}

export function usePet(petId: number | undefined) {
    return useQuery({
        queryKey: ["pets", "detail", petId],
        queryFn: () => getPet(petId!),
        enabled: petId != null,
    })
}

export function useCreatePet() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (payload: PetRequest) => runWithRewardCheck(() => createPet(payload)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["pets"] })
            queryClient.invalidateQueries({ queryKey: ["gamification"] })
        },
    })
}

export function useUpdatePet() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, payload }: { id: number; payload: PetRequest }) => updatePet(id, payload),
        onSuccess: (updated) => {
            queryClient.invalidateQueries({ queryKey: ["pets"] })
            queryClient.invalidateQueries({ queryKey: ["pets", "detail", updated.id] })
        },
    })
}

export function useDeletePet() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id: number) => deletePet(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["pets"] })
        },
    })
}

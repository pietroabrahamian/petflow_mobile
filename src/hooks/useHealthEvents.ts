import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { HealthEvent, HealthEventRequest } from "../types/api"
import {
    createHealthEvent,
    deleteHealthEvent,
    listHealthEvents,
    updateHealthEvent,
} from "../services/healthEventService"
import { runWithRewardCheck } from "../services/rewardAlertService"
import { cancelVaccineReminder, syncVaccineReminder } from "../services/vaccineReminderService"

export type SavedHealthEvent = {
    event: HealthEvent
    /** Data do lembrete de reforço agendado (só para vacina realizada) */
    reminderDate: Date | null
}

// O lembrete é um extra: se falhar, o evento continua salvo
async function withReminder(event: HealthEvent): Promise<SavedHealthEvent> {
    const reminderDate = await syncVaccineReminder(event).catch(() => null)
    return { event, reminderDate }
}

export function useHealthEvents(petId: number | undefined) {
    return useQuery({
        queryKey: ["healthEvents", petId],
        queryFn: () => listHealthEvents(petId!),
        enabled: petId != null,
    })
}

export function useCreateHealthEvent() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (payload: HealthEventRequest) =>
            withReminder(await runWithRewardCheck(() => createHealthEvent(payload))),
        onSuccess: ({ event }) => {
            queryClient.invalidateQueries({ queryKey: ["healthEvents", event.petId] })
            queryClient.invalidateQueries({ queryKey: ["gamification"] })
        },
    })
}

export function useUpdateHealthEvent() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async ({ id, payload }: { id: number; payload: HealthEventRequest }) =>
            withReminder(await runWithRewardCheck(() => updateHealthEvent(id, payload))),
        onSuccess: ({ event }) => {
            queryClient.invalidateQueries({ queryKey: ["healthEvents", event.petId] })
            queryClient.invalidateQueries({ queryKey: ["gamification"] })
        },
    })
}

export function useDeleteHealthEvent() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async ({ id }: { id: number; petId: number }) => {
            await deleteHealthEvent(id)
            await cancelVaccineReminder(id).catch(() => {})
        },
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["healthEvents", variables.petId] })
        },
    })
}

import { HealthEvent } from "../types/api"
import { formatDateBR } from "../utils/date"
import { cancelNotification, scheduleNotification } from "./notificationService"
import { getPreferences } from "./preferencesService"
import { listEventTypes } from "./referenceDataService"

// Vacinas de cães e gatos têm reforço anual; o lembrete chega uma semana antes
const BOOSTER_INTERVAL_MONTHS = 12
const REMINDER_DAYS_BEFORE = 7
const REMINDER_HOUR = 9

function reminderId(eventId: number): string {
    return `vaccine-${eventId}`
}

function isVaccine(eventTypeName: string): boolean {
    return eventTypeName.toLowerCase().includes("vacin")
}

// Monta a data no fuso local: new Date("2026-10-31") seria meia-noite UTC, o dia anterior no Brasil
function toLocalDate(isoDate: string): Date {
    const [yyyy, mm, dd] = isoDate.split("T")[0].split("-").map(Number)
    return new Date(yyyy, mm - 1, dd)
}

function toIsoDate(date: Date): string {
    const mm = String(date.getMonth() + 1).padStart(2, "0")
    const dd = String(date.getDate()).padStart(2, "0")
    return `${date.getFullYear()}-${mm}-${dd}`
}

/**
 * Agenda (ou reagenda) o lembrete de reforço de uma vacina realizada.
 * Devolve a data do lembrete, ou null se esse evento não gera lembrete.
 */
export async function syncVaccineReminder(event: HealthEvent): Promise<Date | null> {
    await cancelNotification(reminderId(event.id))

    const preferences = await getPreferences()
    if (!preferences.healthAlerts || event.status !== "REALIZADO") return null

    const eventTypes = await listEventTypes()
    const eventType = eventTypes.find((type) => type.id === event.eventTypeId)
    if (!eventType || !isVaccine(eventType.name)) return null

    const dueDate = toLocalDate(event.eventDate)
    dueDate.setMonth(dueDate.getMonth() + BOOSTER_INTERVAL_MONTHS)

    const reminderDate = new Date(dueDate)
    reminderDate.setDate(reminderDate.getDate() - REMINDER_DAYS_BEFORE)
    reminderDate.setHours(REMINDER_HOUR, 0, 0, 0)
    if (reminderDate.getTime() <= Date.now()) return null

    const scheduled = await scheduleNotification(
        reminderId(event.id),
        reminderDate,
        `Reforço de vacina: ${event.petName}`,
        `A vacina de ${event.petName} vence em ${formatDateBR(toIsoDate(dueDate))}. Agende o reforço na clínica.`,
        { screen: "PetDetailsScreen", petId: event.petId }
    )
    return scheduled ? reminderDate : null
}

export async function cancelVaccineReminder(eventId: number): Promise<void> {
    await cancelNotification(reminderId(eventId))
}

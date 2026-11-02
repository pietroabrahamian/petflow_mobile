import { Platform } from "react-native"
import {
    AndroidImportance,
    cancelAllScheduledNotificationsAsync,
    cancelScheduledNotificationAsync,
    getPermissionsAsync,
    requestPermissionsAsync,
    SchedulableTriggerInputTypes,
    scheduleNotificationAsync,
    setNotificationChannelAsync,
    setNotificationHandler,
} from "./expoNotifications"

const CHANNEL_ID = "petflow"

/** Para onde o app vai quando o usuário toca na notificação */
export type NotificationTarget =
    | { screen: "RewardsScreen" }
    | { screen: "PetDetailsScreen"; petId: number }

// Mostra a notificação mesmo com o app aberto
setNotificationHandler({
    handleNotification: async () => ({
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
})

export async function requestNotificationPermission(): Promise<boolean> {
    if (Platform.OS === "android") {
        await setNotificationChannelAsync(CHANNEL_ID, {
            name: "PetFlow",
            importance: AndroidImportance.HIGH,
        })
    }

    const current = await getPermissionsAsync()
    if (current.granted) return true

    const { granted } = await requestPermissionsAsync()
    return granted
}

export async function showNotificationNow(title: string, body: string, target: NotificationTarget): Promise<void> {
    if (!(await requestNotificationPermission())) return

    await scheduleNotificationAsync({
        content: { title, body, data: target },
        trigger: null,
    })
}

export async function scheduleNotification(
    id: string,
    date: Date,
    title: string,
    body: string,
    target: NotificationTarget
): Promise<boolean> {
    if (!(await requestNotificationPermission())) return false

    await scheduleNotificationAsync({
        identifier: id,
        content: { title, body, data: target },
        trigger: { type: SchedulableTriggerInputTypes.DATE, date, channelId: CHANNEL_ID },
    })
    return true
}

export async function cancelNotification(id: string): Promise<void> {
    await cancelScheduledNotificationAsync(id)
}

export async function cancelAllNotifications(): Promise<void> {
    await cancelAllScheduledNotificationsAsync()
}

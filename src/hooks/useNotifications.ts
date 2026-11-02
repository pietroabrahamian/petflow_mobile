import { useEffect } from "react"
import { navigationRef } from "../navigation/navigationRef"
import {
    addNotificationResponseReceivedListener,
    getLastNotificationResponseAsync,
    NotificationResponse,
} from "../services/expoNotifications"
import { NotificationTarget, requestNotificationPermission } from "../services/notificationService"
import { getPet } from "../services/petService"

async function openTarget(response: NotificationResponse) {
    const target = response.notification.request.content.data as NotificationTarget | undefined
    if (!target || !navigationRef.isReady()) return

    if (target.screen === "RewardsScreen") {
        navigationRef.navigate("MainTabs", { screen: "RewardsScreen" })
    } else if (target.screen === "PetDetailsScreen") {
        const pet = await getPet(target.petId)
        navigationRef.navigate("PetDetailsScreen", { pet })
    }
}

/** Pede permissão ao entrar e leva o usuário para a tela certa ao tocar na notificação. */
export function useNotifications() {
    useEffect(() => {
        requestNotificationPermission().catch(() => {})

        // App aberto pelo toque numa notificação (estava fechado)
        getLastNotificationResponseAsync()
            .then((response) => response && openTarget(response))
            .catch(() => {})

        const subscription = addNotificationResponseReceivedListener((response) => {
            openTarget(response).catch((error) => console.log("[useNotifications]", error))
        })
        return () => subscription.remove()
    }, [])
}

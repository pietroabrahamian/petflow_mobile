import { useEffect, useState } from "react"
import { getPreferences, Preferences, savePreference } from "../services/preferencesService"
import { cancelAllNotifications } from "../services/notificationService"

/** Preferências de notificação da tela de Ajustes (o tema fica no ThemeContext). */
export function usePreferences() {
    const [preferences, setPreferences] = useState<Preferences | null>(null)

    useEffect(() => {
        getPreferences().then(setPreferences)
    }, [])

    const setRewardAlerts = async (enabled: boolean) => {
        setPreferences(await savePreference("rewardAlerts", enabled))
    }

    const setHealthAlerts = async (enabled: boolean) => {
        setPreferences(await savePreference("healthAlerts", enabled))
        // Os únicos agendamentos do app são lembretes de vacina
        if (!enabled) await cancelAllNotifications().catch(() => {})
    }

    return { preferences, setRewardAlerts, setHealthAlerts }
}

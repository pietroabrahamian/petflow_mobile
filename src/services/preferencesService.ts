import AsyncStorage from "@react-native-async-storage/async-storage"

export type ThemeMode = "system" | "light" | "dark"

export type Preferences = {
    /** Avisos de pontos ganhos e cupons liberados */
    rewardAlerts: boolean
    /** Lembretes de reforço de vacina */
    healthAlerts: boolean
    themeMode: ThemeMode
}

const PREFERENCES_KEY = "@petflow:preferences"

const DEFAULT_PREFERENCES: Preferences = {
    rewardAlerts: true,
    healthAlerts: true,
    themeMode: "system",
}

export async function getPreferences(): Promise<Preferences> {
    try {
        const raw = await AsyncStorage.getItem(PREFERENCES_KEY)
        return raw ? { ...DEFAULT_PREFERENCES, ...JSON.parse(raw) } : DEFAULT_PREFERENCES
    } catch {
        return DEFAULT_PREFERENCES
    }
}

export async function savePreference<K extends keyof Preferences>(key: K, value: Preferences[K]): Promise<Preferences> {
    const updated = { ...(await getPreferences()), [key]: value }
    await AsyncStorage.setItem(PREFERENCES_KEY, JSON.stringify(updated))
    return updated
}

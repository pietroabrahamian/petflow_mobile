import { createContext, ReactNode, useContext, useEffect, useState } from "react"
import { useColorScheme } from "react-native"
import { darkColors, lightColors, Palette } from "../theme/colors"
import { getPreferences, savePreference, ThemeMode } from "../services/preferencesService"

type ThemeContextValue = {
    colors: Palette
    isDark: boolean
    /** Escolha do usuário em Ajustes; "system" segue o tema do celular */
    mode: ThemeMode
    setMode: (mode: ThemeMode) => void
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
    const systemScheme = useColorScheme()
    const [mode, setModeState] = useState<ThemeMode>("system")

    useEffect(() => {
        getPreferences().then((preferences) => setModeState(preferences.themeMode))
    }, [])

    const setMode = (newMode: ThemeMode) => {
        setModeState(newMode)
        savePreference("themeMode", newMode)
    }

    const isDark = mode === "dark" || (mode === "system" && systemScheme === "dark")

    return (
        <ThemeContext.Provider value={{ colors: isDark ? darkColors : lightColors, isDark, mode, setMode }}>
            {children}
        </ThemeContext.Provider>
    )
}

export function useTheme(): ThemeContextValue {
    const context = useContext(ThemeContext)
    if (!context) {
        throw new Error("useTheme precisa ser usado dentro de um ThemeProvider")
    }
    return context
}

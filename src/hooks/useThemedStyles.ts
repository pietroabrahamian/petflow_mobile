import { useMemo } from "react"
import { useTheme } from "../contexts/ThemeContext"
import { Palette } from "../theme/colors"

/** Recria o StyleSheet só quando o tema muda. Uso: const styles = useThemedStyles(createStyles) */
export function useThemedStyles<T>(createStyles: (colors: Palette) => T): T {
    const { colors } = useTheme()
    return useMemo(() => createStyles(colors), [colors, createStyles])
}

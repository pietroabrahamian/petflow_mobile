import { ActivityIndicator, StyleSheet, Text, View } from "react-native"
import { Palette } from "../theme/colors"
import { useTheme } from "../contexts/ThemeContext"
import { useThemedStyles } from "../hooks/useThemedStyles"

export default function LoadingView({ label = "Carregando..." }: { label?: string }) {
    const { colors } = useTheme()
    const styles = useThemedStyles(createStyles)
    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.label}>{label}</Text>
        </View>
    )
}

const createStyles = (colors: Palette) => StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
    },
    label: {
        color: colors.textSecondary,
        fontSize: 14,
    },
})

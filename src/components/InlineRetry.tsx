import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import MaterialIcons from "@expo/vector-icons/MaterialIcons"
import { Palette } from "../theme/colors"
import { useTheme } from "../contexts/ThemeContext"
import { useThemedStyles } from "../hooks/useThemedStyles"

export default function InlineRetry({
    message = "Não foi possível carregar os dados.",
    onRetry,
}: {
    message?: string
    onRetry: () => void
}) {
    const { colors } = useTheme()
    const styles = useThemedStyles(createStyles)
    return (
        <View style={styles.container}>
            <MaterialIcons name="cloud-off" size={22} color={colors.danger} />
            <Text style={styles.message}>{message}</Text>
            <TouchableOpacity style={styles.button} onPress={onRetry}>
                <Text style={styles.buttonText}>Tentar novamente</Text>
            </TouchableOpacity>
        </View>
    )
}

const createStyles = (colors: Palette) => StyleSheet.create({
    container: {
        alignItems: "center",
        paddingVertical: 16,
        gap: 8,
    },
    message: {
        color: colors.textSecondary,
        fontSize: 13,
        textAlign: "center",
    },
    button: {
        backgroundColor: colors.primary,
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    buttonText: {
        color: colors.surface,
        fontWeight: "bold",
        fontSize: 13,
    },
})

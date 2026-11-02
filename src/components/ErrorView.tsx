import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import MaterialIcons from "@expo/vector-icons/MaterialIcons"
import { Palette } from "../theme/colors"
import { useTheme } from "../contexts/ThemeContext"
import { useThemedStyles } from "../hooks/useThemedStyles"

export default function ErrorView({
    message = "Não foi possível carregar os dados.",
    onRetry,
}: {
    message?: string
    onRetry?: () => void
}) {
    const { colors } = useTheme()
    const styles = useThemedStyles(createStyles)
    return (
        <View style={styles.container}>
            <MaterialIcons name="cloud-off" size={40} color={colors.danger} />
            <Text style={styles.message}>{message}</Text>
            {onRetry && (
                <TouchableOpacity style={styles.button} onPress={onRetry}>
                    <Text style={styles.buttonText}>Tentar novamente</Text>
                </TouchableOpacity>
            )}
        </View>
    )
}

const createStyles = (colors: Palette) => StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 32,
        gap: 12,
    },
    message: {
        color: colors.textSecondary,
        fontSize: 14,
        textAlign: "center",
    },
    button: {
        marginTop: 8,
        backgroundColor: colors.primary,
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    buttonText: {
        color: colors.surface,
        fontWeight: "bold",
    },
})

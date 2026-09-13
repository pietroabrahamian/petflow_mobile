import { ActivityIndicator, StyleSheet, Text, View } from "react-native"
import { colors } from "../theme/colors"

export default function LoadingView({ label = "Carregando..." }: { label?: string }) {
    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.label}>{label}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
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

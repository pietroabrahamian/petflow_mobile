import { View, Text, StyleSheet, ScrollView } from "react-native"
import MaterialIcons from "@expo/vector-icons/MaterialIcons"

import { API_BASE_URL } from "../api/config"
import { appInfo } from "../utils/appInfo"
import { Palette } from "../theme/colors"
import { useTheme } from "../contexts/ThemeContext"
import { useThemedStyles } from "../hooks/useThemedStyles"

const TEAM = [
    { name: "Lucas Grillo Alcântara", rm: "561413" },
    { name: "Pietro Ferreira Gomes Abrahamian", rm: "561469" },
    { name: "Pedro Peres Benitez", rm: "561792" },
    { name: "Lucca Ramos Mussumecci", rm: "562027" },
]

function InfoRow({ label, value }: { label: string; value: string }) {
    const styles = useThemedStyles(createStyles)
    return (
        <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{label}</Text>
            <Text style={styles.infoValue} selectable>{value}</Text>
        </View>
    )
}

export default function AboutScreen() {
    const { colors } = useTheme()
    const styles = useThemedStyles(createStyles)

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
            <View style={styles.header}>
                <MaterialIcons name="pets" size={48} color={colors.primary} />
                <Text style={styles.appName}>{appInfo.name}</Text>
                <Text style={styles.tagline}>Saúde contínua do seu pet em um só lugar</Text>
            </View>

            <Text style={styles.sectionTitle}>VERSÃO PUBLICADA</Text>
            <View style={styles.card}>
                <InfoRow label="Versão" value={appInfo.version} />
                <InfoRow label="Commit de referência" value={appInfo.commitHash} />
                <InfoRow label="Data do build" value={appInfo.buildDate} />
                <InfoRow label="API" value={API_BASE_URL} />
            </View>

            <Text style={styles.sectionTitle}>EQUIPE</Text>
            <View style={styles.card}>
                {TEAM.map((member) => (
                    <InfoRow key={member.rm} label={`RM ${member.rm}`} value={member.name} />
                ))}
            </View>

            <Text style={styles.footer}>Challenge FIAP 2026 — 2TDSPX</Text>
        </ScrollView>
    )
}

const createStyles = (colors: Palette) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        alignItems: "center",
        marginBottom: 24,
        gap: 4,
    },
    appName: {
        fontSize: 26,
        fontWeight: "bold",
        color: colors.textPrimary,
    },
    tagline: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: "bold",
        color: colors.textLabel,
        marginBottom: 8,
        marginTop: 8,
    },
    card: {
        backgroundColor: colors.surface,
        borderRadius: 8,
        paddingHorizontal: 14,
        marginBottom: 16,
    },
    infoRow: {
        paddingVertical: 12,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: colors.border,
    },
    infoLabel: {
        fontSize: 12,
        color: colors.textMuted,
    },
    infoValue: {
        fontSize: 15,
        color: colors.textPrimary,
        marginTop: 2,
    },
    footer: {
        textAlign: "center",
        fontSize: 12,
        color: colors.textMuted,
        marginTop: 8,
        marginBottom: 24,
    },
})

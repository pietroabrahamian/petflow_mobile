import {
    View,
    Text,
    StyleSheet,
    Switch,
    ScrollView,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { s } from "react-native-size-matters"
import { useNavigation } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import MaterialIcons from "@expo/vector-icons/MaterialIcons"

import { useAuth } from "../contexts/AuthContext"
import { useMyRedeems } from "../hooks/useRedeems"
import { usePreferences } from "../hooks/usePreferences"
import { AppStackParamList } from "../navigation/types"
import { ThemeMode } from "../services/preferencesService"
import { signOut } from "../services/authService"
import { Palette } from "../theme/colors"
import { useTheme } from "../contexts/ThemeContext"
import { useThemedStyles } from "../hooks/useThemedStyles"

const THEME_OPTIONS: { value: ThemeMode; label: string; icon: "brightness-auto" | "light-mode" | "dark-mode" }[] = [
    { value: "system", label: "Sistema", icon: "brightness-auto" },
    { value: "light", label: "Claro", icon: "light-mode" },
    { value: "dark", label: "Escuro", icon: "dark-mode" },
]

export default function SettingsScreen() {
    const { colors } = useTheme()
    const styles = useThemedStyles(createStyles)
    const { user } = useAuth()
    const { data: redeems, isLoading: redeemsLoading } = useMyRedeems()

    const { mode, setMode } = useTheme()
    const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>()
    const { preferences, setRewardAlerts, setHealthAlerts } = usePreferences()

    const handleLogout = () => {
        Alert.alert("Sair", "Deseja encerrar a sessão?", [
            { text: "Cancelar", style: "cancel" },
            { text: "Sair", style: "destructive", onPress: () => signOut() },
        ])
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.title}>Ajustes</Text>

                <Text style={styles.sectionTitle}>PERFIL</Text>
                <View style={styles.profileCard}>
                    <View style={styles.avatar}>
                        <MaterialIcons name="person" size={28} color={colors.primary} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.profileName}>{user?.name}</Text>
                        <Text style={styles.profileEmail}>{user?.email}</Text>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>APARÊNCIA</Text>
                <View style={styles.themeRow}>
                    {THEME_OPTIONS.map((option) => (
                        <TouchableOpacity
                            key={option.value}
                            style={[styles.themeOption, mode === option.value && styles.themeOptionActive]}
                            onPress={() => setMode(option.value)}
                        >
                            <MaterialIcons
                                name={option.icon}
                                size={18}
                                color={mode === option.value ? colors.onPrimary : colors.textSecondary}
                            />
                            <Text style={[styles.themeOptionText, mode === option.value && styles.themeOptionTextActive]}>
                                {option.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <Text style={styles.sectionTitle}>NOTIFICAÇÕES</Text>

                <View style={styles.switchRow}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.switchLabel}>Pontos e cupons</Text>
                        <Text style={styles.switchHelp}>Avisar quando ganhar pontos ou liberar um cupom</Text>
                    </View>
                    <Switch
                        value={preferences?.rewardAlerts ?? true}
                        onValueChange={setRewardAlerts}
                        trackColor={{ false: colors.switchTrackOff, true: colors.primary }}
                        thumbColor={colors.onPrimary}
                    />
                </View>

                <View style={styles.switchRow}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.switchLabel}>Alertas de saúde</Text>
                        <Text style={styles.switchHelp}>Lembrete do reforço anual das vacinas</Text>
                    </View>
                    <Switch
                        value={preferences?.healthAlerts ?? true}
                        onValueChange={setHealthAlerts}
                        trackColor={{ false: colors.switchTrackOff, true: colors.primary }}
                        thumbColor={colors.onPrimary}
                    />
                </View>

                <Text style={styles.sectionTitle}>HISTÓRICO DE RESGATES</Text>
                <View style={styles.historyCard}>
                    {redeemsLoading ? (
                        <ActivityIndicator color={colors.primary} style={{ paddingVertical: 12 }} />
                    ) : !redeems || redeems.length === 0 ? (
                        <Text style={styles.emptyText}>Nenhum cupom resgatado ainda</Text>
                    ) : (
                        redeems.map((redeem, idx) => (
                            <View key={redeem.id}>
                                <View style={styles.historyRow}>
                                    <MaterialIcons name="local-offer" size={18} color={colors.primary} />
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.historyCode}>{redeem.couponCode}</Text>
                                        <Text style={styles.historyDate}>
                                            {new Date(redeem.createdAt).toLocaleDateString('pt-BR')} • {redeem.pointsUsed} pts
                                        </Text>
                                    </View>
                                </View>
                                {idx < redeems.length - 1 && <View style={styles.historySep} />}
                            </View>
                        ))
                    )}
                </View>

                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <MaterialIcons name="logout" size={18} color={colors.danger} />
                    <Text style={styles.logoutText}>Sair da conta</Text>
                </TouchableOpacity>

                <Text style={styles.sectionTitle}>SOBRE</Text>
                <TouchableOpacity style={styles.aboutCard} onPress={() => navigation.navigate("AboutScreen")}>
                    <MaterialIcons name="info-outline" size={20} color={colors.primary} />
                    <Text style={[styles.aboutLine, { flex: 1 }]}>Sobre o App</Text>
                    <MaterialIcons name="chevron-right" size={22} color={colors.textMuted} />
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    )
}

const createStyles = (colors: Palette) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        paddingTop: 20,
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 36,
        fontWeight: 'bold',
        marginBottom: 24,
        color: colors.textPrimary,
    },
    sectionTitle: {
        fontSize: s(12),
        color: colors.textLabel,
        marginTop: 14,
        marginBottom: 14,
    },
    profileCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        backgroundColor: colors.surface,
        borderRadius: 8,
        padding: 14,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: colors.primaryLight,
        alignItems: 'center',
        justifyContent: 'center',
    },
    profileName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.textPrimary,
    },
    profileEmail: {
        fontSize: 13,
        color: colors.textSecondary,
        marginTop: 2,
    },
    switchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 14,
        marginBottom: 10,
    },
    switchLabel: {
        fontSize: 15,
        color: colors.textPrimary,
    },
    switchHelp: {
        fontSize: 12,
        color: colors.textMuted,
        marginTop: 2,
    },
    historyCard: {
        backgroundColor: colors.surface,
        borderRadius: 8,
        padding: 14,
    },
    historyRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingVertical: 6,
    },
    historyCode: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.textPrimary,
    },
    historyDate: {
        fontSize: 12,
        color: colors.textMuted,
        marginTop: 2,
    },
    historySep: {
        height: 1,
        backgroundColor: colors.border,
        marginVertical: 4,
    },
    emptyText: {
        color: colors.textMuted,
        fontSize: 13,
        textAlign: 'center',
        paddingVertical: 8,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: colors.surface,
        borderRadius: 8,
        paddingVertical: 14,
        marginTop: 20,
        borderWidth: 1,
        borderColor: colors.danger,
    },
    logoutText: {
        color: colors.danger,
        fontSize: 15,
        fontWeight: 'bold',
    },
    aboutCard: {
        backgroundColor: colors.surface,
        borderRadius: 8,
        padding: 14,
        marginBottom: 30,
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    themeRow: {
        flexDirection: "row",
        gap: 8,
    },
    themeOption: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        paddingVertical: 10,
        borderRadius: 8,
        backgroundColor: colors.surface,
    },
    themeOptionActive: {
        backgroundColor: colors.primary,
    },
    themeOptionText: {
        fontSize: 13,
        color: colors.textSecondary,
    },
    themeOptionTextActive: {
        color: colors.onPrimary,
        fontWeight: "bold",
    },
    aboutLine: {
        fontSize: 13,
        color: colors.textSecondary,
        marginVertical: 2,
    },
})

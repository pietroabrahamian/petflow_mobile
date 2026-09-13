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
import { useState, useEffect } from "react"
import { s } from "react-native-size-matters"
import AsyncStorage from "@react-native-async-storage/async-storage"
import MaterialIcons from "@expo/vector-icons/MaterialIcons"

import { useAuth } from "../contexts/AuthContext"
import { useMyRedeems } from "../hooks/useRedeems"
import { colors } from "../theme/colors"

export default function SettingsScreen() {
    const { user, logout } = useAuth()
    const { data: redeems, isLoading: redeemsLoading } = useMyRedeems()

    const [notifications, setNotifications] = useState<boolean>(true)
    const [healthAlerts, setHealthAlerts] = useState<boolean>(true)

    useEffect(() => {
        loadPreferences()
    }, [])

    const loadPreferences = async () => {
        try {
            const storedNotif = await AsyncStorage.getItem("notifications")
            const storedAlerts = await AsyncStorage.getItem("healthAlerts")
            if (storedNotif !== null) setNotifications(storedNotif === "true")
            if (storedAlerts !== null) setHealthAlerts(storedAlerts === "true")
        } catch (error) {
            console.log("Erro ao carregar ajustes:", error)
        }
    }

    useEffect(() => {
        AsyncStorage.setItem("notifications", String(notifications))
    }, [notifications])

    useEffect(() => {
        AsyncStorage.setItem("healthAlerts", String(healthAlerts))
    }, [healthAlerts])

    const handleLogout = () => {
        Alert.alert("Sair", "Deseja encerrar a sessão?", [
            { text: "Cancelar", style: "cancel" },
            { text: "Sair", style: "destructive", onPress: () => logout() },
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

                <Text style={styles.sectionTitle}>NOTIFICAÇÕES</Text>

                <View style={styles.switchRow}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.switchLabel}>Notificações gerais</Text>
                        <Text style={styles.switchHelp}>Receber lembretes do app</Text>
                    </View>
                    <Switch
                        value={notifications}
                        onValueChange={setNotifications}
                        trackColor={{ false: "#bbb", true: colors.primary }}
                        thumbColor={'white'}
                    />
                </View>

                <View style={styles.switchRow}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.switchLabel}>Alertas de saúde</Text>
                        <Text style={styles.switchHelp}>Lembretes de vacinas e consultas</Text>
                    </View>
                    <Switch
                        value={healthAlerts}
                        onValueChange={setHealthAlerts}
                        trackColor={{ false: "#bbb", true: colors.primary }}
                        thumbColor={'white'}
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
                <View style={styles.aboutCard}>
                    <Text style={styles.aboutLine}>PetFlow Mobile v1.0.0</Text>
                    <Text style={styles.aboutLine}>Challenge FIAP 2026 — 2TDSPX</Text>
                    <Text style={styles.aboutLine}>Equipe: Lucas, Pietro, Pedro, Lucca</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
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
    },
    aboutLine: {
        fontSize: 13,
        color: colors.textSecondary,
        marginVertical: 2,
    },
})

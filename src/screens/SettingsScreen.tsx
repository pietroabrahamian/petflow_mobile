import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Switch,
    ScrollView
} from "react-native"
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context"
import { useState, useEffect } from "react"
import { s } from "react-native-size-matters"
import AsyncStorage from "@react-native-async-storage/async-storage"

import data from "../data/petflow.json"

export default function SettingsScreen() {
    const [notifications, setNotifications] = useState<boolean>(true)
    const [healthAlerts, setHealthAlerts] = useState<boolean>(true)
    const [tutorName, setTutorName] = useState<string>("")

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        try {
            const storedNotif = await AsyncStorage.getItem("notifications")
            const storedAlerts = await AsyncStorage.getItem("healthAlerts")
            const storedName = await AsyncStorage.getItem("tutorName")

            if (storedNotif !== null) {
                setNotifications(storedNotif === "true")
            }
            if (storedAlerts !== null) {
                setHealthAlerts(storedAlerts === "true")
            }
            if (storedName !== null) {
                setTutorName(storedName)
            } else {
                setTutorName(data.tutor.name)
            }
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

    useEffect(() => {
        if (tutorName) {
            AsyncStorage.setItem("tutorName", tutorName)
        }
    }, [tutorName])

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <Text style={styles.title}>Ajustes</Text>

                    <Text style={styles.sectionTitle}>PERFIL</Text>
                    <Text style={styles.label}>Nome do tutor</Text>
                    <TextInput
                        style={styles.input}
                        value={tutorName}
                        onChangeText={setTutorName}
                        placeholder="Seu nome"
                    />

                    <Text style={styles.label}>E-mail</Text>
                    <TextInput
                        style={[styles.input, styles.inputDisabled]}
                        value={data.tutor.email}
                        editable={false}
                    />

                    <Text style={styles.sectionTitle}>NOTIFICAÇÕES</Text>

                    <View style={styles.switchRow}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.switchLabel}>Notificações gerais</Text>
                            <Text style={styles.switchHelp}>Receber lembretes do app</Text>
                        </View>
                        <Switch
                            value={notifications}
                            onValueChange={setNotifications}
                            trackColor={{ false: "#bbb", true: "#2D6A4F" }}
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
                            trackColor={{ false: "#bbb", true: "#2D6A4F" }}
                            thumbColor={'white'}
                        />
                    </View>

                    <Text style={styles.sectionTitle}>SOBRE</Text>
                    <View style={styles.aboutCard}>
                        <Text style={styles.aboutLine}>PetFlow Mobile v1.0.0</Text>
                        <Text style={styles.aboutLine}>Challenge FIAP 2026 — 2TDSPX</Text>
                        <Text style={styles.aboutLine}>Equipe: Lucas, Pietro, Pedro, Lucca</Text>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </SafeAreaProvider>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F2F2F7",
        paddingTop: 20,
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 36,
        fontWeight: 'bold',
        marginBottom: 24,
        color: '#1a1a1a',
    },
    sectionTitle: {
        fontSize: s(12),
        color: '#8d8d8d',
        marginTop: 14,
        marginBottom: 14,
    },
    label: {
        fontSize: 13,
        color: '#3d3d3d',
        marginBottom: 6,
    },
    input: {
        height: 42,
        backgroundColor: "#fff",
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 14,
        fontSize: 15,
    },
    inputDisabled: {
        color: '#999',
        backgroundColor: '#ececec',
    },
    switchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 14,
        marginBottom: 10,
    },
    switchLabel: {
        fontSize: 15,
        color: '#1a1a1a',
    },
    switchHelp: {
        fontSize: 12,
        color: '#999',
        marginTop: 2,
    },
    aboutCard: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 14,
        marginBottom: 30,
    },
    aboutLine: {
        fontSize: 13,
        color: '#666',
        marginVertical: 2,
    },
})

import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useNavigation } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { useState } from "react"

import { useAuth } from "../../contexts/AuthContext"
import { AuthStackParamList } from "../../navigation/types"
import { colors } from "../../theme/colors"

export default function LoginScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>()
    const { login } = useAuth()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleLogin = async () => {
        if (!email.trim() || !password) {
            Alert.alert("Campos obrigatórios", "Informe e-mail e senha.")
            return
        }
        setIsSubmitting(true)
        try {
            await login(email.trim(), password)
        } catch (error) {
            Alert.alert("Não foi possível entrar", (error as Error).message)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
                    <Text style={styles.logo}>🐾 PetFlow</Text>
                    <Text style={styles.subtitle}>Entre para cuidar da saúde do seu pet</Text>

                    <Text style={styles.label}>E-MAIL</Text>
                    <TextInput
                        style={styles.input}
                        value={email}
                        onChangeText={setEmail}
                        placeholder="seuemail@exemplo.com"
                        autoCapitalize="none"
                        keyboardType="email-address"
                        autoComplete="email"
                    />

                    <Text style={styles.label}>SENHA</Text>
                    <TextInput
                        style={styles.input}
                        value={password}
                        onChangeText={setPassword}
                        placeholder="Sua senha"
                        secureTextEntry
                        autoComplete="password"
                    />

                    <TouchableOpacity
                        style={[styles.button, isSubmitting && styles.buttonDisabled]}
                        onPress={handleLogin}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <ActivityIndicator color={colors.surface} />
                        ) : (
                            <Text style={styles.buttonText}>Entrar</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.linkButton}
                        onPress={() => navigation.navigate("SignupScreen")}
                    >
                        <Text style={styles.linkText}>
                            Não tem conta? <Text style={styles.linkTextBold}>Cadastre-se</Text>
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        flexGrow: 1,
        justifyContent: "center",
        paddingHorizontal: 28,
    },
    logo: {
        fontSize: 34,
        fontWeight: "bold",
        color: colors.primary,
        textAlign: "center",
    },
    subtitle: {
        fontSize: 14,
        color: colors.textSecondary,
        textAlign: "center",
        marginTop: 6,
        marginBottom: 36,
    },
    label: {
        fontSize: 12,
        color: colors.formLabel,
        marginBottom: 6,
    },
    input: {
        height: 46,
        backgroundColor: colors.surface,
        borderRadius: 8,
        paddingHorizontal: 14,
        marginBottom: 18,
        fontSize: 15,
        borderWidth: 1,
        borderColor: colors.inputBorder,
    },
    button: {
        height: 48,
        backgroundColor: colors.primary,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 8,
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    buttonText: {
        color: colors.surface,
        fontSize: 16,
        fontWeight: "bold",
    },
    linkButton: {
        marginTop: 20,
        alignItems: "center",
    },
    linkText: {
        color: colors.textSecondary,
        fontSize: 13,
    },
    linkTextBold: {
        color: colors.primary,
        fontWeight: "bold",
    },
})

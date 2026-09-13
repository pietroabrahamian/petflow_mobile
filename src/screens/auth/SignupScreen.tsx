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

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/

export default function SignupScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>()
    const { register } = useAuth()

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSignup = async () => {
        if (name.trim().length === 0) {
            Alert.alert("Campo inválido", "Digite seu nome.")
            return
        }
        if (!EMAIL_REGEX.test(email.trim())) {
            Alert.alert("Campo inválido", "Digite um e-mail válido.")
            return
        }
        if (!PASSWORD_REGEX.test(password)) {
            Alert.alert("Senha inválida", "A senha deve ter no mínimo 8 caracteres, com pelo menos uma letra e um número.")
            return
        }
        if (password !== confirmPassword) {
            Alert.alert("Senhas diferentes", "A confirmação de senha não é igual à senha.")
            return
        }

        setIsSubmitting(true)
        try {
            await register({
                name: name.trim(),
                email: email.trim(),
                phone: phone.trim() || undefined,
                password,
            })
        } catch (error) {
            Alert.alert("Não foi possível cadastrar", (error as Error).message)
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
                    <Text style={styles.title}>Criar conta</Text>
                    <Text style={styles.subtitle}>Cadastre-se para começar a usar o PetFlow</Text>

                    <Text style={styles.label}>NOME COMPLETO</Text>
                    <TextInput
                        style={styles.input}
                        value={name}
                        onChangeText={setName}
                        placeholder="Seu nome"
                    />

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

                    <Text style={styles.label}>TELEFONE (OPCIONAL)</Text>
                    <TextInput
                        style={styles.input}
                        value={phone}
                        onChangeText={setPhone}
                        placeholder="(11) 99999-9999"
                        keyboardType="phone-pad"
                    />

                    <Text style={styles.label}>SENHA</Text>
                    <TextInput
                        style={styles.input}
                        value={password}
                        onChangeText={setPassword}
                        placeholder="Mín. 8 caracteres, letras e números"
                        secureTextEntry
                    />

                    <Text style={styles.label}>CONFIRMAR SENHA</Text>
                    <TextInput
                        style={styles.input}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        placeholder="Repita a senha"
                        secureTextEntry
                    />

                    <TouchableOpacity
                        style={[styles.button, isSubmitting && styles.buttonDisabled]}
                        onPress={handleSignup}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <ActivityIndicator color={colors.surface} />
                        ) : (
                            <Text style={styles.buttonText}>Cadastrar</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.linkButton}
                        onPress={() => navigation.navigate("LoginScreen")}
                    >
                        <Text style={styles.linkText}>
                            Já tem conta? <Text style={styles.linkTextBold}>Entrar</Text>
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
        paddingVertical: 40,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: colors.textPrimary,
        textAlign: "center",
    },
    subtitle: {
        fontSize: 14,
        color: colors.textSecondary,
        textAlign: "center",
        marginTop: 6,
        marginBottom: 28,
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
        marginBottom: 16,
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

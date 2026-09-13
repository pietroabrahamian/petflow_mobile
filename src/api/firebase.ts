import { initializeApp, getApps, getApp } from "firebase/app"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "AIzaSyDCgEEzHRkFFBZGfK2WAXtuS-ig78c-7EU",
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "tdspx-pietro.firebaseapp.com",
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "tdspx-pietro",
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "tdspx-pietro.firebasestorage.app",
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "474290790512",
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "1:474290790512:web:9762f30a0ab12c4bc4d4b5",
}

const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig)

export const firebaseAuth = getAuth(firebaseApp)

export function getFirebaseErrorMessage(error: unknown, fallback: string): string {
    const code = (error as { code?: string })?.code
    switch (code) {
        case "auth/invalid-email":
            return "E-mail inválido."
        case "auth/user-not-found":
        case "auth/wrong-password":
        case "auth/invalid-credential":
            return "E-mail ou senha inválidos."
        case "auth/too-many-requests":
            return "Muitas tentativas. Aguarde um momento e tente de novo."
        case "auth/email-already-in-use":
            return "Já existe uma conta com esse e-mail."
        case "auth/weak-password":
            return "A senha é muito fraca."
        case "auth/network-request-failed":
            return "Falha de conexão com o serviço de autenticação."
        default:
            return fallback
    }
}

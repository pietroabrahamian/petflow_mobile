import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut as firebaseSignOut,
    deleteUser,
} from "firebase/auth"
import { api, getApiErrorMessage } from "../api/client"
import { firebaseAuth, getFirebaseErrorMessage } from "../api/firebase"
import { LoginResponse, TutorRequest } from "../types/api"
import { endSession, startSession } from "./sessionService"
import { cancelAllNotifications } from "./notificationService"

/**
 * Login em duas etapas: o Firebase confirma a identidade (e-mail e senha) e a
 * API PetFlow devolve o JWT que autoriza as demais requisições.
 */
export async function signIn(email: string, password: string): Promise<void> {
    try {
        await signInWithEmailAndPassword(firebaseAuth, email, password)
    } catch (error) {
        throw new Error(getFirebaseErrorMessage(error, "E-mail ou senha inválidos."))
    }

    try {
        const { data } = await api.post<LoginResponse>("/auth/login", { email, password })
        await startSession(data)
    } catch (error) {
        throw new Error(getApiErrorMessage(error, "E-mail ou senha inválidos."))
    }
}

/** Cria a conta no Firebase e na API. Se a API recusar, desfaz a conta do Firebase. */
export async function signUp(payload: TutorRequest): Promise<void> {
    const credential = await createUserWithEmailAndPassword(firebaseAuth, payload.email, payload.password)
        .catch((error) => {
            throw new Error(getFirebaseErrorMessage(error, "Não foi possível criar sua conta."))
        })

    try {
        await api.post("/tutors", payload)
    } catch (error) {
        await deleteUser(credential.user).catch(() => {})
        throw new Error(getApiErrorMessage(error, "Não foi possível criar sua conta."))
    }

    await signIn(payload.email, payload.password)
}

export async function signOut(): Promise<void> {
    // Os lembretes são do tutor que saiu: o próximo usuário não deve recebê-los
    await cancelAllNotifications().catch(() => {})
    await firebaseSignOut(firebaseAuth).catch(() => {})
    await endSession("logout")
}

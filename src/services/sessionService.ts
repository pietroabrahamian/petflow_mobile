import AsyncStorage from "@react-native-async-storage/async-storage"
import { queryClient } from "../api/queryClient"
import { LoginResponse, UserRole } from "../types/api"
import { clearToken, getMsUntilExpiration, getToken, saveToken } from "./tokenService"

const USER_KEY = "@petflow:user"

export type AuthUser = {
    id: number
    name: string
    email: string
    role: UserRole
}

export type SessionEndReason = "logout" | "expired"

type SessionListener = (user: AuthUser | null, reason?: SessionEndReason) => void

// Quem precisa saber se o usuário entrou/saiu (AuthContext) se inscreve aqui
const listeners = new Set<SessionListener>()

export function subscribeToSession(listener: SessionListener): () => void {
    listeners.add(listener)
    return () => {
        listeners.delete(listener)
    }
}

function notify(user: AuthUser | null, reason?: SessionEndReason) {
    listeners.forEach((listener) => listener(user, reason))
}

export async function startSession(session: LoginResponse): Promise<void> {
    const user: AuthUser = {
        id: session.id,
        name: session.name,
        email: session.email,
        role: session.role,
    }
    await saveToken(session.token)
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user))
    notify(user)
}

/** Restaura a sessão salva. Token ausente ou expirado conta como "sem sessão". */
export async function restoreSession(): Promise<AuthUser | null> {
    const [token, storedUser] = await Promise.all([getToken(), AsyncStorage.getItem(USER_KEY)])

    if (!token || !storedUser) return null
    if (getMsUntilExpiration(token) <= 0) {
        await endSession("expired")
        return null
    }
    return JSON.parse(storedUser)
}

// Várias requisições podem detectar a expiração ao mesmo tempo: encerra uma vez só
let ending: Promise<void> | null = null

export function endSession(reason: SessionEndReason): Promise<void> {
    if (!ending) {
        ending = clearStoredSession(reason).finally(() => {
            ending = null
        })
    }
    return ending
}

async function clearStoredSession(reason: SessionEndReason): Promise<void> {
    const hadSession = (await getToken()) !== null
    await clearToken()
    await AsyncStorage.removeItem(USER_KEY)
    // Sem isso, o próximo usuário veria por um instante os dados em cache de quem saiu
    queryClient.clear()
    if (hadSession || reason === "logout") notify(null, reason)
}

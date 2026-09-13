import { createContext, useContext, useEffect, useMemo, useState, ReactNode, useCallback } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut as firebaseSignOut,
    deleteUser,
} from "firebase/auth"
import { api, saveToken, getToken, clearToken, setUnauthorizedHandler, getApiErrorMessage } from "../api/client"
import { firebaseAuth, getFirebaseErrorMessage } from "../api/firebase"
import { LoginResponse, TutorRequest, UserRole } from "../types/api"

const USER_KEY = "@petflow:user"

export type AuthUser = {
    id: number
    name: string
    email: string
    role: UserRole
}

type AuthContextValue = {
    user: AuthUser | null
    isAuthenticated: boolean
    isBootstrapping: boolean
    login: (email: string, password: string) => Promise<void>
    register: (data: TutorRequest) => Promise<void>
    logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null)
    const [isBootstrapping, setIsBootstrapping] = useState(true)

    const logout = useCallback(async () => {
        await clearToken()
        await AsyncStorage.removeItem(USER_KEY)
        await firebaseSignOut(firebaseAuth).catch(() => {})
        setUser(null)
    }, [])

    useEffect(() => {
        (async () => {
            try {
                const [token, storedUser] = await Promise.all([
                    getToken(),
                    AsyncStorage.getItem(USER_KEY),
                ])
                if (token && storedUser) {
                    setUser(JSON.parse(storedUser))
                }
            } catch (error) {
                console.log("[AuthContext] Erro ao restaurar sessão:", error)
            } finally {
                setIsBootstrapping(false)
            }
        })()
    }, [])

    useEffect(() => {
        setUnauthorizedHandler(() => {
            logout()
        })
    }, [logout])

    const persistSession = async (session: LoginResponse) => {
        const authUser: AuthUser = {
            id: session.id,
            name: session.name,
            email: session.email,
            role: session.role,
        }
        await saveToken(session.token)
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(authUser))
        setUser(authUser)
    }

    const login = async (email: string, password: string) => {
        try {
            await signInWithEmailAndPassword(firebaseAuth, email, password)
        } catch (error) {
            throw new Error(getFirebaseErrorMessage(error, "E-mail ou senha inválidos."))
        }

        try {
            const { data } = await api.post<LoginResponse>("/auth/login", { email, password })
            await persistSession(data)
        } catch (error) {
            throw new Error(getApiErrorMessage(error, "E-mail ou senha inválidos."))
        }
    }

    const register = async (payload: TutorRequest) => {
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

        await login(payload.email, payload.password)
    }

    const value = useMemo<AuthContextValue>(() => ({
        user,
        isAuthenticated: user !== null,
        isBootstrapping,
        login,
        register,
        logout,
    }), [user, isBootstrapping, logout])

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("useAuth precisa ser usado dentro de um AuthProvider")
    }
    return context
}

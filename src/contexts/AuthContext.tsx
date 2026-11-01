import { createContext, ReactNode, useContext, useEffect, useState } from "react"
import { AuthUser, restoreSession, subscribeToSession } from "../services/sessionService"

// Só informa quem está logado. Login/cadastro ficam em authService, a sessão em sessionService e o token em tokenService.
type AuthContextValue = {
    user: AuthUser | null
    isAuthenticated: boolean
    /** true enquanto a sessão salva é restaurada na abertura do app */
    isBootstrapping: boolean
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null)
    const [isBootstrapping, setIsBootstrapping] = useState(true)

    useEffect(() => {
        const unsubscribe = subscribeToSession((sessionUser) => setUser(sessionUser))

        restoreSession()
            .then(setUser)
            .catch((error) => console.log("[AuthContext] Erro ao restaurar sessão:", error))
            .finally(() => setIsBootstrapping(false))

        return unsubscribe
    }, [])

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: user !== null, isBootstrapping }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth(): AuthContextValue {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("useAuth precisa ser usado dentro de um AuthProvider")
    }
    return context
}

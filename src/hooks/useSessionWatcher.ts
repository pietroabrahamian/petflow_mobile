import { useEffect } from "react"
import { Alert, AppState } from "react-native"
import { endSession, subscribeToSession } from "../services/sessionService"
import { getValidToken, SessionExpiredError } from "../services/tokenService"

const CHECK_INTERVAL_MS = 5 * 60 * 1000

/**
 * Mantém o JWT válido mesmo sem requisições: confere a cada 5 minutos e quando o
 * app volta do segundo plano (timers param no background). Se a sessão expirar,
 * avisa o usuário antes de voltar para o login.
 */
export function useSessionWatcher() {
    useEffect(() => {
        async function check() {
            try {
                await getValidToken()
            } catch (error) {
                if (error instanceof SessionExpiredError) {
                    await endSession("expired")
                }
            }
        }

        const unsubscribe = subscribeToSession((_user, reason) => {
            if (reason === "expired") {
                Alert.alert("Sessão encerrada", "Sua sessão expirou. Entre novamente.")
            }
        })

        check()
        const timer = setInterval(check, CHECK_INTERVAL_MS)
        const subscription = AppState.addEventListener("change", (state) => {
            if (state === "active") check()
        })

        return () => {
            unsubscribe()
            clearInterval(timer)
            subscription.remove()
        }
    }, [])
}

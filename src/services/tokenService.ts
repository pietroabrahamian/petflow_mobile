import axios from "axios"
import * as SecureStore from "expo-secure-store"
import { API_BASE_URL, API_TIMEOUT_MS } from "../api/config"
import { LoginResponse } from "../types/api"

const TOKEN_KEY = "petflow_token"

/**
 * O JWT da API vale 24 horas (claim "exp"). Antes de cada requisição conferimos
 * quanto falta para expirar: se faltar menos que REFRESH_MARGIN_MS, pedimos um
 * token novo em POST /auth/refresh. Se o token já expirou, a sessão acabou.
 */
export const REFRESH_MARGIN_MS = 60 * 60 * 1000

export class SessionExpiredError extends Error {
    constructor() {
        super("Sua sessão expirou. Entre novamente.")
        this.name = "SessionExpiredError"
    }
}

export async function saveToken(token: string): Promise<void> {
    await SecureStore.setItemAsync(TOKEN_KEY, token)
}

export async function getToken(): Promise<string | null> {
    return SecureStore.getItemAsync(TOKEN_KEY)
}

export async function clearToken(): Promise<void> {
    await SecureStore.deleteItemAsync(TOKEN_KEY)
}

/** Lê o "exp" do payload (em segundos) e devolve em milissegundos. */
export function getTokenExpiration(token: string): number | null {
    try {
        const payload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")
        const padded = payload.padEnd(Math.ceil(payload.length / 4) * 4, "=")
        const { exp } = JSON.parse(atob(padded))
        return typeof exp === "number" ? exp * 1000 : null
    } catch {
        return null
    }
}

export function getMsUntilExpiration(token: string): number {
    const expiresAt = getTokenExpiration(token)
    return expiresAt === null ? 0 : expiresAt - Date.now()
}

// Evita que várias requisições ao mesmo tempo peçam um token novo cada uma
let refreshing: Promise<string> | null = null

export function refreshToken(currentToken: string): Promise<string> {
    if (!refreshing) {
        refreshing = requestNewToken(currentToken).finally(() => {
            refreshing = null
        })
    }
    return refreshing
}

async function requestNewToken(currentToken: string): Promise<string> {
    // axios "puro" (sem os interceptors do client) para não entrar em loop
    const { data } = await axios.post<LoginResponse>(`${API_BASE_URL}/auth/refresh`, null, {
        timeout: API_TIMEOUT_MS,
        headers: { Authorization: `Bearer ${currentToken}` },
    })
    await saveToken(data.token)
    return data.token
}

/**
 * Devolve um token válido para usar na requisição, renovando se estiver perto de expirar.
 * Lança SessionExpiredError se não houver token ou se ele já tiver expirado.
 */
export async function getValidToken(): Promise<string> {
    const token = await getToken()
    if (!token) throw new SessionExpiredError()

    const msLeft = getMsUntilExpiration(token)
    if (msLeft <= 0) throw new SessionExpiredError()
    if (msLeft > REFRESH_MARGIN_MS) return token

    try {
        return await refreshToken(token)
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
            throw new SessionExpiredError()
        }
        // Sem internet ou API fora: o token atual ainda vale, segue com ele
        return token
    }
}

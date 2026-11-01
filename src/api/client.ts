import axios, { AxiosError } from "axios"
import { ApiErrorResponse } from "../types/api"
import { API_BASE_URL, API_TIMEOUT_MS } from "./config"
import { getToken, getValidToken, SessionExpiredError } from "../services/tokenService"
import { endSession } from "../services/sessionService"

export const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: API_TIMEOUT_MS,
    headers: {
        "Content-Type": "application/json",
    },
})

api.interceptors.request.use(async (config) => {
    // Login e cadastro são públicos: sem token salvo, a requisição segue sem header
    if (!(await getToken())) return config

    try {
        const token = await getValidToken()
        config.headers.Authorization = `Bearer ${token}`
        return config
    } catch (error) {
        if (error instanceof SessionExpiredError) {
            await endSession("expired")
        }
        throw error
    }
})

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        // 401 numa requisição autenticada = token recusado pela API (expirado ou revogado)
        if (axios.isAxiosError(error) && error.response?.status === 401 && error.config?.headers?.Authorization) {
            await endSession("expired")
        }
        return Promise.reject(error)
    }
)

export function getApiErrorMessage(error: unknown, fallback = "Ocorreu um erro inesperado."): string {
    if (error instanceof SessionExpiredError) return error.message

    if (axios.isAxiosError(error)) {
        const err = error as AxiosError<ApiErrorResponse>
        const data = err.response?.data

        if (data?.validationErrors) {
            const firstError = Object.values(data.validationErrors)[0]
            if (firstError) return firstError
        }
        if (data?.message) return data.message
        if (err.message === "Network Error") {
            return "Não foi possível conectar à API. Verifique sua conexão e tente novamente."
        }
    }
    return fallback
}

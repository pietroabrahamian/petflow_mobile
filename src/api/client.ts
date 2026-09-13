import axios, { AxiosError } from "axios"
import * as SecureStore from "expo-secure-store"
import { ApiErrorResponse } from "../types/api"

const TOKEN_KEY = "petflow_token"

const AZURE_API_URL = "http://petflow-api-dns.brazilsouth.azurecontainer.io:8080"

function resolveBaseUrl(): string {
    return process.env.EXPO_PUBLIC_API_URL || AZURE_API_URL
}

export const API_BASE_URL = resolveBaseUrl()

export const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 15000,
    headers: {
        "Content-Type": "application/json",
    },
})

api.interceptors.request.use(async (config) => {
    const token = await SecureStore.getItemAsync(TOKEN_KEY)
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

let onUnauthorized: (() => void) | null = null
export function setUnauthorizedHandler(handler: () => void) {
    onUnauthorized = handler
}

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
            onUnauthorized?.()
        }
        return Promise.reject(error)
    }
)

export async function saveToken(token: string): Promise<void> {
    await SecureStore.setItemAsync(TOKEN_KEY, token)
}

export async function getToken(): Promise<string | null> {
    return SecureStore.getItemAsync(TOKEN_KEY)
}

export async function clearToken(): Promise<void> {
    await SecureStore.deleteItemAsync(TOKEN_KEY)
}

export function getApiErrorMessage(error: unknown, fallback = "Ocorreu um erro inesperado."): string {
    if (axios.isAxiosError(error)) {
        const err = error as AxiosError<ApiErrorResponse>
        const data = err.response?.data

        if (data?.validationErrors) {
            const firstError = Object.values(data.validationErrors)[0]
            if (firstError) return firstError
        }
        if (data?.message) return data.message
        if (err.message === "Network Error") {
            return "Não foi possível conectar à API. Verifique se o servidor está rodando e se o endereço configurado está correto."
        }
    }
    return fallback
}

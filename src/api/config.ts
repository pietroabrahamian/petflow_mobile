// Endereço da API publicada. Pode ser trocado por EXPO_PUBLIC_API_URL (ex.: API local com HTTPS).
const DEFAULT_API_URL = "https://561413-petflow-webapp.azurewebsites.net"

function resolveBaseUrl(): string {
    const url = (process.env.EXPO_PUBLIC_API_URL || DEFAULT_API_URL).replace(/\/+$/, "")

    // O token JWT trafega no header Authorization: sem HTTPS ele iria em texto puro na rede
    if (!url.startsWith("https://")) {
        throw new Error(`A URL da API precisa usar HTTPS. Valor recebido: ${url}`)
    }
    return url
}

export const API_BASE_URL = resolveBaseUrl()
export const API_TIMEOUT_MS = 15000

import Constants from "expo-constants"

const extra = (Constants.expoConfig?.extra ?? {}) as { commitHash?: string; buildDate?: string }

/** Versão do app.config.js e hash do commit gravado no momento do build */
export const appInfo = {
    name: Constants.expoConfig?.name ?? "PetFlow",
    version: Constants.expoConfig?.version ?? "-",
    commitHash: extra.commitHash ?? "desconhecido",
    buildDate: extra.buildDate ?? "-",
}

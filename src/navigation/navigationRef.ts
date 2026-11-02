import { createNavigationContainerRef } from "@react-navigation/native"
import { AppStackParamList } from "./types"

// Permite navegar de fora de uma tela (ex.: ao tocar numa notificação)
export const navigationRef = createNavigationContainerRef<AppStackParamList>()

import { Pet } from "../types/api"

export type AuthStackParamList = {
    LoginScreen: undefined
    SignupScreen: undefined
}

export type MainTabsParamList = {
    PetListScreen: undefined
    ClinicListScreen: undefined
    RewardsScreen: undefined
    SettingsScreen: undefined
}

export type AppStackParamList = {
    MainTabs: undefined
    PetDetailsScreen: { pet: Pet }
    PetFormScreen: { pet?: Pet } | undefined
    HealthEventFormScreen: { petId: number; event?: import("../types/api").HealthEvent }
    SubscriptionFormScreen: { petId: number }
}

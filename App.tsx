import { StatusBar } from 'expo-status-bar'
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { QueryClientProvider } from '@tanstack/react-query'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import { AuthProvider, useAuth } from './src/contexts/AuthContext'
import { ThemeProvider, useTheme } from './src/contexts/ThemeContext'
import { queryClient } from './src/api/queryClient'
import { navigationRef } from './src/navigation/navigationRef'
import { AppStackParamList, AuthStackParamList } from './src/navigation/types'
import { useSessionWatcher } from './src/hooks/useSessionWatcher'
import { useNotifications } from './src/hooks/useNotifications'
import LoadingView from './src/components/LoadingView'

import MainTabs from './src/components/MainTabs'
import PetDetailsScreen from './src/screens/PetDetailsScreen'
import PetFormScreen from './src/screens/PetFormScreen'
import HealthEventFormScreen from './src/screens/HealthEventFormScreen'
import SubscriptionFormScreen from './src/screens/SubscriptionFormScreen'
import AboutScreen from './src/screens/AboutScreen'
import LoginScreen from './src/screens/auth/LoginScreen'
import SignupScreen from './src/screens/auth/SignupScreen'

const AppStack = createNativeStackNavigator<AppStackParamList>()
const AuthStack = createNativeStackNavigator<AuthStackParamList>()

// Só é montado com o usuário logado, então o watcher do token e as notificações rodam apenas nesse período
function AppNavigator() {
    const { colors } = useTheme()
    useSessionWatcher()
    useNotifications()

    return (
        <AppStack.Navigator
            screenOptions={{
                headerBackButtonDisplayMode: "minimal",
                headerTintColor: colors.primary,
                headerStyle: { backgroundColor: colors.surface },
                headerTitleStyle: { color: colors.textPrimary },
            }}
        >
            <AppStack.Screen
                name="MainTabs"
                component={MainTabs}
                options={{ headerShown: false }}
            />
            <AppStack.Screen
                name="PetDetailsScreen"
                component={PetDetailsScreen}
                options={{ headerTitle: "" }}
            />
            <AppStack.Screen name="PetFormScreen" component={PetFormScreen} />
            <AppStack.Screen name="HealthEventFormScreen" component={HealthEventFormScreen} />
            <AppStack.Screen name="SubscriptionFormScreen" component={SubscriptionFormScreen} />
            <AppStack.Screen
                name="AboutScreen"
                component={AboutScreen}
                options={{ title: "Sobre o App" }}
            />
        </AppStack.Navigator>
    )
}

function AuthNavigator() {
    return (
        <AuthStack.Navigator screenOptions={{ headerShown: false }}>
            <AuthStack.Screen name="LoginScreen" component={LoginScreen} />
            <AuthStack.Screen name="SignupScreen" component={SignupScreen} />
        </AuthStack.Navigator>
    )
}

function RootNavigator() {
    const { isAuthenticated, isBootstrapping } = useAuth()

    if (isBootstrapping) {
        return <LoadingView label="Preparando o PetFlow..." />
    }

    return isAuthenticated ? <AppNavigator /> : <AuthNavigator />
}

// Tema do React Navigation (fundo, cards e tab bar) acompanhando a paleta do app
function ThemedNavigation() {
    const { colors, isDark } = useTheme()
    const baseTheme = isDark ? DarkTheme : DefaultTheme

    return (
        <NavigationContainer
            ref={navigationRef}
            theme={{
                ...baseTheme,
                colors: {
                    ...baseTheme.colors,
                    primary: colors.primary,
                    background: colors.background,
                    card: colors.surface,
                    text: colors.textPrimary,
                    border: colors.border,
                },
            }}
        >
            <RootNavigator />
            <StatusBar style={isDark ? "light" : "dark"} />
        </NavigationContainer>
    )
}

export default function App() {
    return (
        <SafeAreaProvider>
            <QueryClientProvider client={queryClient}>
                <ThemeProvider>
                    <AuthProvider>
                        <ThemedNavigation />
                    </AuthProvider>
                </ThemeProvider>
            </QueryClientProvider>
        </SafeAreaProvider>
    )
}

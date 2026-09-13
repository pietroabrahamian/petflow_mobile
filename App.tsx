import { StatusBar } from 'expo-status-bar'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import { AuthProvider, useAuth } from './src/contexts/AuthContext'
import LoadingView from './src/components/LoadingView'

import MainTabs from './src/components/MainTabs'
import PetDetailsScreen from './src/screens/PetDetailsScreen'
import PetFormScreen from './src/screens/PetFormScreen'
import HealthEventFormScreen from './src/screens/HealthEventFormScreen'
import SubscriptionFormScreen from './src/screens/SubscriptionFormScreen'
import LoginScreen from './src/screens/auth/LoginScreen'
import SignupScreen from './src/screens/auth/SignupScreen'
import { colors } from "./src/theme/colors"

const AppStack = createNativeStackNavigator()
const AuthStack = createNativeStackNavigator()

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            refetchOnReconnect: true,
        },
    },
})

function AppNavigator() {
    return (
        <AppStack.Navigator>
            <AppStack.Screen
                name="MainTabs"
                component={MainTabs}
                options={{ headerShown: false }}
            />
            <AppStack.Screen
                name="PetDetailsScreen"
                component={PetDetailsScreen}
                options={{
                    headerBackButtonDisplayMode: "minimal",
                    headerTitle: "",
                    headerTintColor: colors.primary,
                }}
            />
            <AppStack.Screen
                name="PetFormScreen"
                component={PetFormScreen}
                options={{
                    headerBackButtonDisplayMode: "minimal",
                    headerTintColor: colors.primary,
                }}
            />
            <AppStack.Screen
                name="HealthEventFormScreen"
                component={HealthEventFormScreen}
                options={{
                    headerBackButtonDisplayMode: "minimal",
                    headerTintColor: colors.primary,
                }}
            />
            <AppStack.Screen
                name="SubscriptionFormScreen"
                component={SubscriptionFormScreen}
                options={{
                    headerBackButtonDisplayMode: "minimal",
                    headerTintColor: colors.primary,
                }}
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

export default function App() {
    return (
        <SafeAreaProvider>
            <QueryClientProvider client={queryClient}>
                <AuthProvider>
                    <NavigationContainer>
                        <RootNavigator />
                        <StatusBar style="auto" />
                    </NavigationContainer>
                </AuthProvider>
            </QueryClientProvider>
        </SafeAreaProvider>
    )
}

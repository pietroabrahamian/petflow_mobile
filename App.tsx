import { StatusBar } from 'expo-status-bar'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import MainTabs from './src/components/MainTabs'
import PetDetailsScreen from './src/screens/PetDetailsScreen'

const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="MainTabs"
          component={MainTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PetDetailsScreen"
          component={PetDetailsScreen}
          options={{
            headerBackButtonDisplayMode: "minimal",
            headerTitle: "",
            headerTintColor: "#2D6A4F",
          }}
        />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  )
}

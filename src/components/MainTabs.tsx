import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import PetListScreen from "../screens/PetListScreen"
import ClinicListScreen from "../screens/ClinicListScreen"
import RewardsScreen from "../screens/RewardsScreen"
import SettingsScreen from "../screens/SettingsScreen"

import MaterialIcons from "@expo/vector-icons/MaterialIcons"
import { colors } from "../theme/colors"

const Tab = createBottomTabNavigator()

export default function MainTabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.textMuted,
                tabBarLabelStyle: { fontSize: 12 },
                headerShown: false,
                tabBarIcon: ({ color, size }) => {
                    let iconName: any
                    switch (route.name) {
                        case "PetListScreen":
                            iconName = "pets"
                            break
                        case "ClinicListScreen":
                            iconName = "local-hospital"
                            break
                        case "RewardsScreen":
                            iconName = "local-offer"
                            break
                        case "SettingsScreen":
                            iconName = "settings"
                            break
                        default:
                            iconName = "home"
                    }
                    return <MaterialIcons name={iconName} size={size} color={color} />
                }
            })}
        >
            <Tab.Screen
                name="PetListScreen"
                component={PetListScreen}
                options={{ title: "Meus Pets" }}
            />
            <Tab.Screen
                name="ClinicListScreen"
                component={ClinicListScreen}
                options={{ title: "Clínicas" }}
            />
            <Tab.Screen
                name="RewardsScreen"
                component={RewardsScreen}
                options={{ title: "Recompensas" }}
            />
            <Tab.Screen
                name="SettingsScreen"
                component={SettingsScreen}
                options={{ title: "Ajustes" }}
            />
        </Tab.Navigator>
    )
}

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import PetListScreen from "../screens/PetListScreen"
import ClinicListScreen from "../screens/ClinicListScreen"
import CouponListScreen from "../screens/CouponListScreen"
import SettingsScreen from "../screens/SettingsScreen"

import MaterialIcons from "@expo/vector-icons/MaterialIcons"

const Tab = createBottomTabNavigator()

export default function MainTabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarActiveTintColor: "#2D6A4F",
                tabBarInactiveTintColor: "#999",
                tabBarLabelStyle: { fontSize: 12 },
                tabBarIcon: ({ color, size }) => {
                    let iconName: any
                    switch (route.name) {
                        case "PetListScreen":
                            iconName = "pets"
                            break
                        case "ClinicListScreen":
                            iconName = "local-hospital"
                            break
                        case "CouponListScreen":
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
                options={{
                    title: "Meus Pets",
                    headerShown: false,
                }}
            />
            <Tab.Screen
                name="ClinicListScreen"
                component={ClinicListScreen}
                options={{
                    title: "Clínicas",
                    headerShown: false,
                }}
            />
            <Tab.Screen
                name="CouponListScreen"
                component={CouponListScreen}
                options={{
                    title: "Cupons",
                    headerShown: false,
                }}
            />
            <Tab.Screen
                name="SettingsScreen"
                component={SettingsScreen}
                options={{ title: "Ajustes" }}
            />
        </Tab.Navigator>
    )
}

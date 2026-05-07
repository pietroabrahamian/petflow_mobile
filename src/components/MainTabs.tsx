import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { View, Text, StyleSheet } from "react-native"
import MaterialIcons from "@expo/vector-icons/MaterialIcons"

import PetListScreen from "../screens/PetListScreen"

const Tab = createBottomTabNavigator()

function PlaceholderScreen({ title }: { title: string }) {
    return (
        <View style={styles.center}>
            <Text style={styles.placeholder}>{title}</Text>
        </View>
    )
}

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
                        case "PetListScreen": iconName = "pets"; break
                        case "ClinicListScreen": iconName = "local-hospital"; break
                        case "CouponListScreen": iconName = "local-offer"; break
                        case "SettingsScreen": iconName = "settings"; break
                        default: iconName = "home"
                    }
                    return <MaterialIcons name={iconName} size={size} color={color} />
                }
            })}
        >
            <Tab.Screen
                name="PetListScreen"
                component={PetListScreen}
                options={{ title: "Meus Pets", headerShown: false }}
            />
            <Tab.Screen name="ClinicListScreen" options={{ title: "Clínicas" }}>
                {() => <PlaceholderScreen title="Clínicas" />}
            </Tab.Screen>
            <Tab.Screen name="CouponListScreen" options={{ title: "Cupons" }}>
                {() => <PlaceholderScreen title="Cupons" />}
            </Tab.Screen>
            <Tab.Screen name="SettingsScreen" options={{ title: "Ajustes" }}>
                {() => <PlaceholderScreen title="Ajustes" />}
            </Tab.Screen>
        </Tab.Navigator>
    )
}

const styles = StyleSheet.create({
    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f2f2f2',
    },
    placeholder: {
        fontSize: 18,
        color: '#999',
    },
})

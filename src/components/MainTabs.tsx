import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { View, Text, StyleSheet } from "react-native"

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
        <Tab.Navigator>
            <Tab.Screen name="PetListScreen" options={{ title: "Meus Pets" }}>
                {() => <PlaceholderScreen title="Meus Pets" />}
            </Tab.Screen>
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

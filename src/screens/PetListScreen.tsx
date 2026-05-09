import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Pressable,
    TouchableOpacity,
} from "react-native"
import { useEffect, useState } from "react"
import { useNavigation } from "@react-navigation/native"
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context"

import PetRow, { Pet } from "../components/PetRow"
import { getPets } from "../services/petService"

export default function PetListScreen() {
    const navigation = useNavigation<any>()
    const [pets, setPets] = useState<Pet[]>([])

    useEffect(() => {
        getPets().then(setPets)
    }, [])

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <View>
                        <Text style={styles.title}>Meus Pets</Text>
                        <Text style={styles.subtitle}>{pets.length} pets cadastrados</Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => navigation.navigate("PetFormScreen")}
                    >
                        <Text style={styles.addButton}>+</Text>
                    </TouchableOpacity>
                </View>

                <FlatList
                    style={styles.list}
                    data={pets}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <Pressable
                            onPress={() => navigation.navigate("PetDetailsScreen", { pet: item })}
                        >
                            <PetRow pet={item} />
                        </Pressable>
                    )}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                    showsVerticalScrollIndicator={false}
                />
            </SafeAreaView>
        </SafeAreaProvider>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f2f2f2",
        paddingTop: 20,
        paddingHorizontal: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    addButton: {
        color: '#2D6A4F',
        fontSize: 32,
        fontWeight: '900',
    },
    list: {
        marginVertical: 16,
        paddingHorizontal: 8,
        backgroundColor: '#fff',
        borderRadius: 12,
    },
    separator: {
        height: 1,
        backgroundColor: '#eee',
    },
})

import {
    View,
    Text,
    StyleSheet,
    FlatList,
} from "react-native"
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context"

import PetRow, { Pet } from "../components/PetRow"
import data from "../data/petflow.json"

export default function PetListScreen() {
    const pets: Pet[] = data.pets

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Meus Pets</Text>
                    <Text style={styles.subtitle}>{pets.length} pets cadastrados</Text>
                </View>

                <FlatList
                    style={styles.list}
                    data={pets}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => <PetRow pet={item} />}
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

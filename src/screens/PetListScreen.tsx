import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Pressable,
    RefreshControl,
} from "react-native"
import { useFocusEffect, useNavigation } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { SafeAreaView } from "react-native-safe-area-context"
import { useCallback, useState } from "react"

import PetRow from "../components/PetRow"
import LoadingView from "../components/LoadingView"
import ErrorView from "../components/ErrorView"
import { usePets } from "../hooks/usePets"
import { useSpecies } from "../hooks/useReferenceData"
import { getApiErrorMessage } from "../api/client"
import { getAllPetPhotos } from "../utils/petPhotoStore"
import { AppStackParamList } from "../navigation/types"
import { Pet } from "../types/api"
import { colors } from "../theme/colors"

export default function PetListScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>()
    const { data: pets, isLoading, isError, error, isFetching, refetch } = usePets()
    const { data: species } = useSpecies()
    const [photos, setPhotos] = useState<Record<number, string>>({})

    useFocusEffect(
        useCallback(() => {
            getAllPetPhotos().then(setPhotos)
        }, [])
    )

    const speciesName = (speciesId: number) => species?.find(s => s.id === speciesId)?.name

    if (isLoading) {
        return (
            <SafeAreaView style={styles.container}>
                <LoadingView label="Carregando seus pets..." />
            </SafeAreaView>
        )
    }

    if (isError) {
        return (
            <SafeAreaView style={styles.container}>
                <ErrorView message={getApiErrorMessage(error)} onRetry={() => refetch()} />
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.title}>Meus Pets</Text>
                    <Text style={styles.subtitle}>{pets?.length ?? 0} pets cadastrados</Text>
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
                refreshControl={
                    <RefreshControl refreshing={isFetching && !isLoading} onRefresh={refetch} colors={[colors.primary]} />
                }
                renderItem={({ item }: { item: Pet }) => (
                    <Pressable
                        onPress={() => navigation.navigate("PetDetailsScreen", { pet: item })}
                    >
                        <PetRow pet={item} photoUri={photos[item.id]} speciesName={speciesName(item.speciesId)} />
                    </Pressable>
                )}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <Text style={styles.emptyText}>Nenhum pet cadastrado ainda.</Text>
                        <Text style={styles.emptyHint}>Toque em "+" para cadastrar o primeiro.</Text>
                    </View>
                }
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
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
        color: colors.textPrimary,
    },
    subtitle: {
        fontSize: 14,
        color: colors.textSecondary,
        marginTop: 4,
    },
    addButton: {
        color: colors.primary,
        fontSize: 32,
        fontWeight: '900',
    },
    list: {
        marginVertical: 16,
        paddingHorizontal: 8,
        backgroundColor: colors.surface,
        borderRadius: 12,
    },
    separator: {
        height: 1,
        backgroundColor: colors.border,
    },
    empty: {
        padding: 32,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 15,
        color: colors.textSecondary,
        fontWeight: '600',
    },
    emptyHint: {
        fontSize: 13,
        color: colors.textMuted,
        marginTop: 4,
    },
})

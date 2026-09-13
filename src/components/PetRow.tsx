import { StyleSheet, Text, View, Image } from "react-native"
import { Pet } from "../types/api"
import { getPetImageSource } from "../utils/petImages"
import { formatAge } from "../utils/date"
import { colors } from "../theme/colors"

export default function PetRow({
    pet,
    photoUri,
    speciesName,
}: {
    pet: Pet
    photoUri?: string | null
    speciesName?: string
}) {
    const age = formatAge(pet.birthDate)

    const metaParts = [
        speciesName,
        age,
        pet.weight != null ? `${pet.weight}kg` : null,
    ].filter(Boolean)

    return (
        <View style={styles.container}>
            <Image
                source={getPetImageSource(photoUri, pet.speciesId)}
                style={styles.image}
            />
            <View style={styles.info}>
                <Text style={styles.name}>{pet.name}</Text>
                {!!pet.breed && <Text style={styles.breed}>{pet.breed}</Text>}
                <Text style={styles.meta}>{metaParts.join(" • ")}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        backgroundColor: 'white'
    },
    image: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginLeft: 12,
    },
    info: {
        flex: 1,
        marginHorizontal: 12,
    },
    name: {
        fontSize: 17,
        fontWeight: 'bold',
        color: colors.textPrimary,
    },
    breed: {
        fontSize: 14,
        color: colors.textSecondary,
        marginTop: 2,
    },
    meta: {
        fontSize: 12,
        color: colors.textMuted,
        marginTop: 4,
    },
})

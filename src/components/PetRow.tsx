import { StyleSheet, Text, View, Image } from "react-native"
import { getPetImageSource } from "../utils/petImages"

export type Pet = {
    id: number;
    tutor_id: number;
    species_id: number;
    species_name: string;
    name: string;
    breed: string;
    birth_date: string;
    weight: number;
    plan_id: number;
    clinic_id: number;
    photo: string;
}

export default function PetRow({ pet }: { pet: Pet }) {
    const age = new Date().getFullYear() - new Date(pet.birth_date).getFullYear()

    return (
        <View style={styles.container}>
            <Image
                source={getPetImageSource(pet.photo, pet.species_id)}
                style={styles.image}
            />
            <View style={styles.info}>
                <Text style={styles.name}>{pet.name}</Text>
                <Text style={styles.breed}>{pet.breed}</Text>
                <Text style={styles.meta}>{pet.species_name} • {age} anos • {pet.weight}kg</Text>
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
        color: '#1a1a1a',
    },
    breed: {
        fontSize: 14,
        color: '#666',
        marginTop: 2,
    },
    meta: {
        fontSize: 12,
        color: '#999',
        marginTop: 4,
    },
})

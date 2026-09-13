import { ImageSourcePropType } from "react-native"

const defaultImages: Record<string, ImageSourcePropType> = {
    default_dog: require("../../assets/pets/default_dog.png"),
    default_cat: require("../../assets/pets/default_cat.png"),
    default_bird: require("../../assets/pets/default_bird.png"),
}

function getDefaultImageKey(speciesId?: number): string {
    if (speciesId === 2) return "default_cat"
    if (speciesId === 3) return "default_bird"
    return "default_dog"
}

export function getPetImageSource(
    photoUri: string | undefined | null,
    speciesId?: number
): ImageSourcePropType {
    if (photoUri && (photoUri.startsWith("file://") || photoUri.startsWith("content://") || photoUri.startsWith("http"))) {
        return { uri: photoUri }
    }
    return defaultImages[getDefaultImageKey(speciesId)]
}

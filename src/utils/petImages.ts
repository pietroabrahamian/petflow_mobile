import { ImageSourcePropType } from "react-native"

const defaultImages: Record<string, ImageSourcePropType> = {
    default_dog: require("../../assets/pets/default_dog.png"),
    default_cat: require("../../assets/pets/default_cat.png"),
    default_bird: require("../../assets/pets/default_bird.png"),
}

// Usa o nome da espécie vindo da API: os IDs dependem do banco e não devem ficar fixos no app
function getDefaultImageKey(speciesName?: string): string {
    const name = speciesName?.toLowerCase() ?? ""
    if (name.includes("gato")) return "default_cat"
    if (name.includes("ave") || name.includes("pássaro")) return "default_bird"
    return "default_dog"
}

export function getPetImageSource(
    photoUri: string | undefined | null,
    speciesName?: string
): ImageSourcePropType {
    if (photoUri && (photoUri.startsWith("file://") || photoUri.startsWith("content://") || photoUri.startsWith("http"))) {
        return { uri: photoUri }
    }
    return defaultImages[getDefaultImageKey(speciesName)]
}

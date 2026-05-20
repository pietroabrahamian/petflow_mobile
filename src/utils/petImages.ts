/**
 * Mapa de imagens locais dos pets.
 *
 * Por que isso existe:
 * O Metro Bundler do React Native exige que `require()` receba uma string
 * literal, não uma variável. Por isso não conseguimos fazer
 * `require(pet.photo)` direto. Precisamos de um mapa estático.
 *
 * Como usar:
 * - Pets mockados (do petflow.json) têm `photo: "thor"` (chave)
 * - Pets cadastrados pelo usuário têm `photo: "file:///..."` (URI da galeria)
 * - O helper getPetImageSource() decide qual abordagem usar
 */

import { ImageSourcePropType } from "react-native"

const localImages: Record<string, ImageSourcePropType> = {
    thor: require("../../assets/pets/thor.png"),
    mel: require("../../assets/pets/mel.png"),
    mochi: require("../../assets/pets/mochi.png"),
    default_dog: require("../../assets/pets/default_dog.png"),
    default_cat: require("../../assets/pets/default_cat.png"),
    default_bird: require("../../assets/pets/default_bird.png"),
}

/**
 * Retorna a fonte da imagem correta dado o valor de `photo` do pet.
 *
 * - Se `photo` for uma chave conhecida ("thor", "default_dog", etc),
 *   retorna o require() correspondente.
 * - Se `photo` for uma URI (file://, content://, http://),
 *   retorna { uri }.
 * - Se for null/undefined, cai no default por espécie.
 */
export function getPetImageSource(
    photo: string | undefined | null,
    speciesId?: number
): ImageSourcePropType {
    // Pet criado pelo usuário com foto da galeria
    if (photo && (photo.startsWith("file://") || photo.startsWith("content://") || photo.startsWith("http"))) {
        return { uri: photo }
    }

    // Pet mockado com chave conhecida
    if (photo && localImages[photo]) {
        return localImages[photo]
    }

    // Fallback por espécie
    if (speciesId === 1) return localImages.default_dog
    if (speciesId === 2) return localImages.default_cat
    if (speciesId === 3) return localImages.default_bird

    // Último fallback
    return localImages.default_dog
}

/**
 * Retorna a chave de imagem default para uma espécie.
 * Útil ao salvar pets novos sem foto.
 */
export function getDefaultPhotoKey(speciesId: number): string {
    if (speciesId === 1) return "default_dog"
    if (speciesId === 2) return "default_cat"
    if (speciesId === 3) return "default_bird"
    return "default_dog"
}

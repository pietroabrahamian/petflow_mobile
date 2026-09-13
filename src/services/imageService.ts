import * as ImagePicker from "expo-image-picker"
import * as FileSystem from "expo-file-system/legacy"

export async function pickImageFromGallery(): Promise<string | null> {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync()

    if (!permission.granted) {
        console.log("[imageService] Permissão de galeria negada")
        return null
    }

    const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
    })

    if (result.canceled || !result.assets || result.assets.length === 0) {
        return null
    }

    const tempUri = result.assets[0].uri

    try {
        const fileName = `pet_${Date.now()}.jpg`
        const destinationUri = FileSystem.documentDirectory + fileName

        await FileSystem.copyAsync({
            from: tempUri,
            to: destinationUri,
        })

        console.log("[imageService] Imagem salva em:", destinationUri)
        return destinationUri
    } catch (error) {
        console.log("[imageService] Erro ao copiar imagem:", error)
        return tempUri
    }
}

export async function deleteImage(uri: string): Promise<void> {
    if (!uri || !uri.startsWith(FileSystem.documentDirectory || "")) {
        return
    }
    try {
        await FileSystem.deleteAsync(uri, { idempotent: true })
    } catch (error) {
        console.log("[imageService] Erro ao deletar imagem:", error)
    }
}

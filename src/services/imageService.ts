import * as ImagePicker from "expo-image-picker"
import * as FileSystem from "expo-file-system/legacy"

/**
 * Abre a galeria, solicita permissão se necessário e retorna o URI
 * de uma cópia da imagem salva no diretório do app (persistente).
 *
 * Retorna null se o usuário cancelar ou negar a permissão.
 *
 * Por que copiar a imagem:
 * URIs vindas direto do ImagePicker no Android podem ser temporárias
 * (content://) e quebrar após reiniciar o app. Copiamos para
 * documentDirectory para garantir que a imagem persista junto com
 * o AsyncStorage.
 */
export async function pickImageFromGallery(): Promise<string | null> {
    // 1. Pede permissão de acesso à galeria
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync()

    if (!permission.granted) {
        console.log("[imageService] Permissão de galeria negada")
        return null
    }

    // 2. Abre a galeria
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

    // 3. Copia a imagem para o diretório do app (persistente)
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
        // Fallback: retorna URI temporária se copy falhar
        return tempUri
    }
}

/**
 * Apaga um arquivo de imagem do diretório do app.
 * Útil quando o usuário deleta um pet ou troca a foto.
 */
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

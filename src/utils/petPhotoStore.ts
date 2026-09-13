import AsyncStorage from "@react-native-async-storage/async-storage"

const PHOTOS_KEY = "@petflow:pet_photos"

async function readMap(): Promise<Record<number, string>> {
    const raw = await AsyncStorage.getItem(PHOTOS_KEY)
    return raw ? JSON.parse(raw) : {}
}

export async function getPetPhoto(petId: number): Promise<string | null> {
    const map = await readMap()
    return map[petId] ?? null
}

export async function getAllPetPhotos(): Promise<Record<number, string>> {
    return readMap()
}

export async function setPetPhoto(petId: number, uri: string): Promise<void> {
    const map = await readMap()
    map[petId] = uri
    await AsyncStorage.setItem(PHOTOS_KEY, JSON.stringify(map))
}

export async function removePetPhoto(petId: number): Promise<void> {
    const map = await readMap()
    delete map[petId]
    await AsyncStorage.setItem(PHOTOS_KEY, JSON.stringify(map))
}

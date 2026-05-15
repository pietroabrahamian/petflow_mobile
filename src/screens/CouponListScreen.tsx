import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert
} from "react-native"
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context"
import MaterialIcons from "@expo/vector-icons/MaterialIcons"
import { useState, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"

import data from "../data/petflow.json"

const REDEEMED_KEY = "@petflow:redeemed_coupons"

type Coupon = {
    id: number
    tutor_id: number
    clinic_id: number
    clinic_name: string
    discount_percent: number
    expiration_date: string
    status: string
}

export default function CouponListScreen() {
    const [coupons, setCoupons] = useState<Coupon[]>([])
    const [filter, setFilter] = useState<"ALL" | "AVAILABLE" | "REDEEMED">("ALL")

    useEffect(() => {
        loadCoupons()
    }, [])

    const loadCoupons = async () => {
        try {
            const stored = await AsyncStorage.getItem(REDEEMED_KEY)
            const redeemedIds: number[] = stored ? JSON.parse(stored) : []

            const merged = data.coupons.map(c => ({
                ...c,
                status: redeemedIds.includes(c.id) ? "REDEEMED" : c.status
            }))
            setCoupons(merged)
        } catch (error) {
            console.log("Erro ao carregar cupons:", error)
            setCoupons(data.coupons)
        }
    }

    const handleRedeem = (coupon: Coupon) => {
        Alert.alert(
            "Resgatar cupom",
            `Deseja resgatar ${coupon.discount_percent}% de desconto na ${coupon.clinic_name}?`,
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Resgatar",
                    onPress: async () => {
                        try {
                            const stored = await AsyncStorage.getItem(REDEEMED_KEY)
                            const ids: number[] = stored ? JSON.parse(stored) : []
                            if (!ids.includes(coupon.id)) {
                                ids.push(coupon.id)
                                await AsyncStorage.setItem(REDEEMED_KEY, JSON.stringify(ids))
                            }
                            await loadCoupons()
                            Alert.alert("Sucesso!", `Cupom resgatado na ${coupon.clinic_name}.`)
                        } catch (error) {
                            Alert.alert("Ops!", "Não foi possível resgatar o cupom.")
                        }
                    }
                }
            ]
        )
    }

    const filtered = filter === "ALL"
        ? coupons
        : coupons.filter(c => c.status === filter)

    const availableCount = coupons.filter(c => c.status === "AVAILABLE").length

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Cupons</Text>
                    <Text style={styles.subtitle}>{availableCount} disponíveis</Text>
                </View>

                <View style={styles.filterRow}>
                    {(["ALL", "AVAILABLE", "REDEEMED"] as const).map(f => (
                        <TouchableOpacity
                            key={f}
                            style={[styles.filterBtn, filter === f && styles.filterBtnActive]}
                            onPress={() => setFilter(f)}
                        >
                            <Text style={[
                                styles.filterText,
                                filter === f && styles.filterTextActive
                            ]}>
                                {f === "ALL" ? "Todos" : f === "AVAILABLE" ? "Disponíveis" : "Resgatados"}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
                    {filtered.length === 0 ? (
                        <View style={styles.empty}>
                            <Text style={styles.emptyText}>Nenhum cupom nesta categoria</Text>
                        </View>
                    ) : (
                        filtered.map(coupon => {
                            const isAvailable = coupon.status === "AVAILABLE"
                            return (
                                <View
                                    key={coupon.id}
                                    style={[
                                        styles.couponCard,
                                        !isAvailable && styles.couponMuted
                                    ]}
                                >
                                    <View style={styles.couponLeft}>
                                        <Text style={styles.discount}>{coupon.discount_percent}%</Text>
                                        <Text style={styles.discountLabel}>OFF</Text>
                                    </View>
                                    <View style={styles.divider} />
                                    <View style={styles.couponRight}>
                                        <Text style={styles.clinicName}>{coupon.clinic_name}</Text>
                                        <Text style={styles.expDate}>
                                            Válido até {new Date(coupon.expiration_date).toLocaleDateString('pt-BR')}
                                        </Text>
                                        {isAvailable ? (
                                            <TouchableOpacity
                                                style={styles.redeemBtn}
                                                onPress={() => handleRedeem(coupon)}
                                            >
                                                <Text style={styles.redeemBtnText}>Resgatar</Text>
                                            </TouchableOpacity>
                                        ) : (
                                            <View style={styles.redeemedBadge}>
                                                <MaterialIcons name="check-circle" size={14} color="#999" />
                                                <Text style={styles.redeemedText}>Resgatado</Text>
                                            </View>
                                        )}
                                    </View>
                                </View>
                            )
                        })
                    )}
                </ScrollView>
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
        marginBottom: 16,
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
    filterRow: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 4,
        marginBottom: 16,
    },
    filterBtn: {
        flex: 1,
        paddingVertical: 8,
        alignItems: 'center',
        borderRadius: 6,
    },
    filterBtnActive: {
        backgroundColor: '#2D6A4F',
    },
    filterText: {
        fontSize: 13,
        color: '#666',
        fontWeight: '500',
    },
    filterTextActive: {
        color: '#fff',
        fontWeight: 'bold',
    },
    list: {
        flex: 1,
    },
    couponCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 12,
        overflow: 'hidden',
    },
    couponMuted: {
        opacity: 0.6,
    },
    couponLeft: {
        backgroundColor: '#2D6A4F',
        paddingVertical: 20,
        paddingHorizontal: 16,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 90,
    },
    discount: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
    },
    discountLabel: {
        fontSize: 12,
        color: '#fff',
        marginTop: -2,
    },
    divider: {
        width: 1,
        backgroundColor: '#eee',
    },
    couponRight: {
        flex: 1,
        padding: 14,
    },
    clinicName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    expDate: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
        marginBottom: 8,
    },
    redeemBtn: {
        backgroundColor: '#2D6A4F',
        borderRadius: 6,
        paddingVertical: 6,
        paddingHorizontal: 14,
        alignSelf: 'flex-start',
    },
    redeemBtnText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    redeemedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        alignSelf: 'flex-start',
    },
    redeemedText: {
        color: '#999',
        fontSize: 12,
        fontWeight: 'bold',
    },
    empty: {
        padding: 30,
        alignItems: 'center',
    },
    emptyText: {
        color: '#999',
        fontSize: 14,
    },
})

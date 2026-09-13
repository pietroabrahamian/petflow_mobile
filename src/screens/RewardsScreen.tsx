import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    RefreshControl,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import MaterialIcons from "@expo/vector-icons/MaterialIcons"

import { useAvailableCoupons, useRedeemCoupon, useTutorPoints } from "../hooks/useGamification"
import LoadingView from "../components/LoadingView"
import ErrorView from "../components/ErrorView"
import { getApiErrorMessage } from "../api/client"
import { formatDateBR } from "../utils/date"
import { CouponCatalogItem } from "../types/api"
import { colors } from "../theme/colors"

export default function RewardsScreen() {
    const points = useTutorPoints()
    const coupons = useAvailableCoupons()
    const redeemCoupon = useRedeemCoupon()

    const isLoading = points.isLoading || coupons.isLoading
    const isError = points.isError || coupons.isError
    const isFetching = points.isFetching || coupons.isFetching

    const refetchAll = () => {
        points.refetch()
        coupons.refetch()
    }

    if (isLoading) {
        return (
            <SafeAreaView style={styles.container}>
                <LoadingView label="Carregando recompensas..." />
            </SafeAreaView>
        )
    }

    if (isError) {
        return (
            <SafeAreaView style={styles.container}>
                <ErrorView message={getApiErrorMessage(points.error ?? coupons.error)} onRetry={refetchAll} />
            </SafeAreaView>
        )
    }

    const totalPoints = points.data?.totalPoints ?? 0

    const handleRedeem = (coupon: CouponCatalogItem) => {
        if (totalPoints < coupon.pointsRequired) {
            Alert.alert("Pontos insuficientes", `Você precisa de ${coupon.pointsRequired} pontos para resgatar este cupom.`)
            return
        }
        Alert.alert(
            "Resgatar cupom",
            `Deseja resgatar "${coupon.title}" por ${coupon.pointsRequired} pontos?`,
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Resgatar",
                    onPress: async () => {
                        try {
                            await redeemCoupon.mutateAsync(coupon.id)
                            Alert.alert("Sucesso!", "Cupom resgatado. Confira o código em Ajustes > Histórico.")
                        } catch (error) {
                            Alert.alert("Ops!", getApiErrorMessage(error, "Não foi possível resgatar o cupom."))
                        }
                    },
                },
            ]
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={isFetching && !isLoading} onRefresh={refetchAll} colors={[colors.primary]} />
                }
            >
                <View style={styles.header}>
                    <Text style={styles.title}>Recompensas</Text>
                    <Text style={styles.subtitle}>Troque seus pontos por cupons</Text>
                </View>

                <View style={styles.pointsCard}>
                    <MaterialIcons name="stars" size={32} color={colors.accent} />
                    <View>
                        <Text style={styles.pointsValue}>{totalPoints} pts</Text>
                        <Text style={styles.pointsLabel}>Seus pontos acumulados</Text>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>CUPONS DISPONÍVEIS</Text>

                {!coupons.data || coupons.data.length === 0 ? (
                    <View style={styles.empty}>
                        <Text style={styles.emptyText}>Nenhum cupom disponível no momento</Text>
                    </View>
                ) : (
                    coupons.data.map(coupon => {
                        const affordable = totalPoints >= coupon.pointsRequired
                        const isRedeeming = redeemCoupon.isPending && redeemCoupon.variables === coupon.id
                        return (
                            <View key={coupon.id} style={[styles.couponCard, !affordable && styles.couponMuted]}>
                                <View style={styles.couponLeft}>
                                    <Text style={styles.pointsRequired}>{coupon.pointsRequired}</Text>
                                    <Text style={styles.pointsRequiredLabel}>PTS</Text>
                                </View>
                                <View style={styles.divider} />
                                <View style={styles.couponRight}>
                                    <Text style={styles.couponTitle}>{coupon.title}</Text>
                                    <Text style={styles.expDate}>
                                        Válido até {formatDateBR(coupon.expirationDate)}
                                    </Text>
                                    <TouchableOpacity
                                        style={[styles.redeemBtn, !affordable && styles.redeemBtnDisabled]}
                                        onPress={() => handleRedeem(coupon)}
                                        disabled={redeemCoupon.isPending}
                                    >
                                        {isRedeeming ? (
                                            <ActivityIndicator color={colors.surface} size="small" />
                                        ) : (
                                            <Text style={styles.redeemBtnText}>
                                                {affordable ? "Resgatar" : "Pontos insuficientes"}
                                            </Text>
                                        )}
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )
                    })
                )}
            </ScrollView>
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
        marginBottom: 16,
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
    pointsCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        backgroundColor: colors.surface,
        borderRadius: 12,
        padding: 18,
        marginBottom: 20,
    },
    pointsValue: {
        fontSize: 22,
        fontWeight: 'bold',
        color: colors.textPrimary,
    },
    pointsLabel: {
        fontSize: 12,
        color: colors.textSecondary,
        marginTop: 2,
    },
    sectionTitle: {
        fontSize: 12,
        color: colors.textLabel,
        marginBottom: 10,
    },
    couponCard: {
        flexDirection: 'row',
        backgroundColor: colors.surface,
        borderRadius: 12,
        marginBottom: 12,
        overflow: 'hidden',
    },
    couponMuted: {
        opacity: 0.7,
    },
    couponLeft: {
        backgroundColor: colors.primary,
        paddingVertical: 20,
        paddingHorizontal: 16,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 90,
    },
    pointsRequired: {
        fontSize: 22,
        fontWeight: 'bold',
        color: colors.surface,
    },
    pointsRequiredLabel: {
        fontSize: 11,
        color: colors.surface,
        marginTop: -2,
    },
    divider: {
        width: 1,
        backgroundColor: colors.border,
    },
    couponRight: {
        flex: 1,
        padding: 14,
    },
    couponTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        color: colors.textPrimary,
    },
    expDate: {
        fontSize: 12,
        color: colors.textSecondary,
        marginTop: 4,
        marginBottom: 10,
    },
    redeemBtn: {
        backgroundColor: colors.primary,
        borderRadius: 6,
        paddingVertical: 8,
        paddingHorizontal: 14,
        alignSelf: 'flex-start',
        minWidth: 90,
        alignItems: 'center',
    },
    redeemBtnDisabled: {
        backgroundColor: colors.disabled,
    },
    redeemBtnText: {
        color: colors.surface,
        fontSize: 12,
        fontWeight: 'bold',
    },
    empty: {
        padding: 30,
        alignItems: 'center',
    },
    emptyText: {
        color: colors.textMuted,
        fontSize: 14,
    },
})

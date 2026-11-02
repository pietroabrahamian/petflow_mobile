import { getTutorPoints, listAvailableCoupons } from "./gamificationService"
import { showNotificationNow } from "./notificationService"
import { getPreferences } from "./preferencesService"

/**
 * A API dá pontos quando o tutor cadastra pet, registra evento de saúde realizado
 * ou ativa um convênio. Guardamos o saldo antes da ação e, depois dela, avisamos
 * por notificação quantos pontos entraram e se algum cupom foi liberado.
 */
export async function runWithRewardCheck<T>(action: () => Promise<T>): Promise<T> {
    const before = await getTutorPoints().catch(() => null)
    const result = await action()

    if (before) {
        notifyRewardChanges(before.totalPoints).catch((error) =>
            console.log("[rewardAlertService] Não foi possível verificar os pontos:", error)
        )
    }
    return result
}

async function notifyRewardChanges(previousTotal: number): Promise<void> {
    const preferences = await getPreferences()
    if (!preferences.rewardAlerts) return

    const [points, coupons] = await Promise.all([getTutorPoints(), listAvailableCoupons()])
    const gained = points.totalPoints - previousTotal
    if (gained <= 0) return

    // Cupons que o saldo antigo não alcançava e o novo alcança
    const unlocked = coupons.filter(
        (coupon) => coupon.available && coupon.pointsRequired > previousTotal && coupon.pointsRequired <= points.totalPoints
    )

    // O catálogo traz vários cupons com o mesmo título (um por código): mostra cada título uma vez
    const unlockedTitles = [...new Set(unlocked.map((coupon) => coupon.title))]

    const body = unlockedTitles.length > 0
        ? `Seu saldo agora é ${points.totalPoints} pontos e você já pode resgatar: ${unlockedTitles.join(", ")}.`
        : `Seu saldo agora é ${points.totalPoints} pontos. Toque para ver os cupons.`

    await showNotificationNow(`+${gained} pontos no PetFlow`, body, { screen: "RewardsScreen" })
}

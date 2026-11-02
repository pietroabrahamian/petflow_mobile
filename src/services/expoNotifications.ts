/**
 * Importar "expo-notifications" inteiro quebra o Expo Go no Android, que não tem o
 * módulo nativo de push. Como o app só usa notificação local, importamos só essas partes.
 */
export { setNotificationHandler } from "expo-notifications/build/NotificationsHandler"
export { getPermissionsAsync, requestPermissionsAsync } from "expo-notifications/build/NotificationPermissions"
export { default as setNotificationChannelAsync } from "expo-notifications/build/setNotificationChannelAsync"
export { default as scheduleNotificationAsync } from "expo-notifications/build/scheduleNotificationAsync"
export { default as cancelScheduledNotificationAsync } from "expo-notifications/build/cancelScheduledNotificationAsync"
export { default as cancelAllScheduledNotificationsAsync } from "expo-notifications/build/cancelAllScheduledNotificationsAsync"
export {
    addNotificationResponseReceivedListener,
    getLastNotificationResponseAsync,
} from "expo-notifications/build/NotificationsEmitter"
export { SchedulableTriggerInputTypes } from "expo-notifications/build/Notifications.types"
export type { NotificationResponse } from "expo-notifications/build/Notifications.types"
export { AndroidImportance } from "expo-notifications/build/NotificationChannelManager.types"

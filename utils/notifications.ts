import { useTranslation } from '@/i18n';
import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';
// import useStore from './useStore';

async function requestPermissions() {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
        alert('You need to enable notifications for reminders!');
    }
}

async function scheduleDailyNotification(notificationMessageTitle: string, notificationMessage: string) {
    await Notifications.cancelAllScheduledNotificationsAsync(); // Clear old ones

    await Notifications.scheduleNotificationAsync({
        content: {
            title: notificationMessageTitle,
            body: notificationMessage,
        },
        trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DAILY,
            hour: 18,
            minute: 0,
        },
    });
}

function useNotifications() {
    const { t } = useTranslation();

    useEffect(() => {
        requestPermissions();
        scheduleDailyNotification(t('settings.notificationMessageTitle'), t('settings.notificationMessage'));
    }, []);
}

export default useNotifications;
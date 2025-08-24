import React, { useState } from 'react';
import { StyleSheet, useColorScheme, SafeAreaView, Switch, Alert, Platform } from 'react-native';
import { useConfigStore } from '../utils/state';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { SymbolView } from 'expo-symbols';
import { View, Text } from '@/components/Themed';
import TimePicker from '@/components/TimePicker';
import * as Notifications from 'expo-notifications';
import { useTranslation } from '@/i18n';

export default function NotificationSettings() {
    const {
        notificationsEnabled,
        notificationHour,
        toggleNotificationsEnabled,
        setNotificationHour
    } = useConfigStore();
    const { t } = useTranslation();

    const colorScheme = useColorScheme();
    const isDarkMode = colorScheme === 'dark';

    const [selectedDate, setSelectedDate] = useState(() => {
        const date = new Date();
        date.setHours(notificationHour, 0, 0, 0);
        return date;
    });

    const requestPermissions = async () => {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert(
                t('notifications.permissionRequired'),
                t('notifications.permissionMessage'),
                [{ text: t('common.ok') }]
            );
            return false;
        }
        return true;
    };

    const scheduleDailyNotification = async (hour: number, minute: number) => {
        await Notifications.cancelAllScheduledNotificationsAsync();

        await Notifications.scheduleNotificationAsync({
            content: {
                title: t('notifications.notificationTitle'),
                body: t('notifications.notificationBody'),
            },
            trigger: {
                type: Notifications.SchedulableTriggerInputTypes.DAILY,
                hour: hour,
                minute: minute,
            },
        });
    };

    const handleToggleNotifications = async () => {
        if (!notificationsEnabled) {
            const hasPermission = await requestPermissions();
            if (hasPermission) {
                toggleNotificationsEnabled();
                await scheduleDailyNotification(selectedDate.getHours(), selectedDate.getMinutes());
            }
        } else {
            await Notifications.cancelAllScheduledNotificationsAsync();
            toggleNotificationsEnabled();
        }
    };

    const handleTimeChange = async (date: Date) => {
        setSelectedDate(date);
        const hour = date.getHours();
        const minute = date.getMinutes();

        setNotificationHour(hour);

        if (notificationsEnabled) {
            await scheduleDailyNotification(hour, minute);
        }
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                {/* Notification Toggle Group */}
                <View style={styles.group}>
                    <View style={[styles.groupContainer, { backgroundColor: isDarkMode ? '#151515' : '#ffffff' }]}>
                        <View style={styles.settingRow}>
                            <View style={styles.settingContent}>
                                <Text style={styles.settingText}>{t('notifications.reminderNotifications')}</Text>
                                <View style={styles.settingRight}>
                                    <Switch
                                        value={notificationsEnabled}
                                        onValueChange={handleToggleNotifications}
                                        trackColor={{ false: '#E5E5EA', true: '#34C759' }}
                                        thumbColor={notificationsEnabled ? '#ffffff' : '#ffffff'}
                                        ios_backgroundColor="#E5E5EA"
                                    />
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Time Picker Group */}
                {notificationsEnabled && (
                    <View style={styles.group}>
                        <View style={[styles.groupContainer, { backgroundColor: isDarkMode ? '#151515' : '#ffffff' }]}>
                            <View style={styles.settingRow}>
                                <View style={styles.settingContent}>
                                    <Text style={styles.settingText}>{t('notifications.reminderTime')}</Text>
                                    <View style={styles.settingRight}>
                                        <Text style={styles.settingValue}>{formatTime(selectedDate)}</Text>
                                    </View>
                                </View>
                            </View>

                            <View style={[styles.separator, { backgroundColor: isDarkMode ? '#555555' : '#C6C6C8' }]} />

                            <View style={styles.timePickerContainer}>
                                <TimePicker
                                    value={selectedDate}
                                    onChange={handleTimeChange}
                                />
                            </View>
                        </View>
                    </View>
                )}

                {/* Info Group */}
                <View style={styles.group}>
                    <View style={[styles.groupContainer, { backgroundColor: isDarkMode ? '#151515' : '#ffffff' }]}>
                        <View style={styles.infoRow}>
                            <View style={styles.infoContent}>
                                {Platform.OS === 'ios' ? (
                                    <SymbolView
                                        name="info.circle"
                                        tintColor='#007AFF'
                                        type="hierarchical"
                                        size={18}
                                    />
                                ) : (
                                    <MaterialCommunityIcons
                                        name={'information-outline'}
                                        color='#007AFF'
                                        size={20}
                                    />
                                )}
                                <Text style={styles.infoText}>
                                    {t('notifications.infoMessage')}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        paddingTop: 20,
        backgroundColor: 'transparent',
    },
    group: {
        backgroundColor: 'transparent',
        marginBottom: 35,
        paddingHorizontal: 16,
    },
    groupContainer: {
        borderRadius: 10,
        overflow: 'hidden',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: {
                    width: 0,
                    height: 1,
                },
                shadowOpacity: 0.05,
                shadowRadius: 2,
            },
            android: {
                elevation: 1,
            },
        }),
    },
    settingRow: {
        backgroundColor: 'transparent',
    },
    settingContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        minHeight: 44,
        backgroundColor: 'transparent',
    },
    settingText: {
        fontSize: 17,
        fontWeight: '400',
    },
    settingRight: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    settingValue: {
        fontSize: 17,
        color: '#8E8E93',
        marginRight: 8,
    },
    separator: {
        height: StyleSheet.hairlineWidth,
        marginHorizontal: 16,
    },
    timePickerContainer: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: 'transparent',
    },
    infoRow: {
        backgroundColor: 'transparent',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    infoContent: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: 'transparent',
    },
    infoText: {
        fontSize: 14,
        color: '#8E8E93',
        marginLeft: 8,
        flex: 1,
        lineHeight: 20,
    },
});
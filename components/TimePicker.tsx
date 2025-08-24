// components/TimePicker.tsx
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, Modal, useColorScheme, Platform } from 'react-native';
import { View, Text } from '@/components/Themed';
import { SymbolView } from 'expo-symbols';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTranslation } from '@/i18n';

interface TimePickerProps {
    value: Date;
    onChange: (date: Date) => void;
    disabled?: boolean;
}

export default function TimePicker({ value, onChange, disabled = false }: TimePickerProps) {
    const [showPicker, setShowPicker] = useState(false);
    const [tempTime, setTempTime] = useState(value);
    const colorScheme = useColorScheme();
    const isDarkMode = colorScheme === 'dark';
    const { t } = useTranslation();

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const handleTimeChange = (event: any, selectedDate?: Date) => {
        if (Platform.OS === 'android') {
            setShowPicker(false);
            if (selectedDate && event.type === 'set') {
                onChange(selectedDate);
            }
        } else {
            if (selectedDate) {
                setTempTime(selectedDate);
            }
        }
    };

    const handleIOSConfirm = () => {
        onChange(tempTime);
        setShowPicker(false);
    };

    const handleIOSCancel = () => {
        setTempTime(value);
        setShowPicker(false);
    };

    return (
        <>
            <TouchableOpacity
                style={[
                    styles.timeButton,
                    {
                        backgroundColor: isDarkMode ? '#2C2C2E' : '#F2F2F7',
                        opacity: disabled ? 0.5 : 1
                    }
                ]}
                onPress={() => !disabled && setShowPicker(true)}
                disabled={disabled}
            >
                <Text style={[styles.timeText, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>
                    {formatTime(value)}
                </Text>
                {Platform.OS === 'ios' ? (
                    <SymbolView
                        name="clock"
                        tintColor={isDarkMode ? '#8E8E93' : '#8E8E93'} // lol?
                        type="hierarchical"
                        size={16}
                    />
                ) : (
                    <MaterialCommunityIcons
                        name="clock-outline"
                        color={'#8E8E93'}
                        size={18}
                    />
                )}
            </TouchableOpacity>

            {/* iOS Modal */}
            {Platform.OS === 'ios' && (
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={showPicker}
                    onRequestClose={handleIOSCancel}
                >
                    <View style={styles.modalOverlay}>
                        <View style={[styles.modalContent, { backgroundColor: isDarkMode ? '#1C1C1E' : '#FFFFFF' }]}>
                            <View style={styles.modalHeader}>
                                <TouchableOpacity onPress={handleIOSCancel}>
                                    <Text style={[styles.modalButton, { color: '#007AFF' }]}>{t('common.close')}</Text>
                                </TouchableOpacity>
                                <Text style={[styles.modalTitle, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>
                                    {t('notifications.reminderTime')}
                                </Text>
                                <TouchableOpacity onPress={handleIOSConfirm}>
                                    <Text style={[styles.modalButton, { color: '#007AFF' }]}>{t('common.done')}</Text>
                                </TouchableOpacity>
                            </View>

                            <DateTimePicker
                                value={tempTime}
                                mode="time"
                                display="spinner"
                                onChange={handleTimeChange}
                                style={styles.picker}
                                textColor={isDarkMode ? '#FFFFFF' : '#000000'}
                            />
                        </View>
                    </View>
                </Modal>
            )}

            {/* Android DT-Picker */}
            {Platform.OS === 'android' && showPicker && (
                <DateTimePicker
                    value={value}
                    mode="time"
                    display="default"
                    onChange={handleTimeChange}
                />
            )}
        </>
    );
}

const styles = StyleSheet.create({
    timeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 8,
        minHeight: 44,
    },
    timeText: {
        fontSize: 17,
        fontWeight: '400',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingBottom: 34,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#C6C6C8',
    },
    modalTitle: {
        fontSize: 17,
        fontWeight: '600',
    },
    modalButton: {
        fontSize: 17,
        fontWeight: '400',
    },
    picker: {
        height: 200,
    },
});
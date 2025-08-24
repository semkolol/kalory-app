import React, { useState, useEffect } from 'react';
import {
    Modal,
    StyleSheet,
    TextInput,
    Pressable,
    useColorScheme,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from 'react-native';
import { View, Text } from '@/components/Themed';
import { FoodDatabaseItem } from '@/utils/state';
import { useTranslation } from '@/i18n';

type FormData = Omit<FoodDatabaseItem, 'id'>;

interface FoodFormModalProps {
    visible: boolean;
    onClose: () => void;
    onSave: (data: FormData) => void;
    itemToEdit: FoodDatabaseItem | null;
}

const FoodFormModal: React.FC<FoodFormModalProps> = ({ visible, onClose, onSave, itemToEdit }) => {
    const colorScheme = useColorScheme();
    const isDarkMode = colorScheme === 'dark';
    const { t } = useTranslation();

    const initialFormState: FormData = {
        foodName: '',
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        metrics: 'g',
    };

    const [formData, setFormData] = useState<FormData>(initialFormState);

    useEffect(() => {
        const calculatedCalories = Math.round(
            (formData.protein * 4) + (formData.carbs * 4) + (formData.fat * 9)
        );
        if (calculatedCalories !== formData.calories) {
            setFormData(prev => ({ ...prev, calories: calculatedCalories }));
        }
    }, [formData.protein, formData.carbs, formData.fat]);


    useEffect(() => {
        if (itemToEdit) {
            setFormData({
                foodName: itemToEdit.foodName,
                calories: itemToEdit.calories,
                protein: itemToEdit.protein,
                carbs: itemToEdit.carbs,
                fat: itemToEdit.fat,
                metrics: itemToEdit.metrics,
            });
        } else {
            setFormData(initialFormState);
        }
    }, [itemToEdit, visible]);

    const handleInputChange = (field: keyof FormData, value: string) => {
        const isNumericField = ['protein', 'carbs', 'fat'].includes(field);
        const processedValue = isNumericField ? Number(value) || 0 : value;
        setFormData((prev) => ({ ...prev, [field]: processedValue }));
    };

    const handleSavePress = () => {
        if (!formData.foodName.trim()) {
            Alert.alert(t('error.validationError'), t('food.foodNameEmptyError'));
            return;
        }
        onSave(formData);
    };

    const modalTitle = itemToEdit ? t('food.editFood') : t('food.addFood');
    const inputBackgroundColor = isDarkMode ? '#3A3A3C' : '#e5e5e5';
    const disabledInputColor = isDarkMode ? '#2C2C2E' : '#d5d5d5';
    const buttonTextColor = isDarkMode ? '#0A84FF' : '#007AFF';

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.centeredView}
            >
                <View style={[styles.modalView, { backgroundColor: isDarkMode ? 'rgba(10, 10, 10, 1)' : 'rgb(240, 240, 240)' }]}>
                    <View style={styles.header}>
                        <Pressable onPress={onClose}><Text style={{ color: buttonTextColor, fontSize: 16 }}>{t('common.cancel')}</Text></Pressable>
                        <Text style={styles.modalTitle}>{modalTitle}</Text>
                        <Pressable onPress={handleSavePress}><Text style={[styles.saveButtonText, { color: buttonTextColor }]}>{t('common.save')}</Text></Pressable>
                    </View>

                    <Text style={styles.label}>{t('food.foodName')}</Text>
                    <TextInput
                        style={[styles.input, { backgroundColor: inputBackgroundColor, color: isDarkMode ? '#8E8E93' : '#3C3C43' }]}
                        value={formData.foodName}
                        onChangeText={(text) => handleInputChange('foodName', text)}
                        placeholder="e.g., Chicken Breast"
                    />

                    <Text style={styles.label}>{t('food.macros')} (per 100g/ml)</Text>
                    <View style={styles.macroRow}>
                        <View style={styles.macroInputContainer}>
                            <Text style={styles.macroLabel}>{t('food.calories')}</Text>
                            <TextInput
                                style={[styles.input, { backgroundColor: disabledInputColor, color: isDarkMode ? '#8E8E93' : '#3C3C43' }]}
                                value={String(formData.calories)}
                                editable={false}
                                selectTextOnFocus={false}
                            />
                        </View>
                        <View style={styles.macroInputContainer}>
                            <Text style={styles.macroLabel}>{t('food.protein')} (g)</Text>
                            <TextInput
                                style={[styles.input, { backgroundColor: inputBackgroundColor, color: isDarkMode ? '#8E8E93' : '#3C3C43' }]}
                                value={String(formData.protein)}
                                onChangeText={(text) => handleInputChange('protein', text)}
                                keyboardType="numeric"
                            />
                        </View>
                    </View>
                    <View style={styles.macroRow}>
                        <View style={styles.macroInputContainer}>
                            <Text style={styles.macroLabel}>{t('food.carbs')} (g)</Text>
                            <TextInput
                                style={[styles.input, { backgroundColor: inputBackgroundColor, color: isDarkMode ? '#8E8E93' : '#3C3C43' }]}
                                value={String(formData.carbs)}
                                onChangeText={(text) => handleInputChange('carbs', text)}
                                keyboardType="numeric"
                            />
                        </View>
                        <View style={styles.macroInputContainer}>
                            <Text style={styles.macroLabel}>{t('food.fat')} (g)</Text>
                            <TextInput
                                style={[styles.input, { backgroundColor: inputBackgroundColor, color: isDarkMode ? '#8E8E93' : '#3C3C43' }]}
                                value={String(formData.fat)}
                                onChangeText={(text) => handleInputChange('fat', text)}
                                keyboardType="numeric"
                            />
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    modalView: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: -2,
        },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 5
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 17,
        fontWeight: '600',
    },
    saveButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        opacity: 0.8,
    },
    input: {
        padding: 12,
        borderRadius: 8,
        fontSize: 16,
        marginBottom: 16,
    },
    macroRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    macroInputContainer: {
        flex: 1,
        marginHorizontal: 4,
    },
    macroLabel: {
        fontSize: 14,
        marginBottom: 6,
        opacity: 0.7,
    },
});


export default FoodFormModal;
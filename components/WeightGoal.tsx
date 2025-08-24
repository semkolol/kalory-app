import React from 'react';
import { Text, View, TouchableOpacity, useColorScheme, StyleSheet, TextInput } from 'react-native';
import { useGoalsStore } from '../utils/state';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from '../i18n';

type FormData = {
    currentWeight: number;
    height: number;
    age: number;
    goalWeight: number;
};

export default function WeightGoals(): React.ReactElement {
    const colorScheme = useColorScheme();
    const { t } = useTranslation();

    const themeTextStyle = colorScheme === 'light' ? styles.lightThemeText : styles.darkThemeText;

    const themeContainerStyle =
        colorScheme === 'light' ? styles.lightContainer : styles.darkContainer;

    const tertiaryColor = colorScheme === 'light' ? '#84cc16' : '#a3e635'; // green

    const primaryColor = colorScheme === 'light' ? '#f48069' : '#ef5a3c';
    const inputBgStyle = colorScheme === 'light' ? styles.lightInputBg : styles.darkInputBg;

    const {
        weightCurrent,
        weightGoal,
        setWeightCurrent,
        setWeightGoal
    } = useGoalsStore();

    const { control, handleSubmit, watch, setValue, reset } = useForm<FormData>({
        defaultValues: {
            currentWeight: weightCurrent || 0,
            goalWeight: weightGoal || 0
        }
    });
    const formValues = watch();

    const weightDiff = (formValues.currentWeight || weightCurrent || 0) - (formValues.goalWeight || weightGoal || 0);

    function handleWeightCurrent(weight: number) {
        setWeightCurrent(weight);
    }

    function handleWeightGoal(weight: number) {
        setWeightGoal(weight);
    }

    return (
        <View style={[themeContainerStyle, styles.container]}>
            <View style={styles.weightContainer}>
                <View style={styles.weightForm}>
                    <View style={styles.weightInputContainer}>
                        <Text style={[themeTextStyle, styles.weightLabel]}>{t('food.currentWeight')}</Text>
                        <View style={styles.inputWrapper}>
                            <Controller
                                control={control}
                                render={({ field: { onChange, value } }) => (
                                    <TextInput
                                        style={[inputBgStyle, themeTextStyle, styles.input, { borderColor: colorScheme === 'light' ? '#9ca3af' : '#6b7280' }]}
                                        placeholder={`${weightCurrent || 0}`}
                                        placeholderTextColor={colorScheme === 'light' ? '#9ca3af' : '#6b7280'}
                                        onChangeText={(val) => { onChange(val ? Number(val) : 0); handleWeightCurrent(Number(val)) }}
                                        value={value ? String(value) : ''}
                                        keyboardType="numeric"
                                    />
                                )}
                                name="currentWeight"
                            />
                            <Text style={[themeTextStyle, styles.unitText]}>kg</Text>
                        </View>
                    </View>

                    <View style={styles.weightInputContainer}>
                        <Text style={[themeTextStyle, styles.weightLabel]}>{t('food.goalWeight')}</Text>
                        <View style={styles.inputWrapper}>
                            <Controller
                                control={control}
                                render={({ field: { onChange, value } }) => (
                                    <TextInput
                                        style={[inputBgStyle, themeTextStyle, styles.input, { borderColor: tertiaryColor }]}
                                        placeholder={`${weightGoal || 0}`}
                                        placeholderTextColor={colorScheme === 'light' ? '#9ca3af' : '#6b7280'}
                                        onChangeText={(val) => { onChange(val ? Number(val) : 0); handleWeightGoal(Number(val)) }}
                                        value={value ? String(value) : ''}
                                        keyboardType="numeric"
                                    />
                                )}
                                name="goalWeight"
                            />
                            <Text style={[themeTextStyle, styles.unitText]}>kg</Text>
                        </View>
                    </View>
                </View>

                {weightDiff !== 0 && (
                    <View style={styles.weightDifference}>
                        <Text style={[themeTextStyle, styles.weightDiffText]}>
                            {weightDiff > 0 ? t('common.toLose') : t('common.toGain')}
                            <Text style={{ fontWeight: 'bold', color: weightDiff > 0 ? primaryColor : tertiaryColor }}> {Math.abs(weightDiff)} kg</Text>
                        </Text>
                    </View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 8,
        width: '100%',
    },
    lightContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    darkContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    lightInputBg: {
        backgroundColor: '#e5e5e550',
    },
    darkInputBg: {
        backgroundColor: '#00000020',
    },
    lightThemeText: {
        color: '#242c40'
    },
    darkThemeText: {
        color: '#d0d0c0'
    },
    heading: {
        fontSize: 24,
        fontWeight: '600',
        marginBottom: 24,
        textAlign: 'center'
    },
    goalsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 24,
    },
    goalItem: {
        borderRadius: 12,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    goalIcon: {
        fontSize: 32,
        marginBottom: 8,
    },
    goalText: {
        fontWeight: '500',
        textAlign: 'center',
    },
    sectionContainer: {
        marginBottom: 24,
        padding: 8,
        borderRadius: 12,
        backgroundColor: '#00000010',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 16,
    },
    inputWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        height: 48,
        borderRadius: 8,
        borderWidth: 1,
        paddingHorizontal: 12,
        fontSize: 16,
        width: '100%',
    },
    unitText: {
        position: 'absolute',
        right: 12,
        fontSize: 16,
        opacity: 0.5,
    },
    selectionText: {
        marginBottom: 16,
        fontSize: 16,
    },
    weightContainer: {
        marginBottom: 8,
    },
    weightForm: {
        flexDirection: 'row',
        marginBottom: 8,
        width: '100%',
    },
    weightInputContainer: {
        flex: 1,
        margin: 4,
    },
    weightLabel: {
        fontSize: 14,
        marginBottom: 4,
        fontWeight: '500',
    },
    weightDifference: {
        alignItems: 'center'
    },
    weightDiffText: {
        fontSize: 16,
    }
});
import React, { useEffect } from 'react';
import {
    Text,
    View,
    useColorScheme,
    StyleSheet,
    TextInput
} from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { useGoalsStore } from '../utils/state';
import Animated,
{
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    Easing
} from 'react-native-reanimated';
import { useTranslation } from '../i18n';

type FormData = {
    protein: number;
    carbs: number;
    fat: number;
    currentWeight: number;
    goalWeight: number;
};

type MacroType = 'protein' | 'carbs' | 'fat';

export default function CalorieCalc() {
    const colorScheme = useColorScheme();
    const { t } = useTranslation();
    const themeTextStyle = colorScheme === 'light' ? styles.lightThemeText : styles.darkThemeText;
    const themeContainerStyle = colorScheme === 'light' ? styles.lightContainer : styles.darkContainer;
    const inputBgStyle = colorScheme === 'light' ? styles.lightInputBg : styles.darkInputBg;

    // progressbar: #ef5a3c
    const primaryColor = colorScheme === 'light' ? '#3b82f6' : '#60a5fa'; // blue
    // progressbar: #2189e2
    const secondaryColor = colorScheme === 'light' ? '#f472b6' : '#f472b6'; // pink
    // progressbar: #019658
    const tertiaryColor = colorScheme === 'light' ? '#84cc16' : '#a3e635'; // green

    const {
        carbsGoal,
        fatGoal,
        proteinGoal,
        weightCurrent,
        weightGoal,
        setCarbsGoal,
        setFatGoal,
        setProteinGoal,
        setWeightCurrent,
        setWeightGoal
    } = useGoalsStore();

    const progressValue = useSharedValue(0);
    const animatedProgressStyle = useAnimatedStyle(() => {
        return {
            width: `${progressValue.value}%`,
        };
    });

    const { control, watch, setValue } = useForm<FormData>({
        defaultValues: {
            protein: proteinGoal || 0,
            carbs: carbsGoal || 0,
            fat: fatGoal || 0,
            currentWeight: weightCurrent || 0,
            goalWeight: weightGoal || 0
        }
    });

    const formValues = watch();
    const protein = watch('protein');
    const carbs = watch('carbs');
    const fat = watch('fat');

    useEffect(() => {
        setProteinGoal(protein);
        setCarbsGoal(carbs);
        setFatGoal(fat);
    }, [protein, carbs, fat, setProteinGoal, setCarbsGoal, setFatGoal]);

    useEffect(() => {
        setValue('protein', proteinGoal || 0);
        setValue('carbs', carbsGoal || 0);
        setValue('fat', fatGoal || 0);
        setValue('currentWeight', weightCurrent || 0);
        setValue('goalWeight', weightGoal || 0);
    }, [proteinGoal, carbsGoal, fatGoal, weightCurrent, weightGoal]);

    // calculate total calories
    const totalCalories = (
        (formValues.protein || proteinGoal || 0) * 4 +
        (formValues.carbs || carbsGoal || 0) * 4 +
        (formValues.fat || fatGoal || 0) * 9
    );

    // calculate macro percentages
    const proteinPercent = Math.round(((formValues.protein || proteinGoal || 0) * 4 / totalCalories) * 100) || 0;
    const carbsPercent = Math.round(((formValues.carbs || carbsGoal || 0) * 4 / totalCalories) * 100) || 0;
    const fatPercent = Math.round(((formValues.fat || fatGoal || 0) * 9 / totalCalories) * 100) || 0;

    // update progress animation
    useEffect(() => {
        progressValue.value = withTiming(100, {
            duration: 1000,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        });
    }, []);

    const renderMacroInput = (name: MacroType, label: string, color: string, unit: string) => {
        return (
            <View style={styles.macroInputContainer}>
                <Text style={[themeTextStyle, styles.macroLabel]}>
                    {t(`food.${label.toLowerCase()}`)}
                </Text>
                <View style={styles.inputWrapper}>
                    <Controller
                        control={control}
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                style={[inputBgStyle, themeTextStyle, colorScheme === 'light' ? styles.lightInput : styles.darkInput, { borderColor: color }]}
                                placeholder={`${value || 0}`}
                                placeholderTextColor={colorScheme === 'light' ? '#9ca3af' : '#6b7280'}
                                onChangeText={(val) => { onChange(val ? Number(val) : 0) }}
                                value={value ? String(value) : ''}
                                keyboardType="numeric"
                            />
                        )}
                        name={name}
                    />
                    <Text style={[themeTextStyle, styles.unitText]}>{unit}</Text>
                </View>
            </View>
        );
    };

    return (
        <View style={[themeContainerStyle, styles.container]}>

            {/* Calories Summary */}
            <View style={styles.caloriesSummary}>
                <Text style={[themeTextStyle, styles.caloriesValue]}>
                    {totalCalories}
                    <Text style={styles.caloriesUnit}> {t('food.caloriesShort')}</Text>
                </Text>

                {/* Macros bar */}
                <View style={styles.macrosBar}>
                    <Animated.View style={[styles.macrosBarSegment, animatedProgressStyle]}>
                        <View style={[styles.macroSegment, { width: `${proteinPercent}%`, backgroundColor: primaryColor }]} />
                        <View style={[styles.macroSegment, { width: `${carbsPercent}%`, backgroundColor: tertiaryColor }]} />
                        <View style={[styles.macroSegment, { width: `${fatPercent}%`, backgroundColor: secondaryColor }]} />
                    </Animated.View>
                </View>

                {/* Macros summary */}
                <View style={styles.macrosSummary}>
                    <View style={styles.macroItem}>
                        <View style={[styles.macroColorIndicator, { backgroundColor: primaryColor }]} />
                        <Text style={[themeTextStyle, styles.macroText]}>
                            {t('food.protein')}: {formValues.protein || proteinGoal || 0}g ({proteinPercent}%)
                        </Text>
                    </View>
                    <View style={styles.macroItem}>
                        <View style={[styles.macroColorIndicator, { backgroundColor: tertiaryColor }]} />
                        <Text style={[themeTextStyle, styles.macroText]}>
                            {t('food.carbs')}: {formValues.carbs || carbsGoal || 0}g ({carbsPercent}%)
                        </Text>
                    </View>
                    <View style={styles.macroItem}>
                        <View style={[styles.macroColorIndicator, { backgroundColor: secondaryColor }]} />
                        <Text style={[themeTextStyle, styles.macroText]}>
                            {t('food.fat')}: {formValues.fat || fatGoal || 0}g ({fatPercent}%)
                        </Text>
                    </View>
                </View>
            </View>

            {/* Macros Settings Section */}
            <View style={styles.sectionContainer}>
                <View style={styles.macrosForm}>
                    {renderMacroInput('protein', 'Protein', primaryColor, t('food.ProteinShort'))}
                    {renderMacroInput('carbs', 'Carbs', tertiaryColor, t('food.CarbsShort'))}
                    {renderMacroInput('fat', 'Fat', secondaryColor, t('food.FatShort'))}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 8,
        justifyContent: 'center',
    },
    lightContainer: {
    },
    darkContainer: {
    },
    lightThemeText: {
        color: '#242c40',
    },
    darkThemeText: {
        color: '#d0d0c0',
    },
    lightInputBg: {
        backgroundColor: '#f3f4f6',
    },
    darkInputBg: {
        backgroundColor: '#1f2937',
    },
    caloriesSummary: {
        marginBottom: 4,
        padding: 8,
    },
    caloriesValue: {
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 16,
    },
    caloriesUnit: {
        fontSize: 20,
        fontWeight: 'normal',
        opacity: 0.7,
    },
    macrosBar: {
        height: 12,
        borderRadius: 6,
        backgroundColor: '#00000010',
        overflow: 'hidden',
        marginBottom: 16,
    },
    macrosBarSegment: {
        height: '100%',
        flexDirection: 'row',
    },
    macroSegment: {
        height: '100%',
    },
    macrosSummary: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    macroItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    macroColorIndicator: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 4,
    },
    macroText: {
        fontSize: 12,
    },
    sectionContainer: {
        marginBottom: 24,
        padding: 8,
        borderRadius: 12,
    },
    macrosForm: {
        flexDirection: "row",
        marginBottom: 16,
        justifyContent: 'space-around'
    },
    macroInputContainer: {
        flex: 1,
        marginHorizontal: 5,
    },
    macroLabel: {
        fontSize: 14,
        marginBottom: 4,
        fontWeight: '500',
    },
    inputWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    lightInput: {
        height: 48,
        borderRadius: 8,
        borderWidth: 1,
        paddingHorizontal: 12,
        fontSize: 16,
        width: '100%',
        backgroundColor: '#e5e5e550',
    },
    darkInput: {
        height: 48,
        borderRadius: 8,
        borderWidth: 1,
        paddingHorizontal: 12,
        fontSize: 16,
        width: '100%',
        backgroundColor: '#00000020',
    },
    unitText: {
        position: 'absolute',
        right: 12,
        fontSize: 16,
        opacity: 0.5,
    },
});
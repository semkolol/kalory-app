import React from 'react';
import { View, Text, useColorScheme, StyleSheet, Platform } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import ProgressBar from '../components/ProgressBar';
import { SymbolView } from 'expo-symbols';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useTranslation } from '@/i18n';

type CalorieProps = {
    carbsGoal: number;
    fatGoal: number;
    proteinGoal: number;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
};

export default function CalorieOverview({
    carbsGoal,
    fatGoal,
    proteinGoal,
    calories,
    protein,
    carbs,
    fat,
}: CalorieProps) {
    const colorScheme = useColorScheme();
    const { t } = useTranslation();

    const themeTextColor = colorScheme === 'light' ? '#4b5563' : '#d1d5db';
    const progressBarBackground = colorScheme === 'light' ? '#e5e7eb' : '#212121';
    const circleBackgroundColor = colorScheme === 'dark' ? '#103F24' : '#B8E1CA';

    // calculate total goal calories
    const totalGoalCalories = (proteinGoal * 4) + (carbsGoal * 4) + (fatGoal * 9);
    const fillPercentage = totalGoalCalories > 0 ? Math.min(100, (calories / totalGoalCalories) * 100) : 0;
    const actualFillForDisplay = totalGoalCalories > 0 ? (calories / totalGoalCalories) * 100 : 0;

    const caloriesDifference = totalGoalCalories - calories;
    const isOverGoal = caloriesDifference < 0;
    const displayCaloriesValue = Math.abs(caloriesDifference);

    const circleTintColor = actualFillForDisplay < 100 ? '#2ecc71' : '#e74c3c';


    // helper to prevent NaN issues if goal is 0
    const calculateMacroPercentage = (current: number, goal: number) => {
        if (goal === 0) return 0;
        return Math.min(100, (current / goal) * 100); // cap at 100 for progress bar fill
    };

    return (
        <View style={styles.mainContainer}>
            <AnimatedCircularProgress
                size={170}
                width={20}
                fill={fillPercentage}
                lineCap="round"
                rotation={0}
                tintColor={circleTintColor}
                onAnimationComplete={() => { }}
                backgroundColor={circleBackgroundColor}
                backgroundWidth={7}
                delay={100}
            >
                {() => (
                    <>
                        <Text style={[styles.circleCaloriesValue, { color: circleTintColor }]}>
                            {Math.round(displayCaloriesValue)}
                        </Text>
                        <Text style={[styles.circleCaloriesLabel, { color: themeTextColor }]}>
                            {isOverGoal ? t('food.calorieOverGoal') : t('food.caloriesLeft')}
                        </Text>
                    </>
                )}
            </AnimatedCircularProgress>

            <View style={styles.macrosInfoContainer}>
                <View style={styles.macrosInfoContainer}>
                    <View style={styles.macroDetailItem}>
                        <View style={styles.macroLabelContainer}>
                            <>
                                {Platform.OS === 'ios' ? (
                                    <SymbolView
                                        name="figure.strengthtraining.traditional"
                                        tintColor={colorScheme === 'light' ? "#60a5fa" : "#3b82f6"} // Blue
                                        type="hierarchical"
                                        size={20}
                                    />
                                ) : (
                                    <MaterialCommunityIcons
                                        name="dumbbell"
                                        color={colorScheme === 'light' ? "#60a5fa" : "#3b82f6"} // Blue
                                        size={22}
                                    />
                                )}
                            </>
                            <Text style={[styles.macroLabel, { color: themeTextColor }]}>{t('food.protein')}</Text>
                        </View>
                        <View style={[styles.progressBarWrapper, { backgroundColor: progressBarBackground }]}>
                            <ProgressBar
                                primary={colorScheme === 'light' ? '#3b82f6' : '#60a5fa'}
                                percentage={calculateMacroPercentage(protein, proteinGoal)}
                                macro={`${Math.round(protein)}g / ${Math.round(proteinGoal)}g`}
                                height={16}
                                radius={10}
                            />
                        </View>
                    </View>

                    <View style={styles.macroDetailItem}>
                        <View style={styles.macroLabelContainer}>
                            <>
                                {Platform.OS === 'ios' ? (
                                    <SymbolView
                                        name="carrot.fill"
                                        tintColor={colorScheme === 'light' ? "#a3e635" : "#84cc16"} // Green/Lime
                                        type="hierarchical"
                                        size={20}
                                    />
                                ) : (
                                    <MaterialCommunityIcons
                                        name="carrot"
                                        color={colorScheme === 'light' ? "#a3e635" : "#84cc16"} // Green/Lime
                                        size={22}
                                    />
                                )}
                            </>
                            <Text style={[styles.macroLabel, { color: themeTextColor }]}>{t('food.carbs')}</Text>
                        </View>
                        <View style={[styles.progressBarWrapper, { backgroundColor: progressBarBackground }]}>
                            <ProgressBar
                                primary={colorScheme === 'light' ? '#84cc16' : '#a3e635'}
                                percentage={calculateMacroPercentage(carbs, carbsGoal)}
                                macro={`${Math.round(carbs)}g / ${Math.round(carbsGoal)}g`}
                                height={16}
                                radius={10}
                            />
                        </View>
                    </View>

                    <View style={styles.macroDetailItem}>
                        <View style={styles.macroLabelContainer}>
                            <>
                                {Platform.OS === 'ios' ? (
                                    <SymbolView
                                        name="drop.fill"
                                        tintColor={colorScheme === 'light' ? "#f472b6" : "#ec4899"} // Pink
                                        type="hierarchical"
                                        size={20}
                                    />
                                ) : (
                                    <MaterialCommunityIcons
                                        name="water" // Or "oil", "water-drop"
                                        color={colorScheme === 'light' ? "#f472b6" : "#ec4899"} // Pink
                                        size={22}
                                    />
                                )}
                            </>
                            <Text style={[styles.macroLabel, { color: themeTextColor }]}>{t('food.fat')}</Text>
                        </View>
                        <View style={[styles.progressBarWrapper, { backgroundColor: progressBarBackground }]}>
                            <ProgressBar
                                primary={colorScheme === 'light' ? '#ec4899' : '#f472b6'} // Consistent pink
                                percentage={calculateMacroPercentage(fat, fatGoal)}
                                macro={`${Math.round(fat)}g / ${Math.round(fatGoal)}g`}
                                height={16}
                                radius={10}
                            />
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
    },
    circleCaloriesValue: {
        fontSize: 35,
        fontWeight: '700',
        textAlign: 'center',
    },
    circleCaloriesLabel: {
        fontSize: 14,
        opacity: 0.8,
        textAlign: 'center',
        marginTop: 2,
    },
    macrosInfoContainer: {
        marginLeft: 24,
        flexDirection: 'column',
    },
    macroDetailItem: {
        flexDirection: 'column',
        marginBottom: 16,
    },
    macroLabelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    macroLabel: {
        fontWeight: '600',
        marginLeft: 8,
        fontSize: 15,
    },
    progressBarWrapper: {
        padding: 3,
        borderRadius: 12
    },
});
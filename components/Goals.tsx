import React from 'react';
import { Text, View, TouchableOpacity, useColorScheme, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useTranslation } from '../i18n';
import { useConfigStore, useGoalsStore } from '../utils/state';

// Define types
type GoalType = 'loseWeight' | 'maintain' | 'gainWeight' | null;

interface GoalOption {
    id: GoalType;
    label: string;
    icon: string;
}

type AnimatedValues = {
    [key in Exclude<GoalType, null>]: Animated.SharedValue<number>;
};

type AnimatedStyles = {
    [key in Exclude<GoalType, null>]: any;
};

export default function Goals(): React.ReactElement {
    const { t } = useTranslation();
    const colorScheme = useColorScheme();
    const { setCurrentOnboardingScreen } = useConfigStore();

    const scaleValues: AnimatedValues = {
        loseWeight: useSharedValue(1),
        maintain: useSharedValue(1),
        gainWeight: useSharedValue(1)
    };

    const themeTextStyle = colorScheme === 'light' ? styles.lightThemeText : styles.darkThemeText;

    const themeContainerStyle =
        colorScheme === 'light' ? styles.lightContainer : styles.darkContainer;

    const primaryColor = colorScheme === 'light' ? '#f48069' : '#ef5a3c';
    const bgColor = colorScheme === 'light' ? '#e5e5e5' : '#000000';

    const {
        goalType,
        setGoalType
    } = useGoalsStore();

    const handleSelectGoal = (goal: Exclude<GoalType, null>): void => {
        setGoalType(goal);

        Object.keys(scaleValues).forEach(key => {
            const goalKey = key as Exclude<GoalType, null>;
            scaleValues[goalKey].value = 1;
        });

        scaleValues[goal].value = 0.95;
        scaleValues[goal].value = withSpring(1.05, { damping: 10 });
        scaleValues[goal].value = withSpring(1, { damping: 5 });
    };

    const animatedStyles: AnimatedStyles = {
        loseWeight: useAnimatedStyle(() => ({
            transform: [{ scale: scaleValues.loseWeight.value }]
        })),
        maintain: useAnimatedStyle(() => ({
            transform: [{ scale: scaleValues.maintain.value }]
        })),
        gainWeight: useAnimatedStyle(() => ({
            transform: [{ scale: scaleValues.gainWeight.value }]
        }))
    };

    const isSelected = (goal: GoalType): boolean => goalType === goal;

    const goalOptions: GoalOption[] = [
        { id: 'loseWeight', label: t('goals.loseWeight'), icon: '↓' },
        { id: 'maintain', label: t('goals.maintain'), icon: '↔' },
        { id: 'gainWeight', label: t('goals.gainWeight'), icon: '↑' }
    ];

    function firstOnboarding() {
        setCurrentOnboardingScreen(1)
    }

    return (
        <View style={[themeContainerStyle, styles.container]}>
            <Text style={[themeTextStyle, styles.heading, { opacity: 0.7 }]}>{t('goals.selectYourGoal')}</Text>

            <View style={styles.goalsContainer}>
                {goalOptions.map((goal) => (
                    <Animated.View
                        key={goal.id as string}
                        style={[
                            goal.id ? animatedStyles[goal.id] : {},
                            { width: '30%' }
                        ]}
                    >
                        <TouchableOpacity
                            style={[
                                styles.goalItem,
                                { backgroundColor: bgColor },
                                isSelected(goal.id) && {
                                    borderColor: primaryColor,
                                    borderWidth: 2,
                                    shadowColor: primaryColor,
                                    shadowOpacity: 0.5,
                                    shadowRadius: 10,
                                    elevation: 6,
                                }
                            ]}
                            onPress={() => goal.id && handleSelectGoal(goal.id)}
                            activeOpacity={0.7}
                        >
                            <Text style={[styles.goalIcon, { color: primaryColor }]}>
                                {goal.icon}
                            </Text>
                            <Text
                                style={[
                                    themeTextStyle,
                                    styles.goalText,
                                    isSelected(goal.id) && { fontWeight: '700', color: primaryColor }
                                ]}
                            >
                                {goal.label}
                            </Text>
                        </TouchableOpacity>
                    </Animated.View>
                ))}
            </View>
            <TouchableOpacity
                style={{
                    backgroundColor: colorScheme === 'light' ? '#f48069' : '#ef5a3c',
                    padding: 10,
                    borderRadius: 10,
                    width: 300,
                    alignItems: 'center',
                }}
                onPress={firstOnboarding}
                accessibilityLabel={t('common.continueToNextPage')}
                accessibilityRole="button"
            >
                <Text style={{ color: 'white', fontSize: 14, fontWeight: '600' }}>
                    {t('common.continue')}
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
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
        backgroundColor: '#f3f4f6',
    },
    darkInputBg: {
        backgroundColor: '#1f2937',
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
});
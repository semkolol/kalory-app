import React from 'react';
import { Text, View, TouchableOpacity, useColorScheme, StyleSheet } from 'react-native';
import { useGoalsStore } from '../utils/state';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useTranslation } from '../i18n';

type ActivityType = 'low' | 'medium' | 'high' | null;

interface ActivityOption {
    id: ActivityType;
    label: string;
    icon: string;
}

type AnimatedValues = {
    [key in Exclude<ActivityType, null>]: Animated.SharedValue<number>;
};

type AnimatedStyles = {
    [key in Exclude<ActivityType, null>]: any; // ReturnType<typeof useAnimatedStyle>
};

export default function ActivitySelector(): React.ReactElement {
    const colorScheme = useColorScheme();
    const { t } = useTranslation();

    const scaleValues: AnimatedValues = {
        high: useSharedValue(1),
        medium: useSharedValue(1),
        low: useSharedValue(1)
    };

    const themeTextStyle = colorScheme === 'light' ? styles.lightThemeText : styles.darkThemeText;

    const themeContainerStyle =
        colorScheme === 'light' ? styles.lightContainer : styles.darkContainer;

    const primaryColor = colorScheme === 'light' ? '#f48069' : '#ef5a3c';
    const bgColor = colorScheme === 'light' ? '#e5e5e5' : '#000000';

    const {
        activityLevel,
        setActivityLevel
    } = useGoalsStore();

    const handleSelectGoal = (goal: Exclude<ActivityType, null>): void => {
        setActivityLevel(goal);
        Object.keys(scaleValues).forEach(key => {
            const goalKey = key as Exclude<ActivityType, null>;
            scaleValues[goalKey].value = 1;
        });

        scaleValues[goal].value = 0.95;
        scaleValues[goal].value = withSpring(1.05, { damping: 10 });
        scaleValues[goal].value = withSpring(1, { damping: 5 });

    };

    const animatedStyles: AnimatedStyles = {
        high: useAnimatedStyle(() => ({
            transform: [{ scale: scaleValues.high.value }]
        })),
        medium: useAnimatedStyle(() => ({
            transform: [{ scale: scaleValues.medium.value }]
        })),
        low: useAnimatedStyle(() => ({
            transform: [{ scale: scaleValues.low.value }]
        }))
    };

    const isSelected = (goal: ActivityType): boolean => activityLevel === goal;

    const ActivityOptions: ActivityOption[] = [
        { id: 'low', label: t('common.low'), icon: '🚶' },
        { id: 'medium', label: t('common.medium'), icon: '🏃' },
        { id: 'high', label: t('common.high'), icon: '🏋️' },
    ];

    //   const ActivityOptions: ActivityOption[] = [
    //     { id: 'low', label: 'Low', icon: '•' },
    //     { id: 'medium', label: 'Medium', icon: '••' },
    //     { id: 'high', label: 'High', icon: '•••' },
    //   ];

    // const ActivityOptions: ActivityOption[] = [
    //     { id: 'low', label: 'Low', icon: 'Walking' },
    //     { id: 'medium', label: 'Medium', icon: 'Running' },
    //     { id: 'high', label: 'High', icon: 'Gym' },
    //   ];

    return (
        <View style={[themeContainerStyle, styles.container]}>
            <Text style={[themeTextStyle, styles.heading, { opacity: 0.7 }]}>
                {t('common.activityLevel')}
            </Text>
            <View style={styles.goalsContainer}>
                {ActivityOptions.map((goal) => (
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
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
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
    lightThemeText: {
        color: '#242c40'
    },
    darkThemeText: {
        color: '#d0d0c0'
    },
    heading: {
        fontSize: 18,
        fontWeight: '600',
        marginVertical: 6,
        textAlign: 'center'
    },
    goalsContainer: {
        flexDirection: 'row',
        width: '100%',
        marginBottom: 24
    },
    goalItem: {
        borderRadius: 12,
        padding: 8,
        alignItems: 'center',
        justifyContent: 'center',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        marginHorizontal: 5
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
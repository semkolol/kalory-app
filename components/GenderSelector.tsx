import React from 'react';
import { Text, View, TouchableOpacity, useColorScheme, StyleSheet } from 'react-native';
import { useGoalsStore } from '../utils/state';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useTranslation } from '../i18n';

type GenderType = 'male' | 'female' | null

interface GenderOption {
    id: GenderType;
    label: string;
    icon: string;
}

type AnimatedValues = {
    [key in Exclude<GenderType, null>]: Animated.SharedValue<number>;
};

type AnimatedStyles = {
    [key in Exclude<GenderType, null>]: any;
};

export default function Goals(): React.ReactElement {
    const colorScheme = useColorScheme();
    const { t } = useTranslation();

    const scaleValues: AnimatedValues = {
        male: useSharedValue(1),
        female: useSharedValue(1)
    };

    const themeTextStyle = colorScheme === 'light' ? styles.lightThemeText : styles.darkThemeText;

    const themeContainerStyle =
        colorScheme === 'light' ? styles.lightContainer : styles.darkContainer;

    const primaryColor = colorScheme === 'light' ? '#f48069' : '#ef5a3c';
    const bgColor = colorScheme === 'light' ? '#e5e5e5' : '#000000';

    const {
        gender,
        setGender
    } = useGoalsStore();

    const handleSelectGoal = (goal: Exclude<GenderType, null>): void => {
        setGender(goal);
        Object.keys(scaleValues).forEach(key => {
            const goalKey = key as Exclude<GenderType, null>;
            scaleValues[goalKey].value = 1;
        });

        scaleValues[goal].value = 0.95;
        scaleValues[goal].value = withSpring(1.05, { damping: 10 });
        scaleValues[goal].value = withSpring(1, { damping: 5 });

    };

    const animatedStyles: AnimatedStyles = {
        male: useAnimatedStyle(() => ({
            transform: [{ scale: scaleValues.male.value }]
        })),
        female: useAnimatedStyle(() => ({
            transform: [{ scale: scaleValues.female.value }]
        }))
    };

    const isSelected = (goal: GenderType): boolean => gender === goal;

    const genderOptions: GenderOption[] = [
        { id: 'male', label: t('common.male'), icon: '♂' },
        { id: 'female', label: t('common.female'), icon: '♀' },
    ];

    return (
        <View style={[themeContainerStyle, styles.container]}>
            <View style={styles.goalsContainer}>
                {genderOptions.map((goal) => (
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
    }
});
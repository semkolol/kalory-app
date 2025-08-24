import React from 'react';
import { Text, View, TouchableOpacity, useColorScheme, StyleSheet, Image } from 'react-native';
import { useGoalsStore } from '../utils/state';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { SvgProps, SvgXml } from 'react-native-svg';
import Fat from './icons/Fat';
import Skinny from './icons/Skinny';
import NeutralBody from './icons/NeutralBody';
import { useTranslation } from '../i18n';



type BodyType = 'skinny' | 'neutral' | 'fat' | null;

interface BodyOption {
    id: BodyType;
    label: string;
    Icon: React.ComponentType<SvgProps>;
}

type AnimatedValues = {
    [key in Exclude<BodyType, null>]: Animated.SharedValue<number>;
};

type AnimatedStyles = {
    [key in Exclude<BodyType, null>]: any;
};

export default function BodyTypeSelector(): React.ReactElement {
    const colorScheme = useColorScheme();
    const { t } = useTranslation();

    const scaleValues: AnimatedValues = {
        fat: useSharedValue(1),
        neutral: useSharedValue(1),
        skinny: useSharedValue(1)
    };

    const themeTextStyle = colorScheme === 'light' ? styles.lightThemeText : styles.darkThemeText;

    const themeContainerStyle =
        colorScheme === 'light' ? styles.lightContainer : styles.darkContainer;

    const primaryColor = colorScheme === 'light' ? '#f48069' : '#ef5a3c';
    const bgColor = colorScheme === 'light' ? '#e5e5e5' : '#000000';

    const {
        bodyType,
        setBodyType
    } = useGoalsStore();

    const handleSelectGoal = (goal: Exclude<BodyType, null>): void => {
        setBodyType(goal);
        Object.keys(scaleValues).forEach(key => {
            const goalKey = key as Exclude<BodyType, null>;
            scaleValues[goalKey].value = 1;
        });

        scaleValues[goal].value = 0.95;
        scaleValues[goal].value = withSpring(1.05, { damping: 10 });
        scaleValues[goal].value = withSpring(1, { damping: 5 });
    };

    const animatedStyles: AnimatedStyles = {
        fat: useAnimatedStyle(() => ({
            transform: [{ scale: scaleValues.fat.value }]
        })),
        neutral: useAnimatedStyle(() => ({
            transform: [{ scale: scaleValues.neutral.value }]
        })),
        skinny: useAnimatedStyle(() => ({
            transform: [{ scale: scaleValues.skinny.value }]
        }))
    };

    const isSelected = (goal: BodyType): boolean => bodyType === goal;

    const BodyOption: BodyOption[] = [
        { id: 'skinny', label: t('common.skinny'), Icon: Skinny },
        { id: 'neutral', label: t('common.neutral'), Icon: NeutralBody },
        { id: 'fat', label: t('common.overweight'), Icon: Fat }
    ];

    //   const BodyOption: BodyOption[] = [
    //     { id: 'low', label: 'Low', icon: '•' },
    //     { id: 'medium', label: 'Medium', icon: '••' },
    //     { id: 'high', label: 'High', icon: '•••' },
    //   ];

    // const BodyOption: BodyOption[] = [
    //     { id: 'low', label: 'Low', icon: 'Walking' },
    //     { id: 'medium', label: 'Medium', icon: 'Running' },
    //     { id: 'high', label: 'High', icon: 'Gym' },
    //   ];

    return (
        <View style={[themeContainerStyle, styles.container]}>
            <Text style={[themeTextStyle, styles.heading, { opacity: 0.7 }]}>
                {t('common.bodyType')}
            </Text>
            <View style={styles.goalsContainer}>
                {BodyOption.map((goal) => (
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
                            <goal.Icon style={{ transform: [{ scale: 0.5 }] }} />
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
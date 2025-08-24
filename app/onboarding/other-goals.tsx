import React, { useEffect, useMemo } from 'react';
import { Text, View, StyleSheet, useColorScheme, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { useConfigStore, useGoalsStore } from '../../utils/state';
import WeightGoal from '../../components/WeightGoal';
import OtherGoals from '../../components/OtherGoals';
import { useTranslation } from '../../i18n';

export default function OtherGoalsInputScreen() {
    const { currentOnboardingScreen, setCurrentOnboardingScreen } = useConfigStore();

    const {
        gender, age, height, weightCurrent, weightGoal,
        goalType, activityLevel, bodyType, calculateAndSetMacros
    } = useGoalsStore();

    const { t } = useTranslation();
    const colorScheme = useColorScheme();

    const canContinue = useMemo(() => {
        const isNumberValid = (value: number | null) => value !== null && value > 0;

        return (
            gender !== null &&
            isNumberValid(age) &&
            isNumberValid(height) &&
            isNumberValid(weightCurrent) &&
            isNumberValid(weightGoal) &&
            goalType !== null &&
            activityLevel !== null &&
            bodyType !== null
        );
    }, [gender, age, height, weightCurrent, weightGoal, goalType, activityLevel, bodyType]);

    const handlePrevious = () => {
        setCurrentOnboardingScreen(currentOnboardingScreen - 1);
    };

    const handleNext = () => {
        if (!canContinue) return;

        calculateAndSetMacros();

        setCurrentOnboardingScreen(currentOnboardingScreen + 1);
    };

    const themeTextStyle = colorScheme === 'light' ? styles.lightThemeText : styles.darkThemeText;
    const themeContainerStyle = colorScheme === 'light' ? styles.lightContainer : styles.darkContainer;

    const opacity = useSharedValue(0);
    const scale = useSharedValue(0.9);
    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [{ scale: scale.value }],
    }));

    const imageOpacity = useSharedValue(0);
    const imageScale = useSharedValue(0.8);
    const imageRotation = useSharedValue(0.5);
    const animatedImage = useAnimatedStyle(() => ({
        opacity: imageOpacity.value,
        transform: [{ scale: imageScale.value }, { rotate: `${imageRotation.value}deg` }],
    }));

    function imageAnimation() {
        imageOpacity.value = withDelay(500, withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) }));
        imageScale.value = withDelay(500, withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) }), (finished) => {
            if (finished) {
                imageScale.value = withRepeat(withSequence(withTiming(1.1, { duration: 2000, easing: Easing.inOut(Easing.cubic) }), withTiming(0.95, { duration: 2000, easing: Easing.inOut(Easing.cubic) })), -1, true);
                imageRotation.value = withRepeat(withSequence(withTiming(5, { duration: 2400, easing: Easing.inOut(Easing.cubic) }), withTiming(-5, { duration: 2400, easing: Easing.inOut(Easing.cubic) })), -1, true);
            }
        });
    }

    const imageTwoOpacity = useSharedValue(0);
    const imageTwoScale = useSharedValue(0.9);
    const imageTwoRotation = useSharedValue(0);
    const animatedImageTwo = useAnimatedStyle(() => ({
        opacity: imageTwoOpacity.value,
        transform: [{ scale: imageTwoScale.value }, { rotate: `${imageTwoRotation.value}deg` }],
    }));

    function imageTwoAnimation() {
        imageTwoOpacity.value = withDelay(500, withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) }));
        imageScale.value = withDelay(500, withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) }), (finished) => {
            if (finished) {
                imageTwoScale.value = withRepeat(withSequence(withTiming(0.85, { duration: 2000, easing: Easing.inOut(Easing.cubic) }), withTiming(1.05, { duration: 2000, easing: Easing.inOut(Easing.cubic) })), -1, true);
                imageTwoRotation.value = withRepeat(withSequence(withTiming(-3, { duration: 2400, easing: Easing.inOut(Easing.cubic) }), withTiming(3, { duration: 2400, easing: Easing.inOut(Easing.cubic) })), -1, true);
            }
        });
    }

    useEffect(() => {
        opacity.value = withDelay(300, withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) }));
        scale.value = withDelay(300, withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) }));
        imageAnimation();
        imageTwoAnimation();
    }, []);

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <Animated.View style={[styles.baseContainer, themeContainerStyle, animatedStyle]}>
                <Animated.View style={[animatedImage, styles.emoji, styles.emojiOne]}>
                    <Text style={styles.emojiText}>📆</Text>
                </Animated.View>

                <Animated.View style={[animatedImageTwo, styles.emoji, styles.emojiTwo]}>
                    <Text style={styles.emojiText}>🏆</Text>
                </Animated.View>

                <Text style={[themeTextStyle, styles.heading]}>{t('onboarding.setGoalsTitle')}</Text>

                <WeightGoal />
                <OtherGoals />

                <TouchableOpacity
                    style={[styles.button, !canContinue && styles.buttonDisabled, { backgroundColor: colorScheme === 'light' ? '#f48069' : '#ef5a3c' }]}
                    onPress={handleNext}
                    accessibilityLabel={t('common.continue')}
                    accessibilityRole="button"
                    disabled={!canContinue}
                >
                    <Text style={styles.buttonText}>{t('common.continue')}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.backButton}
                    onPress={handlePrevious}
                    accessibilityLabel={t('common.goBack')}
                    accessibilityRole="link"
                >
                    <Text style={[themeTextStyle, styles.backButtonText]}>{t('common.goBack')}</Text>
                </TouchableOpacity>
            </Animated.View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    baseContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
    },
    lightContainer: { backgroundColor: '#ffffff' },
    darkContainer: { backgroundColor: '#141414' },
    lightThemeText: { color: '#242c40' },
    darkThemeText: { color: '#d0d0c0' },
    heading: {
        fontSize: 22,
        fontWeight: '600',
        marginBottom: 24,
        textAlign: 'center',
        opacity: 0.8,
    },
    emoji: {
        position: "absolute",
    },
    emojiOne: {
        top: '12%',
        left: '10%',
    },
    emojiTwo: {
        top: '18%',
        right: '8%',
    },
    emojiText: {
        fontSize: 64,
    },
    button: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
        width: 300,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonDisabled: {
        opacity: 0.5,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    backButton: {
        marginTop: 15,
        padding: 5,
    },
    backButtonText: {
        fontSize: 14,
        textDecorationLine: 'underline',
    }
});
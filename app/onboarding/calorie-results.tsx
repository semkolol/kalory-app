import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, useColorScheme, TouchableOpacity, TouchableWithoutFeedback, Keyboard, Linking, Platform } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { useConfigStore } from '../../utils/state';
import CalorieCalc from '../../components/CalorieCalc';
import LoadingCals from '../../components/LoadingCals';
import { SymbolView } from 'expo-symbols';
import { useTranslation } from '../../i18n';

export default function CalorieResultsScreen() {
    const { currentOnboardingScreen, setCurrentOnboardingScreen, setCompletedOnboarding } = useConfigStore();
    const { t } = useTranslation();
    const colorScheme = useColorScheme();
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const themeTextStyle = colorScheme === 'light' ? styles.lightThemeText : styles.darkThemeText;
    const themeContainerStyle =
        colorScheme === 'light' ? styles.lightContainer : styles.darkContainer;

    const opacity = useSharedValue(0);
    const scale = useSharedValue(0.9);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [{ scale: scale.value }],
    }));

    const imageOpacity = useSharedValue(0);
    const imageScale = useSharedValue(0.8);
    const imageRotation = useSharedValue(.5);
    const animatedImage = useAnimatedStyle(() => ({
        opacity: imageOpacity.value,
        transform: [
            { scale: imageScale.value },
            { rotate: `${imageRotation.value}deg` }
        ],
    }));
    function imageAnimation() {
        imageOpacity.value = withDelay(
            500,
            withTiming(1, {
                duration: 600,
                easing: Easing.out(Easing.cubic),
            })
        );
        imageScale.value = withDelay(
            500,
            withTiming(1, {
                duration: 600,
                easing: Easing.out(Easing.cubic),
            }, (finished) => {
                if (finished) {
                    imageScale.value = withRepeat(
                        withSequence(
                            withTiming(1.1, { duration: 2000, easing: Easing.inOut(Easing.cubic) }),
                            withTiming(0.95, { duration: 2000, easing: Easing.inOut(Easing.cubic) })
                        ),
                        -1, // -1 means infinite repeats
                        true // reverse the animation sequence
                    );

                    imageRotation.value = withRepeat(
                        withSequence(
                            withTiming(5, { duration: 2400, easing: Easing.inOut(Easing.cubic) }),
                            withTiming(-5, { duration: 2400, easing: Easing.inOut(Easing.cubic) })
                        ),
                        -1,
                        true
                    );
                }
            })
        );
    }

    const imageTwoOpacity = useSharedValue(0);
    const imageTwoScale = useSharedValue(0.9);
    const imageTwoRotation = useSharedValue(0);
    const animatedImageTwo = useAnimatedStyle(() => ({
        opacity: imageTwoOpacity.value,
        transform: [
            { scale: imageTwoScale.value },
            { rotate: `${imageTwoRotation.value}deg` }
        ],
    }));
    function imageTwoAnimation() {
        imageTwoOpacity.value = withDelay(
            500,
            withTiming(1, {
                duration: 600,
                easing: Easing.out(Easing.cubic),
            })
        );
        imageTwoScale.value = withDelay(
            500,
            withTiming(1, {
                duration: 600,
                easing: Easing.out(Easing.cubic),
            }, (finished) => {
                if (finished) {
                    imageTwoScale.value = withRepeat(
                        withSequence(
                            withTiming(0.85, { duration: 2000, easing: Easing.inOut(Easing.cubic) }),
                            withTiming(1.05, { duration: 2000, easing: Easing.inOut(Easing.cubic) })
                        ),
                        -1, // -1 means infinite repeats
                        true // reverse the animation sequence
                    );

                    imageTwoRotation.value = withRepeat(
                        withSequence(
                            withTiming(-3, { duration: 2400, easing: Easing.inOut(Easing.cubic) }),
                            withTiming(3, { duration: 2400, easing: Easing.inOut(Easing.cubic) })
                        ),
                        -1,
                        true
                    );
                }
            })
        );
    }

    useEffect(() => {
        opacity.value = withDelay(
            300,
            withTiming(1, {
                duration: 600,
                easing: Easing.out(Easing.cubic),
            })
        );
        scale.value = withDelay(
            300,
            withTiming(1, {
                duration: 600,
                easing: Easing.out(Easing.cubic),
            })
        );
        imageAnimation()
        imageTwoAnimation()

        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 5000); // 5 seconds

        return () => clearTimeout(timer);
    }, []);

    const openCitation = () => {
        Linking.openURL('https://www.google.com/search?client=safari&rls=en&q=Mifflin-St+Jeor+Equation&ie=UTF-8&oe=UTF-8');
    }

    function prevOnboarding() {
        setCurrentOnboardingScreen(currentOnboardingScreen - 1)
    }

    function nextOnboarding() {
        setCompletedOnboarding(true)
    }
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <Animated.View style={[styles.baseContainer, themeContainerStyle, animatedStyle]}>


                {isLoading ?
                    <LoadingCals />
                    :
                    <>
                        <Animated.View
                            style={[animatedImage, styles.emoji, styles.emojiOne]}>
                            <Text style={styles.emojiText}>
                                🍕
                            </Text>
                        </Animated.View>

                        <Animated.View
                            style={[animatedImageTwo, styles.emoji, styles.emojiTwo]}>
                            <Text style={styles.emojiText}>
                                🍎
                            </Text>
                        </Animated.View>

                        <Text style={[themeTextStyle, styles.heading]}>{t('onboarding.yourDailyCalories')}</Text>
                        <Text style={[themeTextStyle, styles.subheading]}>{t('onboarding.adjustPreference')}</Text>
                        <CalorieCalc />

                        <TouchableOpacity onPress={openCitation}
                            style={styles.citationButton}
                        >
                            <Text style={[styles.citationText, { color: colorScheme === "light" ? "#000000" : "#ffffff" }]}>
                                {t('onboarding.basedOnMifflin')}
                            </Text>
                            {Platform.OS === 'ios' ? (
                                <SymbolView
                                    name="info.circle"
                                    tintColor={colorScheme === "light" ? "#000000" : "#ffffff"}
                                    type="hierarchical"
                                    size={18}
                                />
                            ) : (
                                <Text>ℹ️</Text>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.button, { backgroundColor: colorScheme === 'light' ? '#f48069' : '#ef5a3c' }]}
                            onPress={nextOnboarding}
                            accessibilityLabel={t('common.continue')}
                            accessibilityRole="button"
                        >
                            <Text style={styles.buttonText}>
                                {t('common.continue')}
                            </Text>
                        </TouchableOpacity>

                        {/* Secondary CTA */}
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={prevOnboarding}
                            accessibilityLabel={t('common.goBack')}
                            accessibilityRole="link"
                        >
                            <Text style={[themeTextStyle, styles.backButtonText]}>
                                {t('common.goBack')}
                            </Text>
                        </TouchableOpacity>
                    </>
                }

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
        marginBottom: 8,
        textAlign: 'center',
        opacity: 0.8,
    },
    subheading: {
        fontSize: 16,
        marginBottom: 24,
        textAlign: 'center',
        opacity: 0.7,
    },
    emoji: {
        position: "absolute",
    },
    emojiOne: {
        top: '15%',
        right: '10%',
    },
    emojiTwo: {
        top: '12%',
        left: '10%',
    },
    emojiText: {
        fontSize: 64,
    },
    citationButton: {
        flexDirection: "row",
        alignItems: 'center',
        padding: 8,
        marginVertical: 8,
    },
    citationText: {
        marginRight: 4,
        fontSize: 14,
    },
    button: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
        width: 300,
        alignItems: 'center',
        marginTop: 10,
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
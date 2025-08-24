import React, { useEffect } from 'react';
import { Text, View, StyleSheet, useColorScheme, TouchableOpacity } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { useConfigStore, useGoalsStore } from '../../utils/state';
import GenderSelector from '../../components/GenderSelector';
import ActivitySelector from '../../components/ActivitySelector';
import FatTypeSelector from '../../components/BodyTypeSelector';
import { useTranslation } from '../../i18n';

export default function BodyActivityScreen() {
    const { currentOnboardingScreen, setCurrentOnboardingScreen } = useConfigStore();
    const { gender, bodyType, activityLevel } = useGoalsStore();
    const colorScheme = useColorScheme();

    const { t } = useTranslation();

    const themeTextStyle = colorScheme === 'light' ? styles.lightThemeText : styles.darkThemeText;
    const themeContainerStyle =
        colorScheme === 'light' ? styles.lightContainer : styles.darkContainer;

    const canNavigateNextPage: boolean =
        gender !== null &&
        typeof gender === 'string' && gender.length > 0 &&
        typeof bodyType === 'string' && bodyType.length > 0 &&
        typeof activityLevel === 'string' && activityLevel.length > 0

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
    }, []);

    function prevOnboarding() {
        setCurrentOnboardingScreen(currentOnboardingScreen - 1)
    }

    function nextOnboarding() {
        setCurrentOnboardingScreen(currentOnboardingScreen + 1);
    }

    return (
        <Animated.View style={[styles.baseContainer, themeContainerStyle, animatedStyle]}>
            <Animated.View style={[animatedImage, styles.emoji, styles.emojiOne]}>
                <Text style={styles.emojiText}>🏋️</Text>
            </Animated.View>

            <Animated.View style={[animatedImageTwo, styles.emoji, styles.emojiTwo]}>
                <Text style={styles.emojiText}>🏃</Text>
            </Animated.View>

            <Text style={[themeTextStyle, styles.heading]}>{t('onboarding.calculateCaloriesTitle')}</Text>
            <GenderSelector />
            <FatTypeSelector />
            <ActivitySelector />

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

        </Animated.View>
    );
}

const styles = StyleSheet.create({
    baseContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
    },
    lightContainer: {
        backgroundColor: '#ffffff'
    },
    darkContainer: {
        backgroundColor: '#141414'
    },
    lightThemeText: {
        color: '#242c40',
    },
    darkThemeText: {
        color: '#d0d0c0',
    },
    heading: {
        fontSize: 22,
        fontWeight: '600',
        marginBottom: 32,
        textAlign: 'center',
        opacity: 0.8,
    },
    emoji: {
        position: "absolute",
    },
    emojiOne: {
        top: '15%',
        left: '10%',
    },
    emojiTwo: {
        top: '12%',
        right: '10%',
    },
    emojiText: {
        fontSize: 75,
    },
    button: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
        width: 300,
        alignItems: 'center',
        marginTop: 20,
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


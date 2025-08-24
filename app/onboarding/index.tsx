import React, { useEffect } from 'react';
import { View, StyleSheet, useColorScheme, Platform, UIManager, Text } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { useConfigStore } from '../../utils/state';
import BodyActivityScreen from './body-activity';
import CalorieResultsScreen from './calorie-results';
import WaveText from '../../components/WaveText';
import Goals from '../../components/Goals';
import OtherGoalsInputScreen from './other-goals';
import { useTranslation } from '../../i18n';

export default function OnboardingStart() {
    const { currentOnboardingScreen } = useConfigStore();
    const { t } = useTranslation();
    const colorScheme = useColorScheme();

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

    const titleOpacity = useSharedValue(0);
    const titleScale = useSharedValue(0.8);
    const animatedTitle = useAnimatedStyle(() => ({
        opacity: titleOpacity.value,
        transform: [{ scale: titleScale.value }],
    }));

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
        titleScale.value = withDelay(
            500,
            withTiming(1, {
                duration: 600,
                easing: Easing.out(Easing.cubic),
            })
        );
        titleOpacity.value = withDelay(
            500,
            withTiming(1, {
                duration: 600,
                easing: Easing.out(Easing.cubic),
            })
        );
    }, []);

    if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    return (
        <View style={[themeContainerStyle]}>
            {currentOnboardingScreen == 0 ?
                <Animated.View style={[themeContainerStyle, animatedStyle]}>
                    <Animated.View style={[animatedImage, styles.emoji, styles.emojiOne]}>
                        <Text style={styles.emojiText}>👋</Text>
                    </Animated.View>

                    <Animated.View style={[animatedImageTwo, styles.emoji, styles.emojiTwo]}>
                        <Text style={styles.emojiText}>💪</Text>
                    </Animated.View>
                    <WaveText text={t('onboarding.welcome')} style={[themeTextStyle, { fontSize: 30, fontWeight: 600 }]} />

                    <Goals />

                </Animated.View>
                : currentOnboardingScreen == 1 ?
                    <BodyActivityScreen />
                    : currentOnboardingScreen == 2 ?
                        <OtherGoalsInputScreen />
                        :
                        <CalorieResultsScreen />
            }
        </View >
    );
}

const styles = StyleSheet.create({
    lightContainer: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff'
    },
    darkContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#141414'
    },
    lightThemeText: {
        color: '#242c40'
    },
    darkThemeText: {
        color: '#d0d0c0'
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
});

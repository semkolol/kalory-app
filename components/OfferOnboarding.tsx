import React, { useEffect } from 'react';
import { Text, View, useColorScheme, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useConfigStore } from '../utils/state';

type IoniconsName = keyof typeof Ionicons.glyphMap;

interface Feature {
    name: string;
    icon: IoniconsName;
    free: boolean;
    pro: boolean;
}

type ThemeTextStyle = {
    color: string;
};

type ThemeContainerStyle = {
    flexDirection: 'column';
    alignItems: 'center';
    justifyContent: 'center';
};

export default function OfferOnboarding(): React.ReactElement {
    const colorScheme = useColorScheme();
    const { setCurrentOnboardingScreen } = useConfigStore();

    const themeTextStyle: ThemeTextStyle = colorScheme === 'light' ? styles.lightThemeText : styles.darkThemeText;
    const themeContainerStyle: ThemeContainerStyle = colorScheme === 'light' ? styles.lightContainer : styles.darkContainer;

    const opacity = useSharedValue<number>(0);
    const scale = useSharedValue<number>(0.9);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [{ scale: scale.value }],
    }));

    useEffect(() => {
        opacity.value = withSpring(1);
        scale.value = withSpring(1);
    }, [opacity, scale]);

    const features: Feature[] = [
        { name: "Basic Calorie Tracking", free: true, pro: true, icon: "list-circle-outline" },
        { name: "AI Scanner with Photo & Text", free: false, pro: true, icon: "camera" },
        { name: "No Display Ads", free: false, pro: true, icon: "close-circle" },
    ];
    const orangeColor = "#FFA500";
    return (
        <View style={[styles.container, themeContainerStyle]}>
            <Animated.View style={[animatedStyle, { width: '100%', alignItems: 'center' }]}>
                {/* Headline */}
                <Text style={[themeTextStyle, styles.heading]}>Unlock Effortless Calorie Tracking</Text>
                {/* Subtitle */}
                <Text style={[themeTextStyle, { fontSize: 16, textAlign: 'center', marginBottom: 10 }]}>
                    Get 25% Off Your First Subscription!
                </Text>
                <Text style={[themeTextStyle, { fontSize: 16, textAlign: 'center', marginBottom: 40 }]}>
                    Track your calories by describing or taking a photo
                </Text>

                {/* Header Row */}
                <View style={{ flexDirection: "row", marginBottom: 10 }}>
                    <View style={{ flex: 3 }} />
                    <View style={{ flex: 1, alignItems: "center" }}>
                        <View style={{ borderRadius: 5, padding: 5 }}>
                            <Text style={themeTextStyle}>FREE</Text>
                        </View>
                    </View>
                    <View style={{ flex: 1, alignItems: "center" }}>
                        <View
                            style={{
                                backgroundColor: colorScheme === 'light' ? '#f48069' : '#ef5a3c',
                                borderRadius: 5,
                                padding: 5,
                            }}
                        >
                            <Text style={{ color: "white" }}>PRO</Text>
                        </View>
                    </View>
                </View>

                {/* Feature Rows */}
                {features.map((feature, index) => (
                    <View
                        key={index}
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginVertical: 10,
                        }}
                    >
                        <View style={{ flex: 3, flexDirection: "row", alignItems: "center", padding: 5 }}>
                            <Ionicons
                                name={feature.icon}
                                size={30}
                                color={themeTextStyle.color}
                                style={{ marginRight: 10 }}
                            />
                            <Text style={themeTextStyle}>{feature.name}</Text>
                        </View>
                        <View style={{ flex: 1, alignItems: "center" }}>
                            {feature.free ? (
                                <Ionicons
                                    name="checkmark"
                                    size={24}
                                    color={themeTextStyle.color}
                                />
                            ) : (
                                <Text style={{ color: themeTextStyle.color }}>-</Text>
                            )}
                        </View>
                        <View style={{ flex: 1, alignItems: "center" }}>
                            {feature.pro ? (
                                <Ionicons
                                    name="checkmark"
                                    size={24}
                                    color={colorScheme === 'light' ? '#f48069' : '#ef5a3c'}
                                />
                            ) : (
                                <Text style={{ color: colorScheme === 'light' ? '#f48069' : '#ef5a3c' }}>-</Text>
                            )}
                        </View>
                    </View>
                ))}
            </Animated.View>
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
    lightThemeText: {
        color: '#242c40',
    },
    darkThemeText: {
        color: '#d0d0c0',
    },
    heading: {
        fontSize: 24,
        fontWeight: '600',
        marginBottom: 16,
        textAlign: 'center',
    },
});
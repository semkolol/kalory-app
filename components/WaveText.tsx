import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withDelay,
    withRepeat,
    Easing
} from 'react-native-reanimated';

interface Props {
    text: string,
    style: any
}

const WaveText = ({ text, style }: Props) => {
    const charValues = text.split('').map(() => useSharedValue(0));

    useEffect(() => {
        text.split('').forEach((_, index) => {
            charValues[index].value = withDelay(
                index * 120,
                withRepeat(
                    withTiming(1, {
                        duration: 800,
                        easing: Easing.inOut(Easing.cubic)
                    }, () => {
                        charValues[index].value = withTiming(0, {
                            duration: 800,
                            easing: Easing.inOut(Easing.cubic)
                        });
                    }),
                    -1,
                    false
                )
            );
        });
    }, []);

    return (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {text.split('').map((char, index) => {
                const animatedStyle = useAnimatedStyle(() => ({
                    transform: [
                        { translateY: -10 * charValues[index].value },
                        { scale: 1 + 0.2 * charValues[index].value },
                    ],
                    opacity: 0.5 + 0.5 * charValues[index].value,
                }));

                return (
                    <Animated.Text
                        key={index}
                        style={[style, animatedStyle]}
                    >
                        {char}
                    </Animated.Text>
                );
            })}
        </View>
    );
};

export default WaveText;
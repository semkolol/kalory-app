import React from 'react';
import { Text, View, StyleSheet, ActivityIndicator, useColorScheme } from 'react-native';
import { useTranslation } from '../i18n';

const LoadingCals = () => {
    const { t } = useTranslation();
    const colorScheme = useColorScheme();
    const textColor = colorScheme === 'light' ? '#242c40' : '#d0d0c0';
    const spinnerColor = colorScheme === 'light' ? '#f48069' : '#ef5a3c';

    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color={spinnerColor} />
            <Text style={[styles.text, { color: textColor }]}>{t('onboarding.calculatingCalories')}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 300,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 20,
    },
    text: {
        fontSize: 18,
        marginTop: 16,
        fontWeight: '500',
    }
});

export default LoadingCals;
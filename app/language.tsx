import React from 'react';
import { StyleSheet, Pressable, useColorScheme, SafeAreaView, Platform } from 'react-native';
import { useConfigStore, Language } from '@/utils/state';
import { SymbolView } from 'expo-symbols';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { View, Text } from '@/components/Themed';

const languages = {
    en: "English",
    de: "Deutsch",
    fr: "Français",
    it: "Italiano",
    jp: "日本語",
    zh: "中文"
};

export default function LanguageSettings() {
    const { language, setLanguage } = useConfigStore();
    const colorScheme = useColorScheme();
    const isDarkMode = colorScheme === 'dark';

    // 3. Icon mapping
    const iconMap = {
        'checkmark': 'check' as const,
    };

    const handleLanguageChange = (code: Language) => {
        setLanguage(code);
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDarkMode ? '#000000' : '#F2F2F7' }]}>
            <View style={styles.content}>
                <View style={styles.group}>
                    <View style={[styles.groupContainer, { backgroundColor: isDarkMode ? '#1C1C1E' : '#FFFFFF' }]}>
                        {Object.entries(languages).map(([code, name], index) => (
                            <React.Fragment key={code}>
                                <Pressable
                                    style={({ pressed }) => [
                                        styles.languageRow,
                                        Platform.OS === 'android' ? { backgroundColor: pressed ? (isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)') : 'transparent' } : { opacity: pressed ? 0.7 : 1 }
                                    ]}
                                    onPress={() => handleLanguageChange(code as Language)}
                                    android_ripple={{ color: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}
                                >
                                    <Text style={styles.languageText}>{name}</Text>
                                    <View style={styles.languageRight} pointerEvents="none">
                                        {language === code && (
                                            Platform.OS === 'ios' ? (
                                                <SymbolView
                                                    name="checkmark"
                                                    tintColor='#007AFF'
                                                    type="hierarchical"
                                                    size={18}
                                                />
                                            ) : (
                                                <MaterialCommunityIcons
                                                    name={iconMap.checkmark}
                                                    color='#007AFF'
                                                    size={22}
                                                />
                                            )
                                        )}
                                    </View>
                                </Pressable>

                                {/* Add separator between items, but not after the last one */}
                                {index < Object.entries(languages).length - 1 && (
                                    <View style={[styles.separator, { backgroundColor: isDarkMode ? 'rgba(84,84,88,0.35)' : 'rgba(198,198,200,0.5)' }]} />
                                )}
                            </React.Fragment>
                        ))}
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        paddingTop: 20,
        backgroundColor: 'transparent',
    },
    group: {
        backgroundColor: 'transparent',
        marginVertical: 10,
        marginHorizontal: 16,
    },
    groupContainer: {
        borderRadius: 10,
        overflow: 'hidden',
        ...Platform.select({
            ios: {
                // shadowColor: '#000', // handled by Themed view or keep if needed
                // shadowOffset: { width: 0, height: 1 },
                // shadowOpacity: 0.05,
                // shadowRadius: 2,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    languageRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 14,
        minHeight: 50,
    },
    languageText: {
        fontSize: 17,
    },
    languageRight: {
        minWidth: 24,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
    separator: {
        height: StyleSheet.hairlineWidth,
        marginLeft: 16
    },
});
import React from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    useColorScheme,
    Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AiScanner from '../components/AiScanner';
import { View, Text } from '@/components/Themed';
import { useConfigStore } from '@/utils/state';
import { useTranslation } from '@/i18n';

const PROVIDERS_REQUIRING_KEYS = ['openai', 'google'];

export default function AiScannerPage() {
    const { selectedProvider, apiKey } = useConfigStore();
    const router = useRouter();
    const colorScheme = useColorScheme();
    const isDarkMode = colorScheme === 'dark';
    const { t } = useTranslation();

    const isProviderSet = selectedProvider && selectedProvider.length > 0;
    const requiresApiKey = PROVIDERS_REQUIRING_KEYS.includes(selectedProvider);
    const isApiKeySet = apiKey && apiKey.trim().length > 0;

    const isSetupComplete = isProviderSet && (!requiresApiKey || isApiKeySet);

    const handleGoToSettings = () => {
        router.push('/ai-settings');
    };

    const getSetupMessage = () => {
        if (!isProviderSet) {
            return {
                title: t('settings.aiProviderNotSelected'),
                description: t('settings.aiProviderNotice'),
                actionText: t('settings.selectAiProvider'),
            };
        } else if (requiresApiKey && !isApiKeySet) {
            const providerName = getProviderDisplayName(selectedProvider);
            return {
                title: t('settings.apiKeyRequired'),
                description: `${t('settings.pleaseAddYour')} ${providerName} ${t('settings.apiKeyToUseFeatures')}`,
                actionText: t('settings.addApiKey'),
            };
        }
        return null;
    };

    const getProviderDisplayName = (provider: string) => {
        const providerNames: { [key: string]: string } = {
            'openai': 'OpenAI',
            'anthropic': 'Anthropic',
            'google': 'Google',
            'openrouter': 'OpenRouter',
            'ollama': 'Ollama',
        };
        return providerNames[provider] || provider;
    };

    const iconMap = {
        'brain.head.profile': 'brain' as const,
        'arrow.right': 'arrow-right' as const,
        'info.circle': 'information-outline' as const,
    };

    if (!isSetupComplete) {
        const setupMessage = getSetupMessage();

        return (
            <View style={styles.container}>
                <View style={styles.setupContainer}>
                    <View style={styles.setupContent}>
                        <View style={[
                            styles.iconContainer,
                            { backgroundColor: isDarkMode ? '#1C1C1E' : '#F2F2F7' },
                        ]}>
                            {Platform.OS === 'ios' ? (
                                <SymbolView
                                    name="brain.head.profile"
                                    tintColor={isDarkMode ? '#FFFFFF' : '#000000'}
                                    type="hierarchical"
                                    size={32}
                                />
                            ) : (
                                <MaterialCommunityIcons
                                    name={iconMap['brain.head.profile']}
                                    color={isDarkMode ? '#FFFFFF' : '#000000'}
                                    size={32}
                                />
                            )}
                        </View>

                        <Text style={[
                            styles.setupTitle,
                            { color: isDarkMode ? '#FFFFFF' : '#000000' },
                        ]}>
                            {setupMessage?.title}
                        </Text>

                        <Text style={[
                            styles.setupDescription,
                            { color: isDarkMode ? '#8E8E93' : '#8E8E93' },
                        ]}>
                            {setupMessage?.description}
                        </Text>

                        <TouchableOpacity
                            style={[
                                styles.setupButton,
                                { backgroundColor: '#ef5a3c' },
                            ]}
                            onPress={handleGoToSettings}
                        >
                            <Text style={styles.setupButtonText}>
                                {setupMessage?.actionText}
                            </Text>
                            {Platform.OS === 'ios' ? (
                                <SymbolView
                                    name="arrow.right"
                                    tintColor='#FFFFFF'
                                    type="hierarchical"
                                    size={16}
                                />
                            ) : (
                                <MaterialCommunityIcons
                                    name={iconMap['arrow.right']}
                                    color='#FFFFFF'
                                    size={16}
                                />
                            )}
                        </TouchableOpacity>

                        {/* Secondary info */}
                        <View style={styles.infoContainer}>
                            {Platform.OS === 'ios' ? (
                                <SymbolView
                                    name="info.circle"
                                    tintColor='#007AFF'
                                    type="hierarchical"
                                    size={14}
                                />
                            ) : (
                                <MaterialCommunityIcons
                                    name={iconMap['info.circle']}
                                    color='#007AFF'
                                    size={14}
                                />
                            )}
                            <Text style={[
                                styles.infoText,
                                { color: isDarkMode ? '#8E8E93' : '#8E8E93' },
                            ]}>
                                {t('settings.aiServiceInfoMessage')}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <AiScanner />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        width: '100%',
    },
    setupContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
        backgroundColor: 'transparent',
    },
    setupContent: {
        alignItems: 'center',
        maxWidth: 320,
        backgroundColor: 'transparent',
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    setupTitle: {
        fontSize: 24,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 12,
    },
    setupDescription: {
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 32,
    },
    setupButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
        marginBottom: 24,
        minWidth: 200,
    },
    setupButtonText: {
        color: '#FFFFFF',
        fontSize: 17,
        fontWeight: '600',
        marginRight: 8,
    },
    infoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    infoText: {
        fontSize: 13,
        marginLeft: 6,
        textAlign: 'center',
        maxWidth: 250,
    },
    lightContainer: {
        backgroundColor: '#ffffff',
    },
    darkContainer: {
        backgroundColor: '#141414',
    },
    lightThemeText: {
        color: '#242c40',
    },
    darkThemeText: {
        color: '#d0d0c0',
    },
});
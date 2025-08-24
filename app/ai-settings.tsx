import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    useColorScheme,
    SafeAreaView,
    Platform,
    TouchableOpacity,
    TextInput,
    Modal,
    ScrollView,
    Alert,
    Linking,
} from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { AI_PROVIDERS, AIProvider, useConfigStore } from '../utils/state';
import { SymbolView } from 'expo-symbols';
import { View, Text } from '@/components/Themed';
import { useTranslation } from '@/i18n';

export default function AIProviderSettings() {
    const {
        selectedProvider,
        apiKeys,
        setSelectedProvider,
        setProviderApiKey,
    } = useConfigStore();

    const { t } = useTranslation();
    const colorScheme = useColorScheme();
    const isDarkMode = colorScheme === 'dark';

    const [showProviderModal, setShowProviderModal] = useState(false);
    const [tempApiKey, setTempApiKey] = useState(apiKeys[selectedProvider] || '');
    const [isKeyVisible, setIsKeyVisible] = useState(false);

    const selectedProviderData = AI_PROVIDERS.find(p => p.id === selectedProvider);

    useEffect(() => {
        setTempApiKey(apiKeys[selectedProvider] || '');
    }, [selectedProvider, apiKeys]);

    const handleProviderSelect = (provider: AIProvider) => {
        setSelectedProvider(provider.id);
        setShowProviderModal(false);
    };

    const handleSaveApiKey = () => {
        if (!selectedProviderData) return;

        if (selectedProviderData.requiresKey && !tempApiKey.trim()) {
            Alert.alert(
                t('settings.apiKeyRequired'),
                `${t('settings.pleaseEnterYour')} ${selectedProviderData.name} ${t('settings.apiKeyToContinue')}.`,
                [{ text: t('common.ok'), style: 'default' }]
            );
            return;
        }
        setProviderApiKey(selectedProvider, tempApiKey.trim());
    };

    const openOAI = () => {
        Linking.openURL('https://platform.openai.com/api-keys');
    };

    const openGemini = () => {
        Linking.openURL('https://aistudio.google.com/');
    };

    // 3. Icon mapping
    const iconMap = {
        'checkmark': 'check' as const,
        'chevron.right': 'chevron-right' as const,
        'eye.slash': 'eye-off-outline' as const,
        'eye': 'eye-outline' as const,
        'info.circle': 'information-outline' as const,
        'arrow.up.right': 'arrow-top-right' as const,
    };

    const renderProviderModal = () => (
        <Modal
            visible={showProviderModal}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={() => setShowProviderModal(false)}
        >
            <SafeAreaView style={[styles.modalContainer, { backgroundColor: isDarkMode ? '#000000' : '#F2F2F7' }]}>
                <View style={styles.modalHeader}>
                    <TouchableOpacity
                        style={styles.modalCancelButton}
                        onPress={() => setShowProviderModal(false)}
                    >
                        <Text style={styles.modalCancelText}>{t('common.cancel')}</Text>
                    </TouchableOpacity>
                    <Text style={styles.modalTitle}>{t('settings.selectAiProvider')}</Text>
                    <View style={styles.modalPlaceholder} />
                </View>

                <ScrollView style={styles.modalContent}>
                    <View style={styles.providerGroup}>
                        <View style={[styles.providerGroupContainer, { backgroundColor: isDarkMode ? '#151515' : '#ffffff' }]}>
                            {AI_PROVIDERS.map((provider, index) => (
                                <React.Fragment key={provider.id}>
                                    <TouchableOpacity
                                        style={styles.providerOption}
                                        onPress={() => handleProviderSelect(provider)}
                                    >
                                        <View style={styles.providerContent}>
                                            <View style={styles.providerInfo}>
                                                <Text style={styles.providerModelName}>{provider.modelName}</Text>
                                                <Text style={styles.providerName}>{provider.name}</Text>
                                            </View>
                                            {selectedProvider === provider.id && (
                                                Platform.OS === 'ios' ? (
                                                    <SymbolView
                                                        name="checkmark"
                                                        tintColor='#007AFF'
                                                        type="hierarchical"
                                                        size={20}
                                                    />
                                                ) : (
                                                    <MaterialCommunityIcons
                                                        name={iconMap.checkmark}
                                                        color='#007AFF'
                                                        size={20}
                                                    />
                                                )
                                            )}
                                        </View>
                                    </TouchableOpacity>
                                    {index < AI_PROVIDERS.length - 1 && (
                                        <View style={[styles.providerSeparator, { backgroundColor: isDarkMode ? '#555555' : '#C6C6C8' }]} />
                                    )}
                                </React.Fragment>
                            ))}
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </Modal>
    );

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 50 }}>
                {/* AI Provider Selection */}
                <View style={styles.settingsGroup}>
                    <View style={[styles.settingsGroupContainer, { backgroundColor: isDarkMode ? '#151515' : '#ffffff' }]}>
                        <TouchableOpacity
                            style={styles.settingsRowTouchable}
                            onPress={() => setShowProviderModal(true)}
                        >
                            <View style={styles.settingsContent}>
                                <Text style={styles.settingsLabel}>{t('settings.aiProvider')}</Text>
                                <View style={styles.settingsValue}>
                                    <Text style={styles.settingsValueText}>
                                        {selectedProviderData?.modelName || 'Select Provider'}
                                    </Text>
                                    {Platform.OS === 'ios' ? (
                                        <SymbolView
                                            name="chevron.right"
                                            tintColor='#C7C7CC'
                                            type="hierarchical"
                                            size={14}
                                        />
                                    ) : (
                                        <MaterialCommunityIcons
                                            name={iconMap["chevron.right"]}
                                            color='#C7C7CC'
                                            size={16}
                                        />
                                    )}
                                </View>
                            </View>
                        </TouchableOpacity>

                        {selectedProviderData?.requiresKey && (
                            <>
                                <View style={[styles.settingsSeparator, { backgroundColor: isDarkMode ? '#555555' : '#C6C6C8' }]} />

                                <View style={styles.apiKeySection}>
                                    <View style={styles.apiKeyHeader}>
                                        <Text style={styles.settingsLabel}>{t('settings.apiKey')}</Text>
                                        <TouchableOpacity
                                            style={styles.visibilityToggle}
                                            onPress={() => setIsKeyVisible(!isKeyVisible)}
                                        >
                                            {Platform.OS === 'ios' ? (
                                                <SymbolView
                                                    name={isKeyVisible ? "eye.slash" : "eye"}
                                                    tintColor='#007AFF'
                                                    type="hierarchical"
                                                    size={16}
                                                    resizeMode="scaleAspectFill"
                                                />
                                            ) : (
                                                <MaterialCommunityIcons
                                                    name={isKeyVisible ? iconMap["eye.slash"] : iconMap.eye}
                                                    color='#007AFF'
                                                    size={20}
                                                />
                                            )}
                                        </TouchableOpacity>
                                    </View>

                                    <TextInput
                                        style={[
                                            styles.apiKeyInput,
                                            {
                                                backgroundColor: isDarkMode ? '#1C1C1E' : '#F2F2F7',
                                                color: isDarkMode ? '#FFFFFF' : '#000000',
                                                borderColor: isDarkMode ? '#38383A' : '#C6C6C8',
                                            },
                                        ]}
                                        value={tempApiKey}
                                        onChangeText={setTempApiKey}
                                        onBlur={handleSaveApiKey}
                                        onSubmitEditing={handleSaveApiKey}
                                        placeholder={`Enter your ${selectedProviderData?.name} API key`}
                                        placeholderTextColor={isDarkMode ? '#8E8E93' : '#8E8E93'}
                                        secureTextEntry={!isKeyVisible}
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        multiline={false}
                                        returnKeyType="done"
                                    />
                                </View>
                            </>
                        )}
                    </View>
                </View>

                {/* Info Section 1 */}
                <View style={styles.settingsGroup}>
                    <View style={[styles.settingsGroupContainer, { backgroundColor: isDarkMode ? '#151515' : '#ffffff' }]}>
                        <View style={styles.infoSection}>
                            <View style={styles.infoContent}>
                                {Platform.OS === 'ios' ? (
                                    <SymbolView
                                        name="info.circle"
                                        tintColor='#007AFF'
                                        type="hierarchical"
                                        size={16}
                                    />
                                ) : (
                                    <MaterialCommunityIcons
                                        name={iconMap["info.circle"]}
                                        color='#007AFF'
                                        size={18}
                                    />
                                )}
                                <Text style={styles.infoText}>
                                    {selectedProviderData?.requiresKey
                                        ? `${t('settings.youllNeedApiKeyFrom')} ${selectedProviderData?.name} ${t('settings.apiKeyNoticeSecondPart')}.`
                                        : `${selectedProviderData?.modelName} ${t('settings.localModelNotice')}.`
                                    }
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Info Section 2 (Estimated Cost) */}
                <View style={styles.settingsGroup}>
                    <View style={[styles.settingsGroupContainer, { backgroundColor: isDarkMode ? '#151515' : '#ffffff' }]}>
                        <View style={styles.infoSection}>
                            <View style={styles.infoContent}>
                                {Platform.OS === 'ios' ? (
                                    <SymbolView
                                        name="info.circle"
                                        tintColor='#007AFF'
                                        type="hierarchical"
                                        size={16}
                                    />
                                ) : (
                                    <MaterialCommunityIcons
                                        name={iconMap["info.circle"]}
                                        color='#007AFF'
                                        size={18}
                                    />
                                )}
                                <Text style={styles.infoText}>
                                    {t('settings.estimatedMonthlyCost')}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* External Links Section */}
                <View style={styles.settingsGroup}>
                    <View style={[styles.settingsGroupContainer, { backgroundColor: isDarkMode ? '#151515' : '#ffffff' }]}>
                        <TouchableOpacity
                            onPress={openOAI}
                            style={styles.settingRow}
                        >
                            <Text style={styles.settingText}>OpenAI Dev Platform</Text>
                            <View style={styles.settingRight} pointerEvents="none">
                                {Platform.OS === 'ios' ? (
                                    <SymbolView name="arrow.up.right" tintColor="#C7C7CC" type="hierarchical" size={16} />
                                ) : (
                                    <MaterialCommunityIcons name={iconMap["arrow.up.right"]} color="#C7C7CC" size={18} />
                                )}
                            </View>
                        </TouchableOpacity>
                        <View style={[styles.providerSeparator, { backgroundColor: isDarkMode ? '#555555' : '#C6C6C8' }]} />
                        <TouchableOpacity
                            onPress={openGemini}
                            style={styles.settingRow}
                        >
                            <Text style={styles.settingText}>Google AI Studio (Gemini)</Text>
                            <View style={styles.settingRight} pointerEvents="none">
                                {Platform.OS === 'ios' ? (
                                    <SymbolView name="arrow.up.right" tintColor="#C7C7CC" type="hierarchical" size={16} />
                                ) : (
                                    <MaterialCommunityIcons name={iconMap["arrow.up.right"]} color="#C7C7CC" size={18} />
                                )}
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

            </ScrollView>
            {renderProviderModal()}
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
    settingsGroup: {
        backgroundColor: 'transparent',
        marginBottom: 25,
        paddingHorizontal: 16,
    },
    settingsGroupContainer: {
        borderRadius: 10,
        overflow: 'hidden',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1, },
                shadowOpacity: 0.05,
                shadowRadius: 2,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    settingsRowTouchable: {
        backgroundColor: 'transparent',
    },
    settingsContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 14,
        minHeight: 48,
        backgroundColor: 'transparent',
    },
    settingsLabel: {
        fontSize: 17,
    },
    settingsValue: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    settingsValueText: {
        fontSize: 17,
        color: '#8E8E93',
        marginRight: 6,
    },
    settingsSeparator: {
        height: StyleSheet.hairlineWidth,
        marginLeft: 16,
    },
    providerSeparator: {
        height: StyleSheet.hairlineWidth,
        marginLeft: 16,
    },
    apiKeySection: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: 'transparent',
    },
    apiKeyHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
        backgroundColor: 'transparent',
    },
    visibilityToggle: {
        padding: 6,
        marginRight: -6,
    },
    apiKeyInput: {
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: Platform.OS === 'ios' ? 12 : 10,
        fontSize: 16,
        fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    },
    infoSection: {
        backgroundColor: 'transparent',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    infoContent: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: 'transparent',
    },
    infoText: {
        fontSize: 14,
        color: '#8E8E93',
        flex: 1,
        lineHeight: 20,
    },
    modalContainer: {
        flex: 1,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: StyleSheet.hairlineWidth,
        backgroundColor: 'transparent',
    },
    modalCancelButton: {
        paddingVertical: 8,
        paddingHorizontal: 4
    },
    modalCancelText: {
        fontSize: 17,
        color: '#007AFF',
    },
    modalTitle: {
        fontSize: 17,
        fontWeight: '600',
        textAlign: 'center',
        flex: 1,
    },
    modalPlaceholder: {
        width: Platform.OS === 'ios' ? 70 : 60,
    },
    modalContent: {
        flex: 1,
        paddingTop: 20,
    },
    providerGroup: {
        backgroundColor: 'transparent',
        marginBottom: 25,
        paddingHorizontal: 16,
    },
    providerGroupContainer: {
        borderRadius: 10,
        overflow: 'hidden',
        ...Platform.select({
            ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, },
            android: { elevation: 2, },
        }),
    },
    providerOption: {
        backgroundColor: 'transparent',
    },
    providerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        minHeight: 48,
        backgroundColor: 'transparent',
    },
    providerInfo: {
        flex: 1,
        backgroundColor: 'transparent',
        marginRight: 8,
    },
    providerModelName: {
        fontSize: 17,
        marginBottom: 2,
    },
    providerName: {
        fontSize: 14,
        color: '#8E8E93',
    },
    settingRow: {
        backgroundColor: 'transparent',
        paddingVertical: 14,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: 48,
    },
    settingText: {
        fontSize: 17,
    },
    settingRight: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
});
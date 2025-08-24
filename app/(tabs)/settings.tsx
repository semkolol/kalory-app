import React from 'react';
import { router, useFocusEffect } from 'expo-router';
import { useColorScheme, StyleSheet, TouchableOpacity, Linking, Platform, SafeAreaView } from 'react-native';
import { AI_PROVIDERS, useConfigStore } from '../../utils/state';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { SymbolView } from 'expo-symbols';
import { View, Text } from '@/components/Themed';
import { useHeaderHeight } from '@react-navigation/elements';
import { useTranslation } from '@/i18n';
import { hasProAccess } from '@/utils/purchases';
import { useCallback } from 'react';

const languages = {
  en: "English",
  de: "Deutsch",
  fr: "Français",
  it: "Italiano",
  jp: "日本語",
  zh: "中文"
};

export default function Settings() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const headerHeight = useHeaderHeight();

  const { language, selectedProvider, setCompletedOnboarding, trialStartDate, isPro } = useConfigStore();
  const selectedProviderData = AI_PROVIDERS.find(p => p.id === selectedProvider);
  const { t } = useTranslation();

  useFocusEffect(
    useCallback(() => {
      hasProAccess();
    }, [])
  );

  const openPrivacyPolicy = () => {
    Linking.openURL('https://kalory.app/pp');
  };

  const openTOS = () => {
    Linking.openURL('https://kalory.app/tos');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.contentContainer, { paddingTop: headerHeight }]}>
        {trialStartDate && !isPro && (
          <View style={styles.group}>
            <View style={[styles.groupContainer, { backgroundColor: isDarkMode ? '#151515' : '#ffffff' }, { marginVertical: 10 }]}>
              <TouchableOpacity
                onPress={() => router.navigate('/paywall?from=settings')}
                style={styles.settingRow}
              >
                <Text style={styles.settingText}>{t('settings.unlockFullAccess')}</Text>
                <View style={styles.settingRight} pointerEvents="none">
                  {Platform.OS === 'ios' ? (
                    <SymbolView name="lock.open.fill" tintColor="#C7C7CC" type="hierarchical" size={16} />
                  ) : (
                    <MaterialCommunityIcons name="lock-open" color="#C7C7CC" size={20} />
                  )}
                </View>
              </TouchableOpacity>
            </View>
          </View>
        )}
        <View style={styles.group}>
          <View style={[styles.groupContainer, { backgroundColor: isDarkMode ? '#151515' : '#ffffff' }]}>
            <TouchableOpacity
              onPress={() => setCompletedOnboarding(false)}
              style={styles.settingRow}
            >
              <Text style={styles.settingText}>Reset Onboarding</Text>
              <View style={styles.settingRight} pointerEvents="none">
                <SymbolView name="chevron.forward" tintColor="#C7C7CC" type="hierarchical" size={16} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.navigate('/ai-settings')}
              style={styles.settingRow}
            >
              <Text style={styles.settingText}>{t('settings.aiSettings')}</Text>
              <View style={styles.settingRight} pointerEvents="none">
                <Text style={styles.settingValue}>{selectedProviderData?.modelName}</Text>
                {Platform.OS === 'ios' ? (
                  <SymbolView name="chevron.forward" tintColor="#C7C7CC" type="hierarchical" size={16} />
                ) : (
                  <MaterialCommunityIcons name="chevron-right" color="#C7C7CC" size={20} />
                )}
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.navigate('/language')}
              style={styles.settingRow}
            >
              <Text style={styles.settingText}>{t('settings.language')}</Text>
              <View style={styles.settingRight} pointerEvents="none">
                <Text style={styles.settingValue}>{languages[language ? language : "en"]}</Text>
                {Platform.OS === 'ios' ? (
                  <SymbolView name="chevron.forward" tintColor="#C7C7CC" type="hierarchical" size={16} />
                ) : (
                  <MaterialCommunityIcons name="chevron-right" color="#C7C7CC" size={20} />
                )}
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.navigate('/notification-settings')}
              style={styles.settingRow}
            >
              <Text style={styles.settingText}>{t('settings.reminderNotifications')}</Text>
              <View style={styles.settingRight} pointerEvents="none">
                {Platform.OS === 'ios' ? (
                  <SymbolView name="chevron.forward" tintColor="#C7C7CC" type="hierarchical" size={16} />
                ) : (
                  <MaterialCommunityIcons name="chevron-right" color="#C7C7CC" size={20} />
                )}
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.navigate('/food-database')}
              style={styles.settingRow}
            >
              <Text style={styles.settingText}>{t('settings.foodDatabase')}</Text>
              <View style={styles.settingRight} pointerEvents="none">
                {Platform.OS === 'ios' ? (
                  <SymbolView name="chevron.forward" tintColor="#C7C7CC" type="hierarchical" size={16} />
                ) : (
                  <MaterialCommunityIcons name="chevron-right" color="#C7C7CC" size={20} />
                )}
              </View>
            </TouchableOpacity>

            <View style={[styles.separator, { backgroundColor: isDarkMode ? '#555555' : '#C6C6C8' }]} />

            <TouchableOpacity
              onPress={openPrivacyPolicy}
              style={styles.settingRow}
            >
              <Text style={styles.settingText}>{t('settings.privacyPolicy')}</Text>
              <View style={styles.settingRight} pointerEvents="none">
                {Platform.OS === 'ios' ? (
                  <SymbolView name="arrow.up.right" tintColor="#C7C7CC" type="hierarchical" size={16} />
                ) : (
                  <MaterialCommunityIcons name="arrow-top-right" color="#C7C7CC" size={18} />
                )}
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={openTOS}
              style={styles.settingRow}
            >
              <Text style={styles.settingText}>{t('settings.tos')}</Text>
              <View style={styles.settingRight} pointerEvents="none">
                {Platform.OS === 'ios' ? (
                  <SymbolView name="arrow.up.right" tintColor="#C7C7CC" type="hierarchical" size={16} />
                ) : (
                  <MaterialCommunityIcons name="arrow-top-right" color="#C7C7CC" size={18} />
                )}
              </View>
            </TouchableOpacity>
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
  contentContainer: {
    flex: 1,
  },
  group: {
    backgroundColor: 'transparent',
    paddingHorizontal: 16,
  },
  groupContainer: {
    borderRadius: 10,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  settingRow: {
    backgroundColor: 'transparent',
    paddingVertical: 5,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 44,
  },
  settingText: {
    fontSize: 17,
    fontWeight: '400',
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  settingValue: {
    fontSize: 17,
    color: '#8E8E93',
    marginRight: 8,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    marginHorizontal: 16,
  },
});
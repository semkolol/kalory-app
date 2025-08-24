import { Tabs } from 'expo-router/tabs';
import { StyleSheet, useColorScheme, Image, TouchableOpacity, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { SymbolView } from 'expo-symbols';
import { View, Text } from '@/components/Themed';
import { useConfigStore } from '@/utils/state';
import { useTranslation } from '@/i18n';

function LogoTitle() {
  return (
    <Image
      style={{ width: 30, height: 30, marginLeft: 15 }}
      source={require('../../assets/logo.png')}
    />
  );
}

function HeaderRightDateDisplay() {
  const colorScheme = useColorScheme();
  const headerDisplayDate = useConfigStore((state) => state.headerDisplayDate);

  const themeTextStyle = colorScheme === 'light' ? styles.lightThemeText : styles.darkThemeText;

  return (
    <View style={styles.headerRightContainer}>
      <Text style={[styles.headerRightText, themeTextStyle]}>
        {headerDisplayDate || ''}
      </Text>
    </View>
  );
}


export default function Layout() {
  const colorScheme = useColorScheme();
  const { t } = useTranslation();

  const tabIconMap = {
    'house': 'home-outline' as const,
    'chart.bar': 'chart-bar' as const,
    'magnifyingglass': 'magnify' as const,
    'gearshape': 'cog-outline' as const,
    'timer': 'timer-sand' as const,
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#fc3b14',
        tabBarShowLabel: true,
        headerStyle: {
          height: 100,
          backgroundColor: 'transparent',
        },
        tabBarStyle: {
          backgroundColor: colorScheme === 'light' ? '#fff' : '#010101',
          borderTopWidth: 0,
          elevation: 0,
        },
        headerTransparent: true,
        headerBackground: () => (
          <BlurView tint={colorScheme === 'light' ? "light" : "dark"} intensity={35} style={StyleSheet.absoluteFill} />
        ),
        headerTitle: () => (''),
        headerLeft: () => (
          <LogoTitle />
        ),
        headerRight: () => <HeaderRightDateDisplay />,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.home'),
          tabBarLabel: t('tabs.home'),
          tabBarIcon: ({ color, size }) => (
            Platform.OS === 'ios' ? (
              <SymbolView
                name="house"
                tintColor={color}
                type="hierarchical"
                size={size}
                resizeMode="scaleAspectFit"
              />
            ) : (
              <MaterialCommunityIcons
                name={tabIconMap.house}
                color={color}
                size={size}
              />
            )
          ),
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: t('tabs.progress'),
          tabBarLabel: t('tabs.progress'),
          tabBarIcon: ({ color, size }) => (
            Platform.OS === 'ios' ? (
              <SymbolView
                name="chart.bar"
                tintColor={color}
                type="hierarchical"
                size={size}
                resizeMode="scaleAspectFit"
              />
            ) : (
              <MaterialCommunityIcons
                name={tabIconMap['chart.bar']}
                color={color}
                size={size}
              />
            )
          ),
        }}
      />

      <Tabs.Screen
        name="search"
        options={{
          title: t('tabs.search'),
          tabBarLabel: t('tabs.search'),
          tabBarIcon: ({ color, size }) => (
            Platform.OS === 'ios' ? (
              <SymbolView
                name="magnifyingglass"
                tintColor={color}
                type="hierarchical"
                size={size}
                resizeMode="scaleAspectFit"
              />
            ) : (
              <MaterialCommunityIcons
                name={tabIconMap.magnifyingglass}
                color={color}
                size={size}
              />
            )
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t('tabs.settings'),
          tabBarLabel: t('tabs.settings'),
          tabBarIcon: ({ color, size }) => (
            Platform.OS === 'ios' ? (
              <SymbolView
                name="gearshape"
                tintColor={color}
                type="hierarchical"
                size={size}
                resizeMode="scaleAspectFit"
              />
            ) : (
              <MaterialCommunityIcons
                name={tabIconMap.gearshape}
                color={color}
                size={size}
              />
            )
          ),
        }}
      />
    </Tabs >
  );
}

const styles = StyleSheet.create({
  headerRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingRight: 15,
  },
  headerRightText: {
    fontSize: 16,
    fontWeight: '500',
  },
  lightThemeText: {
    color: '#242c40',
  },
  darkThemeText: {
    color: '#d0d0c0',
  }
});
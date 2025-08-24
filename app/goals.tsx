import React from 'react';
import { View, StyleSheet, Text, useColorScheme, Button } from 'react-native';
import { Stack } from 'expo-router';

export default function Goals() {
  const colorScheme = useColorScheme();

  const themeTextStyle = colorScheme === 'light' ? styles.lightThemeText : styles.darkThemeText;
  const themeContainerStyle =
    colorScheme === 'light' ? styles.lightContainer : styles.darkContainer;


  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Goals',
          headerStyle: themeContainerStyle,
          headerTintColor: themeTextStyle.color,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: 30
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
  }
});

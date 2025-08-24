import React from 'react';
import { View, StyleSheet, useColorScheme, Text } from 'react-native';

type ProgressBarType = {
  percentage: number;
  primary: string;
  height: number;
  radius: number;
  macro: string;
};

const ProgressBar = ({ percentage, primary, height, radius, macro }: ProgressBarType) => {
  const colorScheme = useColorScheme();

  const themeTextStyle = colorScheme === 'light' ? styles.lightThemeText : styles.darkThemeText;
  const themeContainerStyle =
    colorScheme === 'light' ? styles.lightContainer : styles.darkContainer;

  const cappedPercentage = Math.min(100, Math.max(0, percentage));

  // dynamic radius adjustment
  const dynamicRadius = cappedPercentage < 2 * radius / 150 ? cappedPercentage * 150 / (2 * radius) : radius;
  //150 is the total width of progress bar; capped percentage is the percentage * 100 so we dont have a decimal e.g 0.2
  //explanation: we use the formula for radius to change radius based on percentage if percentage is lower than 2 * radius/150
  //if the radius value is higher than half of the value of the percentage then it looks really bad. 
  //i.e if the progress bar is 10px and radius is 15, it will look really bad
  return (
    <View style={{ height: height, backgroundColor: themeContainerStyle.backgroundColor, width: 150, borderRadius: radius, justifyContent: 'center', margin: 2, overflow: 'hidden' }}>
      <Text style={[themeTextStyle, { alignSelf: 'center', textAlign: 'center', position: 'absolute', zIndex: 1, width: '100%' }]}>{macro}</Text>
      <View
        style={{
          backgroundColor: primary,
          width: `${cappedPercentage}%`,
          height: height,
          borderRadius: dynamicRadius,
          overflow: 'hidden',
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  lightContainer: {
    backgroundColor: '#e5e5e5',
  },
  darkContainer: {
    backgroundColor: '#313131',
  },
  lightThemeText: {
    color: '#313131',
  },
  darkThemeText: {
    color: '#e5e5e5',
  },
});

export default ProgressBar;
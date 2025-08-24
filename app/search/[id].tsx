import React, { useEffect, useState, useRef } from 'react';
import { Link, Stack, useLocalSearchParams } from 'expo-router';
import {
  Text,
  View,
  useColorScheme,
  StyleSheet,
  Alert,
  TextInput,
  ScrollView,
} from 'react-native';
import { Food } from '../../utils/state';
import Card from '../../components/Card';
import { useTranslation } from '@/i18n';


export default function Search() {
  const colorScheme = useColorScheme();
  const { id } = useLocalSearchParams();
  const { t } = useTranslation();

  const themeTextStyle =
    colorScheme === 'light' ? styles.lightThemeText : styles.darkThemeText;
  const themeContainerStyle =
    colorScheme === 'light' ? styles.lightContainer : styles.darkContainer;

  const [search, setSearch] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [food, setFood] = useState<Food[] | undefined>(undefined);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [search]);

  useEffect(() => {
    if (debouncedSearch.length <= 0) {
      setFood(undefined);
      return;
    }
    searchFood();
  }, [debouncedSearch]);

  useEffect(() => {
    if (id != 'undefined') {
      setSearch(id as string);
    }
  }, [id]);

  async function searchFood() {
    try {
      setLoading(true);

    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={[styles.container, themeContainerStyle]}>
      <Stack.Screen
        options={{
          title: '______',
          headerStyle: themeContainerStyle,
          headerTintColor: themeTextStyle.color,
          headerTitleStyle: {
            fontWeight: 'bold',
            color: '#414141',
          },
        }}
      />
      <TextInput
        placeholder={t("tabs.search")}
        value={search}
        placeholderTextColor={themeTextStyle.color}
        style={[
          colorScheme === 'light'
            ? styles.lightTextInput
            : styles.darkTextInput,
          themeTextStyle,
        ]}
        onChangeText={setSearch}
      />

      <ScrollView
        contentContainerStyle={{
          alignItems: "center",
          flexDirection: "column",
          padding: 8,
          width: "100%",
        }}
      >
        <Link
          href={{ pathname: "add-food/undefined/" }}
          style={[
            themeTextStyle,
            {
              backgroundColor: colorScheme === "light" ? "#e5e7eb" : "#000000",
              padding: 8,
            },
          ]}
        >
          Add missing food
        </Link>

        {(loading && debouncedSearch.length > 0) ? (
          <Text style={themeTextStyle}>Loading...</Text>
        ) : food ? (
          food.map((x: Food) => (
            <Card
              foodName={x.foodName}
              quantity={x.quantity}
              foodCalories={x.calories}
              hideIcons={true}
              id={x.id}
              protein={x.protein}
              carbs={x.carbs}
              fat={x.fat}
              metrics={x.metrics}
              key={x.id}
            />
          ))
        ) : debouncedSearch.length < 1 ? (
          <Text style={[themeTextStyle]}></Text>
        ) : (
          <Text style={[themeTextStyle]}>No search results</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
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
  lightTextInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: 20,
    backgroundColor: '#ebebeb',
  },
  darkTextInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: 20,
    backgroundColor: '#000',
  },
});
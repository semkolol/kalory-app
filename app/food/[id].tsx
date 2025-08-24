import React, { useEffect, useState, useMemo } from 'react';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import {
  useColorScheme,
  StyleSheet,
  Alert,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useDiaryStore, useFoodDatabaseStore, FoodDatabaseItem } from '../../utils/state';
import * as Crypto from 'expo-crypto';
import { useForm, Controller } from 'react-hook-form';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { SymbolView } from 'expo-symbols';
import { useHeaderHeight } from '@react-navigation/elements';
import { View, Text } from '@/components/Themed';
import { useTranslation } from '@/i18n';

export default function FoodDetailScreen() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const headerHeight = useHeaderHeight();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation();

  const { addFood: addFoodToDiary } = useDiaryStore();
  const findFoodById = useFoodDatabaseStore((state) => state.findFoodById);

  const inputBgStyle = isDarkMode ? styles.darkInputBg : styles.lightInputBg;
  const placeholderTextColor = isDarkMode ? '#6b7280' : '#9ca3af';

  const [foodItem, setFoodItem] = useState<FoodDatabaseItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { control, watch, setValue, handleSubmit } = useForm<{ quantity: number }>({
    defaultValues: {
      quantity: 100,
    },
  });
  const currentQuantity = watch('quantity');

  useEffect(() => {
    if (id) {
      const item = findFoodById(id);
      if (item) {
        setFoodItem(item);
        setValue('quantity', 100);
      } else {
        Alert.alert("Error", "Food item not found in your database.", [{ text: "OK", onPress: () => router.back() }]);
      }
      setIsLoading(false);
    } else {
      Alert.alert("Error", "No food ID provided.", [{ text: "OK", onPress: () => router.back() }]);
      setIsLoading(false);
    }
  }, [id, findFoodById, setValue]);

  const calculatedMacros = useMemo(() => {
    if (!foodItem || currentQuantity === undefined || isNaN(currentQuantity) || currentQuantity <= 0) {
      return {
        calories: foodItem?.calories || 0,
        protein: foodItem?.protein || 0,
        carbs: foodItem?.carbs || 0,
        fat: foodItem?.fat || 0,
      };
    }
    const factor = currentQuantity / 100;
    return {
      calories: Math.round(foodItem.calories * factor),
      protein: parseFloat((foodItem.protein * factor).toFixed(2)),
      carbs: parseFloat((foodItem.carbs * factor).toFixed(2)),
      fat: parseFloat((foodItem.fat * factor).toFixed(2)),
    };
  }, [foodItem, currentQuantity]);

  const handleAddFoodToDiary = (data: { quantity: number }) => {
    if (!foodItem || data.quantity <= 0) {
      Alert.alert("Invalid Quantity", "Please enter a quantity greater than 0.");
      return;
    }

    const { calories, protein, carbs, fat } = calculatedMacros;

    addFoodToDiary({
      barcode: '',
      calories: calories,
      protein: protein,
      carbs: carbs,
      fat: fat,
      quantity: data.quantity,
      metrics: foodItem.metrics,
      foodName: foodItem.foodName,
      id: foodItem.id,
      entryId: `diary_log_${foodItem.id}_${Crypto.randomUUID()}`, // unique ID for this diary log
    });
    router.back();
  };

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer]}>
        <ActivityIndicator size="large" color={isDarkMode ? '#FFF' : '#ef5a3c'} />
      </View>
    );
  }

  if (!foodItem) {
    return (
      <View style={[styles.loadingContainer]}>
        <Text>{t('food.foodItemNotFound')}</Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={[styles.container, { paddingTop: headerHeight + 20 }]}
      keyboardShouldPersistTaps="handled"
    >
      <Stack.Screen
        options={{
          title: foodItem.foodName,
          headerTitleStyle: { fontWeight: "bold" },
        }}
      />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.contentWrapper}>
          <Text style={[styles.caloriesDisplay]}>
            {calculatedMacros.calories} {t('food.calories').toLowerCase()}
          </Text>
          <Text style={[styles.servingInfoText]}>
            {t('food.for')} {currentQuantity || 0} {foodItem.metrics}
          </Text>

          <View style={styles.macrosGrid}>
            <MacroDisplayItem
              label={t('food.protein')}
              value={calculatedMacros.protein}
              unit="g"
              iconName="figure.strengthtraining.traditional"
              iconColor={isDarkMode ? "#60a5fa" : "#3b82f6"}
            />
            <MacroDisplayItem
              label={t('food.carbs')}
              value={calculatedMacros.carbs}
              unit="g"
              iconName="carrot.fill"
              iconColor={isDarkMode ? "#a3e635" : "#84cc16"}
            />
            <MacroDisplayItem
              label={t('food.fat')}
              value={calculatedMacros.fat}
              unit="g"
              iconName="drop.fill"
              iconColor={isDarkMode ? "#f472b6" : "#ec4899"}
            />
          </View>

          <Text style={[styles.quantityLabel]}>
            {t('food.quantity')} ({foodItem.metrics})
          </Text>
          <View style={styles.inputContainer}>
            <Controller
              control={control}
              rules={{ required: t('food.quantityRequired'), min: { value: 0.01, message: t('food.quantityMustBeGreater') } }}
              render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                <>
                  <TextInput
                    style={[
                      styles.input,
                      inputBgStyle,
                      { borderColor: error ? 'red' : (isDarkMode ? "#6b7280" : "#D1D5DB") },
                    ]}
                    placeholder={`e.g., 100`}
                    placeholderTextColor={placeholderTextColor}
                    onChangeText={(text) => {
                      const numValue = parseFloat(text);
                      onChange(isNaN(numValue) ? undefined : numValue);
                    }}
                    onBlur={onBlur}
                    value={value !== undefined ? String(value) : ""}
                    keyboardType="numeric"
                    selectTextOnFocus
                  />
                  <Text style={[styles.unitText]}>{foodItem.metrics}</Text>
                  {error && <Text style={styles.errorText}>{error.message}</Text>}
                </>
              )}
              name="quantity"
            />
          </View>

          <TouchableOpacity
            onPress={handleSubmit(handleAddFoodToDiary)}
            style={[styles.addButton, { backgroundColor: isDarkMode ? "#ef5a3c" : "#f48069" }]}
          >
            <Text style={styles.addButtonText}>{t('food.addToDiary')}</Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </ScrollView>
  );
}

const MacroDisplayItem = ({ label, value, unit, iconName, iconColor }:
  { label: string, value: number, unit: string, iconName: string, iconColor: string }) => {
  const colorScheme = useColorScheme();

  const getAndroidIconNameForMacroSFSymbol = (sfSymbolName: string): string => {
    switch (sfSymbolName) {
      case 'figure.strengthtraining.traditional':
        return 'dumbbell';
      case 'carrot.fill':
        return 'carrot';
      case 'drop.fill':
        return 'water';
      default:
        console.warn(`[getAndroidIconNameForMacroSFSymbol] No Android mapping for SF Symbol: "${sfSymbolName}". Using default.`);
        return 'help-circle-outline';
    }
  };

  return (
    <View style={styles.macroItem}>
      {Platform.OS === 'ios' ? (
        <SymbolView
          name={iconName as any}
          tintColor={iconColor}
          type="hierarchical"
          size={22}
        />
      ) : (
        <MaterialCommunityIcons
          name={getAndroidIconNameForMacroSFSymbol(iconName) as any}
          color={iconColor}
          size={24}
        />
      )}
      <Text style={[styles.macroValue]}>{value}{unit}</Text>
      <Text style={[styles.macroLabel]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
  },
  contentWrapper: {
    width: "100%",
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  caloriesDisplay: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  servingInfoText: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: 24,
  },
  macrosGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  macroItem: {
    alignItems: 'center',
    flex: 1,
  },
  macroValue: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 8,
  },
  macroLabel: {
    fontSize: 13,
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  quantityLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  inputContainer: {
    marginBottom: 24,
    position: 'relative',
  },
  input: {
    height: 50,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 17,
    width: '100%',
    paddingRight: 40,
  },
  unitText: {
    position: 'absolute',
    right: 16,
    top: 0,
    bottom: 0,
    lineHeight: 50,
    fontSize: 17,
    opacity: 0.6,
  },
  lightInputBg: { backgroundColor: '#FFFFFF', color: '#212121' },
  darkInputBg: { backgroundColor: '#212121', color: '#e5e5e5' },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
  addButton: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2, },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 3,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});
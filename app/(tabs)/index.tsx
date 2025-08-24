import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import {
  View,
  Text,
  useColorScheme,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Platform,
} from 'react-native';
import Card from '../../components/Card';
import { useDiaryStore, useGoalsStore, DiaryEntry, useConfigStore } from '../../utils/state';
import { router } from 'expo-router';
import CalorieOverview from '../../components/CalorieOverview';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { SymbolView } from 'expo-symbols';
import { useHeaderHeight } from '@react-navigation/elements';
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel';
import { useTranslation } from '@/i18n';

const windowWidth = Dimensions.get('window').width;

export default function Home() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const headerHeight = useHeaderHeight();
  const calorieCarouselRef = useRef<ICarouselInstance>(null);
  const { t } = useTranslation();

  const { diaryEntries, addDiary, removeDiaryEntry } = useDiaryStore();
  const { carbsGoal, fatGoal, proteinGoal } = useGoalsStore();
  const { setHeaderDisplayDate } = useConfigStore();

  const [isPressed, setIsPressed] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(() => {
    return diaryEntries.length > 0 ? diaryEntries.length - 1 : 0;
  });

  const themeTextStyle =
    colorScheme === 'light' ? styles.lightThemeText : styles.darkThemeText;

  function isSameDate(date1: Date, date2: Date): boolean {
    if (!(date1 instanceof Date && !isNaN(date1.valueOf())) || !(date2 instanceof Date && !isNaN(date2.valueOf()))) {
      return false;
    }
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  useEffect(() => {
    const today = new Date();
    let entries = [...diaryEntries];
    let todaysEntryIndex = entries.findIndex(entry => isSameDate(new Date(entry.date), today));

    if (todaysEntryIndex === -1) {
      if (entries.length >= 7) {
        removeDiaryEntry();
      }
      addDiary({ date: today, foodEntries: [] });
      return;
    }

    if (todaysEntryIndex !== currentIndex) {
      setCurrentIndex(todaysEntryIndex);
    }

    const timeoutId = setTimeout(() => {
      if (calorieCarouselRef.current && entries.length > todaysEntryIndex) {
        calorieCarouselRef.current.scrollTo({ index: todaysEntryIndex, animated: false });
      }
    }, 50);

    return () => clearTimeout(timeoutId);
  }, [diaryEntries.length]);


  const currentDiaryEntry = useMemo(() => {
    if (diaryEntries && diaryEntries.length > 0 && currentIndex < diaryEntries.length && currentIndex >= 0) {
      return diaryEntries[currentIndex];
    }
    return { date: new Date(), foodEntries: [] } as DiaryEntry;
  }, [diaryEntries, currentIndex]);

  useEffect(() => {
    if (currentDiaryEntry?.date) {
      const dateObj = new Date(currentDiaryEntry.date);
      if (!isNaN(dateObj.valueOf())) {
        const formattedDate = dateObj.toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric',
        });
        setHeaderDisplayDate(formattedDate);
      } else {
        setHeaderDisplayDate('Date');
      }
    } else {
      setHeaderDisplayDate(null);
    }
  }, [currentDiaryEntry?.date, setHeaderDisplayDate]);

  const changeDate = useCallback((amount: number) => {
    const newIndex = currentIndex + amount;
    if (calorieCarouselRef.current && newIndex >= 0 && newIndex < diaryEntries.length) {
      calorieCarouselRef.current.scrollTo({ index: newIndex });
    }
  }, [currentIndex, diaryEntries.length]);

  const isCurrentDateToday = useMemo(() => {
    if (!currentDiaryEntry?.date) return true;
    const today = new Date();
    const currentDate = new Date(currentDiaryEntry.date);
    return isSameDate(currentDate, today);
  }, [currentDiaryEntry?.date]);

  const isNextDayButtonDisabled = useMemo(() => {
    return isCurrentDateToday || currentIndex >= diaryEntries.length - 1;
  }, [isCurrentDateToday, currentIndex, diaryEntries.length]);

  const dateDisplayText = useMemo(() => {
    if (isCurrentDateToday) {
      return t('home.today', 'Today');
    }
    const date = new Date(currentDiaryEntry.date);
    return date.toLocaleDateString(undefined, {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  }, [isCurrentDateToday, currentDiaryEntry.date, t]);

  const currentFoodEntries = useMemo(() => {
    return currentDiaryEntry?.foodEntries || [];
  }, [currentDiaryEntry]);

  const renderFoodCard = useCallback(({ item }: { item: any }) => {
    return (
      <Card
        foodCalories={item.protein * 4 + item.carbs * 4 + item.fat * 9}
        quantity={item.quantity}
        foodName={item.foodName}
        entryId={item.entryId}
        metrics={item.metrics}
        hideIcons={false}
        id={item.id}
      />
    );
  }, []);

  const keyExtractor = useCallback((item: any, index: number) => item.entryId || `food-${index}`, []);

  const ListEmpty = useMemo(() => {
    return (
      <View style={styles.emptyListContainer}>
        <Text style={[styles.emptyListText, themeTextStyle]}>
          {t('food.noFoodTrackedToday')}
        </Text>
      </View>
    );
  }, [themeTextStyle, t]);

  const renderCalorieOverviewItem = useCallback(({ item: diaryEntry }: { item: DiaryEntry }) => {
    const macros = diaryEntry.foodEntries.reduce(
      (acc, food) => {
        acc.calories += Number(food.calories) || 0;
        acc.protein += Number(food.protein) || 0;
        acc.carbs += Number(food.carbs) || 0;
        acc.fat += Number(food.fat) || 0;
        return acc;
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );

    return (
      <View style={styles.calorieOverviewSlide}>
        <CalorieOverview
          calories={Math.round(macros.calories)}
          carbs={Math.round(macros.carbs)}
          carbsGoal={carbsGoal}
          fat={Math.round(macros.fat)}
          fatGoal={fatGoal}
          protein={Math.round(macros.protein)}
          proteinGoal={proteinGoal}
        />
      </View>
    );
  }, [carbsGoal, fatGoal, proteinGoal]);

  const carouselDisplayData = useMemo(() => {
    if (diaryEntries.length > 0) {
      return diaryEntries;
    }
    return [{ date: new Date(), foodEntries: [] } as DiaryEntry];
  }, [diaryEntries]);

  return (
    <View style={[styles.container, { paddingTop: headerHeight }]}>
      <View style={styles.dateSelector}>
        <TouchableOpacity onPress={() => changeDate(-1)} style={styles.dateButton} disabled={currentIndex <= 0}>
          <SymbolView name="chevron.left" tintColor={currentIndex <= 0 ? '#555' : (isDarkMode ? 'white' : 'black')} />
        </TouchableOpacity>
        <Text style={[styles.dateText, themeTextStyle]}>
          {dateDisplayText}
        </Text>
        <TouchableOpacity onPress={() => changeDate(1)} style={styles.dateButton} disabled={isNextDayButtonDisabled}>
          <SymbolView name="chevron.right" tintColor={isNextDayButtonDisabled ? '#555' : (isDarkMode ? 'white' : 'black')} />
        </TouchableOpacity>
      </View>

      <Carousel
        key={carouselDisplayData.length}
        ref={calorieCarouselRef}
        loop={false}
        width={windowWidth}
        height={styles.calorieOverviewSlide.height}
        autoPlay={false}
        data={carouselDisplayData}
        scrollAnimationDuration={300}
        onSnapToItem={(index) => {
          if (index >= 0 && index < carouselDisplayData.length) {
            setCurrentIndex(index);
          }
        }}
        renderItem={renderCalorieOverviewItem}
        defaultIndex={currentIndex}
        style={styles.calorieCarousel}
        enabled={carouselDisplayData.length > 1}
      />

      <View style={styles.listContentContainer}>
        <FlatList
          data={currentFoodEntries}
          renderItem={renderFoodCard}
          keyExtractor={keyExtractor}
          ListEmptyComponent={ListEmpty}
          contentContainerStyle={styles.flatListContentContainer}
          showsVerticalScrollIndicator={false}
        />
      </View>

      <TouchableOpacity
        activeOpacity={0.8}
        onPressIn={() => setIsPressed(true)}
        onPressOut={() => setIsPressed(false)}
        onPress={() => router.navigate('/ai-scanner')}
        style={[
          styles.fabBase,
          { transform: [{ scale: isPressed ? 0.95 : 1.1 }] },
        ]}
      >
        <LinearGradient
          colors={['#ff6b6b', '#ef5a3c']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <View style={styles.innerCircle}>
            {Platform.OS === 'ios' ? (
              <SymbolView
                name="sparkles"
                tintColor="white"
                type="hierarchical"
                size={30}
              />
            ) : (
              <MaterialCommunityIcons
                name={'creation'}
                color="white"
                size={30}
              />
            )}
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  lightThemeText: {
    color: '#333333',
  },
  darkThemeText: {
    color: '#E0E0E0',
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  dateButton: {
    padding: 10,
  },
  dateText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  calorieCarousel: {
    width: windowWidth,
  },
  calorieOverviewSlide: {
    width: windowWidth,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  listContentContainer: {
    flex: 1,
    width: '100%',
    marginTop: 5,
    paddingHorizontal: 10,
  },
  flatListContentContainer: {
    paddingBottom: 140,
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
    paddingHorizontal: 20,
  },
  emptyListText: {
    fontSize: 16,
    textAlign: 'center',
  },
  fabBase: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 40 : 30,
    right: 20,
    shadowColor: '#ff6b6b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 8,
  },
  gradient: {
    borderRadius: 35,
    padding: 3,
  },
  innerCircle: {
    backgroundColor: 'transparent',
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

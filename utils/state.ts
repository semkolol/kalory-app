import { getLocales } from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import * as Crypto from 'expo-crypto';
import { useProgressStore } from './progressState';

export interface AIProvider {
  id: string; // the actual model name for the API call
  name: string; // the display name for the provider (e.g. "OpenAI")
  modelName: string; // the display name for the model (e.g., "ChatGPT / GPT-4.1")
  provider: 'openai' | 'google';
  requiresKey: boolean;
}

export const AI_PROVIDERS: AIProvider[] = [
  { id: 'gpt-4o', name: 'OpenAI', modelName: 'ChatGPT / GPT-4o ($)', provider: 'openai', requiresKey: true },
  { id: 'gpt-4.1', name: 'OpenAI', modelName: 'ChatGPT / GPT-4.1 ($$)', provider: 'openai', requiresKey: true },
  { id: 'gemini-2.0-flash-lite', name: 'Google', modelName: 'Gemini 2.0 Flash Lite ($)', provider: 'google', requiresKey: true },
  { id: 'gemini-2.0-flash', name: 'Google', modelName: 'Gemini 2.0 Flash ($)', provider: 'google', requiresKey: true },
  { id: 'gemini-2.5-flash-lite', name: 'Google', modelName: 'Gemini 2.5 Flash Lite ($)', provider: 'google', requiresKey: true },
  { id: 'gemini-2.5-flash', name: 'Google', modelName: 'Gemini 2.5 Flash ($$)', provider: 'google', requiresKey: true },
  { id: 'gemini-2.5-pro', name: 'Google', modelName: 'Gemini 2.5 Pro ($$$)', provider: 'google', requiresKey: true },
];

export type Diary = {
  diaryEntries: DiaryEntry[]
  addDiary: (entry: DiaryEntry) => void
  removeDiaryEntry: () => void
  removeAllEntries: () => void
  addFood: (food: Food) => void
  removeFood: (entryId: string) => void
  updateFood: (entryId: string, newQuantityValue: number) => void
  getEntryDate: () => Date
  getCalories: () => number
  getProtein: () => number
  getCarbs: () => number
  getFat: () => number
  createSnapshotsForPastEntries: () => void;
}

export type DiaryEntry = {
  date: Date
  foodEntries: Food[]
}

export type Food = {
  barcode: string
  id: string
  foodName: string
  calories: number
  protein: number
  carbs: number
  fat: number
  quantity: number
  metrics: string
  entryId?: string
}

export interface FoodDatabaseItem {
  id: string;
  foodName: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  metrics: 'g' | 'ml';
}

export type FoodDatabase = {
  foodItems: FoodDatabaseItem[];
  addFoodToDatabase: (food: Omit<FoodDatabaseItem, 'id'>) => FoodDatabaseItem;
  updateFoodInDatabase: (foodId: string, updates: Partial<Omit<FoodDatabaseItem, 'id'>>) => void;
  removeFoodFromDatabase: (foodId: string) => void;
  findFoodById: (foodId: string) => FoodDatabaseItem | undefined;
  searchFoodInDatabase: (searchTerm: string) => FoodDatabaseItem[];
};


type GoalType = 'loseWeight' | 'maintainWeight' | 'gainWeight' | null;
type GenderType = 'male' | 'female' | null;
type ActivityType = 'low' | 'medium' | 'high' | null;
type BodyType = 'skinny' | 'neutral' | 'fat' | null;

export type Goals = {
  proteinGoal: number;
  carbsGoal: number;
  fatGoal: number;
  weightGoal: number | null;
  weightCurrent: number | null;
  height: number | null;
  age: number | null;
  goalType: GoalType;
  gender: GenderType;
  activityLevel: ActivityType;
  bodyType: BodyType;

  setProteinGoal: (protein: number) => void;
  setCarbsGoal: (carbs: number) => void;
  setFatGoal: (fat: number) => void;
  setWeightGoal: (weight: number | null) => void;
  setWeightCurrent: (weight: number | null) => void;
  setHeight: (heightInput: number | null) => void;
  setAge: (ageInput: number | null) => void;
  setGoalType: (goal: GoalType) => void;
  setGender: (gender: GenderType) => void;
  setActivityLevel: (activity: ActivityType) => void;
  setBodyType: (type: BodyType) => void;

  calculateAndSetMacros: () => void;
}

export type Barcode = {
  barcodeCode: string
  setBarcodeCode: (barcode: string) => void
}

export type Language = "en" | "de" | "fr" | "it" | "jp" | "zh" | null;
export type Config = {
  version: number
  darkMode?: boolean
  completedOnboarding: boolean
  currentOnboardingScreen: number
  streak: number
  longestStreak: number
  language: Language
  cameraPermissions: boolean
  notificationsEnabled: boolean
  notificationHour: number
  notificationsPermission: boolean
  trialStartDate: Date | null
  isPro: boolean
  selectedProvider: string;
  apiKey: string; // the "active" key for the rest of the app
  apiKeys: { [providerId: string]: string }; // stores all keys, e.g., { openai: "sk-...", google: "..." } etc.
  headerDisplayDate: string | null;
  setSelectedProvider: (providerId: string) => void;
  setProviderApiKey: (providerId: string, key: string) => void;
  toggleDarkMode: () => void
  setCompletedOnboarding: (completed: boolean) => void
  setCurrentOnboardingScreen: (index: number) => void
  setStreak: (str: number) => void
  setLongestStreak: (longestStr: number) => void
  setLanguage: (lang: Language) => void
  setCameraPermissions: (perm: boolean) => void
  toggleNotificationsEnabled: () => void
  setNotificationHour: (hour: number) => void
  setTrialStartDate: (date: Date) => void
  clearTrialStartDate: () => void
  setHeaderDisplayDate: (date: string | null) => void;
  setIsPro: (isPro: boolean) => void;
}

export const useFoodDatabaseStore = create(
  persist<FoodDatabase>(
    (set, get) => ({
      foodItems: [],
      addFoodToDatabase: (foodData) => {
        const newFoodItem: FoodDatabaseItem = {
          ...foodData,
          id: `db_food_${Crypto.randomUUID()}`, // generate unique ID for scanned food
        };
        set((state) => ({
          foodItems: [...state.foodItems, newFoodItem],
        }));
        console.log('Added to food database:', newFoodItem);
        return newFoodItem;
      },
      updateFoodInDatabase: (foodId, updates) =>
        set((state) => ({
          foodItems: state.foodItems.map((item) =>
            item.id === foodId ? { ...item, ...updates } : item
          ),
        })),
      removeFoodFromDatabase: (foodId) =>
        set((state) => ({
          foodItems: state.foodItems.filter((item) => item.id !== foodId),
        })),
      findFoodById: (foodId) => {
        return get().foodItems.find(item => item.id === foodId);
      },
      searchFoodInDatabase: (searchTerm) => {
        if (!searchTerm.trim()) return [];
        const lowerSearchTerm = searchTerm.toLowerCase();
        return get().foodItems.filter((item) =>
          item.foodName.toLowerCase().includes(lowerSearchTerm)
        );
      },
    }),
    {
      name: 'food-database-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export const useDiaryStore = create(
  persist<Diary>(
    (set, get) => ({
      diaryEntries: [{
        date: new Date(),
        foodEntries: [],
      }],
      addDiary: (entry: DiaryEntry) => {
        const updatedDiaryEntries = [...get().diaryEntries, entry];
        set({ diaryEntries: updatedDiaryEntries });
      },
      removeDiaryEntry: () => { get().diaryEntries.splice(0) },
      removeAllEntries: () => { get().diaryEntries.splice(0, get().diaryEntries.length) },
      addFood: (food: Food) => {
        const lastIndex = get().diaryEntries.length - 1;
        const updatedFoodEntries = [
          food,
          ...get().diaryEntries[lastIndex].foodEntries,
        ];
        const updatedDiaryEntries = [...get().diaryEntries];
        updatedDiaryEntries[lastIndex] = {
          ...updatedDiaryEntries[lastIndex],
          foodEntries: updatedFoodEntries,
        };
        set({ diaryEntries: updatedDiaryEntries });
      },
      removeFood: (entryId: string) => set((state) => ({
        diaryEntries: state.diaryEntries.map(day => {
          if (day.foodEntries.some(food => food.entryId === entryId)) {
            return {
              ...day,
              foodEntries: day.foodEntries.filter(food => food.entryId !== entryId),
            };
          }
          return day;
        }),
      })),
      updateFood: (entryId: string, newQuantityValue: number) => set((state) => {
        const updatedDiaryEntries = state.diaryEntries.map(entry => {
          // Find the entry by its ID
          if (entry.foodEntries.some(foodEntry => foodEntry.entryId === entryId)) {
            // Update the quantity of the specific entry
            return {
              ...entry,
              foodEntries: entry.foodEntries.map(foodEntry => {
                let quantity: number = foodEntry.quantity
                let cal: number = foodEntry.calories
                let p: number = foodEntry.protein
                let c: number = foodEntry.carbs
                let f: number = foodEntry.fat

                if (foodEntry.entryId === entryId) {
                  let percentage: number = newQuantityValue / quantity
                  return {
                    ...foodEntry,
                    quantity: newQuantityValue,
                    calories: cal * percentage,
                    protein: p * percentage,
                    carbs: c * percentage,
                    fat: f * percentage
                  };
                }
                return foodEntry;
              })
            };
          }
          return entry;
        });

        return { ...state, diaryEntries: updatedDiaryEntries };
      }),
      getEntryDate: () => { return get().diaryEntries[get().diaryEntries.length - 1].date },
      getCalories: () => {
        const entries = get().diaryEntries;
        if (!entries || entries.length === 0) return 0;
        const lastEntry = entries[entries.length - 1];
        if (!lastEntry || !Array.isArray(lastEntry.foodEntries)) return 0;
        const totalCalories = lastEntry.foodEntries.reduce((total, food) => total + (Number(food.calories) || 0), 0);
        return Math.round(totalCalories);
      },
      getCarbs: () => {
        const entries = get().diaryEntries;
        if (!entries || entries.length === 0) return 0;
        const lastEntry = entries[entries.length - 1];
        if (!lastEntry || !Array.isArray(lastEntry.foodEntries)) return 0;
        const totalCarbs = lastEntry.foodEntries.reduce((total, food) => total + (Number(food.carbs) || 0), 0);
        return Math.round(totalCarbs);
      },
      getFat: () => {
        const entries = get().diaryEntries;
        if (!entries || entries.length === 0) return 0;
        const lastEntry = entries[entries.length - 1];
        if (!lastEntry || !Array.isArray(lastEntry.foodEntries)) return 0;
        const totalFat = lastEntry.foodEntries.reduce((total, food) => total + (Number(food.fat) || 0), 0);
        return Math.round(totalFat);
      },
      getProtein: () => {
        const entries = get().diaryEntries;
        if (!entries || entries.length === 0) return 0;
        const lastEntry = entries[entries.length - 1];
        if (!lastEntry || !Array.isArray(lastEntry.foodEntries)) return 0;
        const totalProtein = lastEntry.foodEntries.reduce((total, food) => total + (Number(food.protein) || 0), 0);
        return Math.round(totalProtein);
      },
      createSnapshotsForPastEntries: () => {
        const { diaryEntries } = get();
        const { addSnapshot } = useProgressStore.getState();
        const today = new Date().toISOString().split('T')[0];

        diaryEntries.forEach(entry => {
          const entryDate = new Date(entry.date).toISOString().split('T')[0];
          if (entryDate !== today) {
            const totalCalories = entry.foodEntries.reduce((total, food) => total + Number(food.calories), 0);
            addSnapshot({
              weight: useGoalsStore.getState().weightCurrent,
              calories: totalCalories,
            });
          }
        });
      },
    }),
    {
      name: 'diary-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
)

export const useGoalsStore = create(
  persist<Goals>(
    (set, get) => ({
      proteinGoal: 0,
      carbsGoal: 0,
      fatGoal: 0,
      weightGoal: null,
      weightCurrent: null,
      height: null,
      age: null,
      goalType: null,
      gender: null,
      activityLevel: null,
      bodyType: null,

      setProteinGoal: (protein) => set({ proteinGoal: protein }),
      setCarbsGoal: (carbs) => set({ carbsGoal: carbs }),
      setFatGoal: (fat) => set({ fatGoal: fat }),
      setWeightGoal: (weight) => set({ weightGoal: weight }),
      setWeightCurrent: (weight) => set({ weightCurrent: weight }),
      setHeight: (heightInput) => set({ height: heightInput }),
      setAge: (ageInput) => set({ age: ageInput }),
      setGoalType: (goal) => set({ goalType: goal }),
      setGender: (genderInput) => set({ gender: genderInput }),
      setActivityLevel: (activity) => set({ activityLevel: activity }),
      setBodyType: (type) => set({ bodyType: type }),

      calculateAndSetMacros: () => {
        const { gender, age, height, weightCurrent, goalType, activityLevel, bodyType } = get();

        if (!gender || !age || !height || !weightCurrent || !goalType || !activityLevel || !bodyType) {
          console.error("Cannot calculate macros because some user data is missing.", {
            gender, age, height, weightCurrent, goalType, activityLevel, bodyType
          });
          return;
        }

        let bodyFatPercentage = 0.15; // default to neutral
        if (bodyType === 'fat') {
          bodyFatPercentage = 0.3;
        } else if (bodyType === 'skinny') {
          bodyFatPercentage = 0.1;
        }

        const leanBodyMass = weightCurrent * (1 - bodyFatPercentage);

        let bmr = 0;
        if (gender === 'female') {
          // Mifflin-St Jeor Equation, but adjusted for LBM (Lean Body Mass)
          bmr = (10 * leanBodyMass) + (6.25 * height) - (5 * age) - 161;
        } else {
          bmr = (10 * leanBodyMass) + (6.25 * height) - (5 * age) + 5;
        }

        let activityMultiplier = 1.2; // Default to low
        if (activityLevel === 'medium') {
          activityMultiplier = 1.55;
        } else if (activityLevel === 'high') {
          activityMultiplier = 1.725;
        }

        let calories = bmr * activityMultiplier;

        if (goalType === 'gainWeight') {
          calories *= 1.2; // ~20% surplus
        } else if (goalType === 'loseWeight') {
          calories *= 0.8; // ~20% deficit
        }

        const carbsInCalories = calories * 0.4;
        const fatInCalories = calories * 0.3;
        const proteinInCalories = calories * 0.3;

        set({
          carbsGoal: Math.round(carbsInCalories / 4),
          fatGoal: Math.round(fatInCalories / 9),
          proteinGoal: Math.round(proteinInCalories / 4),
        });
      }
    }),
    {
      name: 'goals-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
)

export const useBarcodeCodeStore = create(
  persist<Barcode>(
    (set, get) => ({
      barcodeCode: '',
      setBarcodeCode: (barcode: string) => set({ barcodeCode: barcode })
    }),
    {
      name: 'barcode-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
)

const supportedLanguages: Language[] = ["en", "de", "fr", "it", "jp", "zh"];

const getInitialLanguage = (): Language => {
  const deviceLanguage = getLocales()[0]?.languageCode;
  return supportedLanguages.includes(deviceLanguage as Language) ? deviceLanguage : 'en';
};

// user settings
export const useConfigStore = create(
  persist<Config>(
    (set, get) => ({
      version: 0,
      darkMode: undefined,
      completedOnboarding: false,
      currentOnboardingScreen: 0,
      streak: 0,
      longestStreak: 0,
      language: getInitialLanguage(),
      cameraPermissions: false,
      notificationsEnabled: false,
      notificationsPermission: false,
      notificationHour: 0,
      trialStartDate: null,
      isPro: false,
      selectedProvider: "openai",
      apiKeys: {},
      // the active apiKey is initialized based on the default selectedProvider and stored keys
      apiKey: (get()?.apiKeys?.[get()?.selectedProvider] || ""),
      headerDisplayDate: null,

      setSelectedProvider: (providerId: string) => {
        const state = get();
        const newActiveApiKey = state.apiKeys[providerId] || '';
        set({
          selectedProvider: providerId,
          apiKey: newActiveApiKey,
        });
      },

      setProviderApiKey: (providerId: string, key: string) => {
        set((state) => ({
          apiKeys: {
            ...state.apiKeys,
            [providerId]: key,
          },
        }));
        if (get().selectedProvider === providerId) {
          set({ apiKey: key });
        }
      },
      toggleDarkMode: () => set({ darkMode: get().darkMode ? false : true }),
      setCompletedOnboarding: (completed) => set({ completedOnboarding: completed }),
      setCurrentOnboardingScreen: (index) => set({ currentOnboardingScreen: index }),
      setStreak: (str) => set({ streak: str }),
      setLongestStreak: (longestStr) => set({ longestStreak: longestStr }),
      setLanguage: (lang: Language) => set({ language: lang }),
      setCameraPermissions: (perm: boolean) => set({ cameraPermissions: perm }),
      toggleNotificationsEnabled: () => set((state) => ({ notificationsEnabled: !state.notificationsEnabled })),
      setNotificationHour: (hour: number) => set({ notificationHour: hour }),
      setTrialStartDate: (date: Date) => set({ trialStartDate: date }),
      clearTrialStartDate: () => set({ trialStartDate: null }),
      setHeaderDisplayDate: (date: string | null) => set({ headerDisplayDate: date }),
      setIsPro: (isPro: boolean) => set({ isPro }),
    }),
    {
      name: 'config-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          if (typeof state.trialStartDate === 'string') {
            state.trialStartDate = new Date(state.trialStartDate);
          }
        }
      }
    },
  ),
)
import React, { useState, useMemo } from 'react';
import {
  useColorScheme,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  View,
  Text,
  Modal,
  TextInput,
  Button,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useProgressStore } from '../../utils/progressState';
import { useGoalsStore, useDiaryStore } from '../../utils/state';
import { LineGraph } from 'react-native-graph';
import { useTranslation } from '@/i18n';
import { useHeaderHeight } from '@react-navigation/elements';
import { SymbolView } from 'expo-symbols';

type TimeRange = '7D' | '30D' | '90D';
type EditableField = 'weight' | 'protein' | 'carbs' | 'fat';

export default function ProgressScreen() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const { t } = useTranslation();
  const headerHeight = useHeaderHeight();

  const [timeRange, setTimeRange] = useState<TimeRange>('7D');

  const { snapshots, addSnapshot } = useProgressStore();
  const {
    weightCurrent,
    proteinGoal,
    carbsGoal,
    fatGoal,
    setWeightCurrent,
    setProteinGoal,
    setCarbsGoal,
    setFatGoal,
  } = useGoalsStore();
  const { getCalories } = useDiaryStore();

  const [modalVisible, setModalVisible] = useState(false);
  const [editingField, setEditingField] = useState<EditableField | null>(null);
  const [inputValue, setInputValue] = useState('');

  const data = useMemo(() => {
    const safeSnapshots = Array.isArray(snapshots) ? snapshots : [];
    const now = new Date();
    const days = timeRange === '7D' ? 7 : timeRange === '30D' ? 30 : 90;
    const filteredSnapshots = safeSnapshots.filter(s => {
      if (!s || !s.date) return false;
      const date = new Date(s.date);
      const diff = now.getTime() - date.getTime();
      return diff / (1000 * 3600 * 24) <= days;
    });

    return {
      weight: filteredSnapshots.map(s => ({ date: new Date(s.date), value: s.weight || 0 })),
    };
  }, [snapshots, timeRange]);

  const totalCalorieGoal = useMemo(() => {
    const proteinCalories = (proteinGoal || 0) * 4;
    const carbsCalories = (carbsGoal || 0) * 4;
    const fatCalories = (fatGoal || 0) * 9;
    return Math.round(proteinCalories + carbsCalories + fatCalories);
  }, [proteinGoal, carbsGoal, fatGoal]);

  const handleOpenModal = (field: EditableField, currentValue: number | null) => {
    setEditingField(field);
    setInputValue(currentValue?.toString() || '');
    setModalVisible(true);
  };

  const handleSaveChanges = () => {
    const numericValue = parseFloat(inputValue);
    if (isNaN(numericValue) || !editingField) return;

    switch (editingField) {
      case 'weight':
        setWeightCurrent(numericValue);
        addSnapshot({ weight: numericValue, calories: getCalories() });
        break;
      case 'protein':
        setProteinGoal(numericValue);
        break;
      case 'carbs':
        setCarbsGoal(numericValue);
        break;
      case 'fat':
        setFatGoal(numericValue);
        break;
    }
    setModalVisible(false);
    setInputValue('');
  };

  const getUnitForField = (field: EditableField | null) => {
    switch (field) {
      case 'weight':
        return 'kg';
      case 'protein':
      case 'carbs':
      case 'fat':
        return 'g';
      default:
        return '';
    }
  };

  const renderChart = (title: string, chartData: { date: Date; value: number }[]) => {
    const color = isDarkMode ? '#FFFFFF' : '#000000';
    const gradientFill = isDarkMode ? ['#FFFFFF', '#000000'] : ['#000000', '#FFFFFF'];

    if (chartData.length === 0) {
      return (
        <View style={styles.chartContainer}>
          <Text style={[styles.chartTitle, { color: isDarkMode ? '#FFF' : '#000' }]}>{title}</Text>
          <View style={[styles.graph, styles.emptyGraph, { backgroundColor: isDarkMode ? '#2c2c2e' : '#f0f0f0' }]}>
            <Text style={{ color: isDarkMode ? '#777' : '#999' }}>
              {t('progress.noData', 'No data available for this period.')}
            </Text>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.chartContainer}>
        <Text style={[styles.chartTitle, { color: isDarkMode ? '#FFF' : '#000' }]}>{title}</Text>
        <LineGraph
          style={styles.graph}
          color={color}
          gradientFillColors={gradientFill}
          enablePanGesture
          enableIndicator
          indicatorPulsating
        />
      </View>
    );
  };

  const styles = getStyles(isDarkMode);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={[styles.container, { paddingTop: headerHeight }]}>
        {/* <View style={styles.timeRangeSelector}>
          {(['7D', '30D', '90D'] as TimeRange[]).map(range => (
            <TouchableOpacity
              key={range}
              style={[
                styles.timeRangeButton,
                timeRange === range && styles.timeRangeButtonActive,
              ]}
              onPress={() => setTimeRange(range)}
            >
              <Text style={[styles.timeRangeButtonText, timeRange === range && styles.timeRangeButtonTextActive]}>{range}</Text>
            </TouchableOpacity>
          ))}
        </View> */}

        {/* {renderChart(t('food.weightGoals'), data.weight)} */}

        <View style={styles.goalsContainer}>
          <Text style={styles.goalsTitle}>{t('progress.currentGoals')}</Text>
          <View style={styles.goalRow}>
            <GoalDisplay
              label={t('food.currentWeight', 'Current Weight')}
              value={`${weightCurrent || 0} kg`}
              onPress={() => handleOpenModal('weight', weightCurrent)}
              isDarkMode={isDarkMode}
            />
          </View>
          <View style={styles.goalRow}>
            <StaticGoalDisplay
              label={t('progress.totalCalories', 'Total Calories')}
              value={`${totalCalorieGoal} kcal`}
              isDarkMode={isDarkMode}
            />
          </View>
          <View style={styles.goalRow}>
            <GoalDisplay
              label={t('food.protein', 'Protein')}
              value={`${proteinGoal}g`}
              onPress={() => handleOpenModal('protein', proteinGoal)}
              isDarkMode={isDarkMode}
            />
            <GoalDisplay
              label={t('food.carbs', 'Carbs')}
              value={`${carbsGoal}g`}
              onPress={() => handleOpenModal('carbs', carbsGoal)}
              isDarkMode={isDarkMode}
            />
            <GoalDisplay
              label={t('food.fat', 'Fat')}
              value={`${fatGoal}g`}
              onPress={() => handleOpenModal('fat', fatGoal)}
              isDarkMode={isDarkMode}
            />
          </View>
        </View>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t('progress.updateGoal', 'Update')} {editingField}</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                keyboardType="numeric"
                value={inputValue}
                onChangeText={setInputValue}
                autoFocus
              />
              <Text style={styles.inputUnit}>{getUnitForField(editingField)}</Text>
            </View>
            <View style={styles.modalButtonContainer}>
              <Button title={t('common.cancel', 'Cancel')} onPress={() => setModalVisible(false)} color={isDarkMode ? '#FF3B30' : '#FF3B30'} />
              <Button title={t('common.save', 'Save')} onPress={handleSaveChanges} />
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const GoalDisplay = ({ label, value, onPress, isDarkMode }: { label: string, value: string, onPress: () => void, isDarkMode: boolean }) => {
  const styles = getStyles(isDarkMode);
  return (
    <TouchableOpacity style={styles.goalBox} onPress={onPress}>
      <View>
        <Text style={styles.goalLabel}>{label}</Text>
        <Text style={styles.goalValue}>{value}</Text>
      </View>
      <SymbolView name="pencil" tintColor={isDarkMode ? '#777' : '#A1A1AA'} size={18} />
    </TouchableOpacity>
  );
};

const StaticGoalDisplay = ({ label, value, isDarkMode }: { label: string, value: string, isDarkMode: boolean }) => {
  const styles = getStyles(isDarkMode);
  return (
    <View style={styles.goalBox}>
      <View>
        <Text style={styles.goalLabel}>{label}</Text>
        <Text style={styles.goalValue}>{value}</Text>
      </View>
    </View>
  );
};

const getStyles = (isDarkMode: boolean) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: isDarkMode ? '#000' : '#F3F4F6',
  },
  container: {
    flex: 1,
    paddingHorizontal: 15,
  },
  timeRangeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderRadius: 10,
    padding: 4,
    marginVertical: 20,
    backgroundColor: isDarkMode ? '#1C1C1E' : '#EFEFF4',
  },
  timeRangeButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeRangeButtonActive: {
    backgroundColor: isDarkMode ? '#fc3b14' : '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  timeRangeButtonText: {
    fontWeight: '600',
    fontSize: 14,
    color: isDarkMode ? '#FFF' : '#000',
  },
  timeRangeButtonTextActive: {
    color: isDarkMode ? '#FFF' : '#000',
    fontWeight: 'bold',
  },
  chartContainer: {
    marginBottom: 25,
  },
  chartTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: isDarkMode ? '#FFF' : '#000',
  },
  graph: {
    height: 200,
  },
  emptyGraph: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: isDarkMode ? '#2c2c2e' : '#f0f0f0',
  },
  goalsContainer: {
    marginTop: 10,
    marginBottom: 40,
  },
  goalsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: isDarkMode ? '#FFF' : '#000',
  },
  goalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  goalBox: {
    backgroundColor: isDarkMode ? '#1C1C1E' : '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    flex: 1,
    marginHorizontal: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  goalLabel: {
    color: isDarkMode ? '#A1A1AA' : '#6B7280',
    fontSize: 14,
    marginBottom: 5,
  },
  goalValue: {
    color: isDarkMode ? '#FFF' : '#000',
    fontSize: 18,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContent: {
    width: '85%',
    backgroundColor: isDarkMode ? '#2C2C2E' : '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: isDarkMode ? '#FFF' : '#000',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: isDarkMode ? '#555' : '#CCC',
    marginBottom: 20,
  },
  textInput: {
    fontSize: 22,
    paddingVertical: 10,
    color: isDarkMode ? '#FFF' : '#000',
    minWidth: 80,
    textAlign: 'center',
  },
  inputUnit: {
    fontSize: 18,
    color: isDarkMode ? '#A1A1AA' : '#6B7280',
    marginLeft: 10,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
});

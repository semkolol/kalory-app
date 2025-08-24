import React, { useState, useCallback, useMemo } from 'react';
import {
  Text,
  StyleSheet,
  View,
  useColorScheme,
  Pressable,
  Modal,
  Button,
  TextInput,
  Platform,
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useDiaryStore } from '../utils/state';
import { Controller, useForm } from 'react-hook-form';
import { useFocusEffect } from '@react-navigation/native';
import { SymbolView } from 'expo-symbols';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useTranslation } from '@/i18n';

type FoodCardProps = {
  foodName: string;
  foodCalories: number;
  id: string;
  hideIcons: boolean;
  protein?: number;
  carbs?: number;
  fat?: number;
  metrics?: string;
  entryId?: string;
  quantity?: number;
};

function Card({
  foodName,
  foodCalories,
  id,
  hideIcons,
  protein = 0,
  carbs = 0,
  fat = 0,
  metrics = 'g',
  entryId,
  quantity = 100,
}: FoodCardProps) {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const { t } = useTranslation();

  const themeTextStyle =
    colorScheme === 'light' ? styles.lightThemeText : styles.darkThemeText;
  const themeContainerStyle =
    colorScheme === 'light' ? styles.lightContainer : styles.darkContainer;
  const iconTintColor = colorScheme === 'light' ? '#4A4A4A' : '#BDBDBD';

  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const { control, watch, reset, handleSubmit } = useForm({
    defaultValues: { newQuantity: quantity },
  });
  const newQuantityValue = watch('newQuantity');

  const { removeFood, updateFood } = useDiaryStore();

  const goToFoodDetails = useCallback(() => {
    if (id) {
      router.push(`/food/${id}`);
    }
  }, [router, id]);

  const handleEditSubmit = useCallback((data: { newQuantity: number }) => {
    updateFood(entryId as string, data.newQuantity);
    setModalVisible(false);
  }, [entryId, updateFood, setModalVisible]);

  const handleCancelEdit = useCallback(() => {
    reset({ newQuantity: quantity });
    setModalVisible(false);
  }, [setModalVisible, quantity, reset]);

  useFocusEffect(
    useCallback(() => {
      reset({ newQuantity: quantity });
    }, [quantity, reset])
  );

  const modalContent = useMemo(
    () => (
      <View style={styles.centeredModalView}>
        <View
          style={[
            styles.modalView,
            { backgroundColor: colorScheme === 'light' ? '#f9f9f9' : '#282828' },
          ]}
        >
          <Text style={[styles.modalTitle, themeTextStyle]}>
            {t('food.editQuantity')} ({metrics})
          </Text>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                onBlur={onBlur}
                placeholder={String(quantity)}
                placeholderTextColor={
                  colorScheme === 'light' ? '#a0a0a0' : '#707070'
                }
                style={[
                  styles.modalTextInput,
                  colorScheme === 'light'
                    ? styles.lightTextInputOverride
                    : styles.darkTextInputOverride,
                  themeTextStyle,
                ]}
                onChangeText={(text) => onChange(Number(text) || 0)}
                value={value?.toString() || ''}
                keyboardType="numeric"
                autoFocus
              />
            )}
            name="newQuantity"
            rules={{ required: true, min: 0 }}
          />
          <View style={styles.modalActionsContainer}>
            <Button title={t('common.save')} onPress={handleSubmit(handleEditSubmit)} />
            <Button title={t('common.cancel')} color={'#FF6347'} onPress={handleCancelEdit} />
          </View>
        </View>
      </View>
    ),
    [
      colorScheme,
      themeTextStyle,
      metrics,
      control,
      quantity,
      handleSubmit,
      handleEditSubmit,
      handleCancelEdit,
    ]
  );

  const foodInfoSection = (
    <View style={styles.foodInfoContent}>
      <Text style={[styles.foodName, themeTextStyle]} numberOfLines={1}>
        {foodName.length < 22 ? foodName : `${foodName.substring(0, 20)}...`},{' '}
        {quantity}
        {metrics}
      </Text>
      <Text style={[styles.foodCalories, themeTextStyle]}>
        {Math.round(foodCalories)} {t('food.calories')}
      </Text>
    </View>
  );

  const actionsSection = (
    <View style={styles.actionsContainer}>
      {hideIcons ? (
        <View style={styles.macrosContainer}>
          <Text style={[styles.macroText, themeTextStyle]}>{protein}g {t('food.protein')}</Text>
          <Text style={[styles.macroText, themeTextStyle]}>{carbs}g {t('food.carbs')}</Text>
          <Text style={[styles.macroText, themeTextStyle]}>{fat}g {t('food.fat')}</Text>
        </View>
      ) : (
        <>
          <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(false);
              reset({ newQuantity: quantity });
            }}
          >
            {modalContent}
          </Modal>
          <Pressable
            onPress={() => setModalVisible(true)}
            style={styles.iconButton}
            hitSlop={10}
          >
            {Platform.OS === 'ios' ? (
              <SymbolView
                name="pencil"
                tintColor={iconTintColor}
                type="hierarchical"
                size={22}
              />
            ) : (
              <MaterialCommunityIcons
                name="pencil-outline"
                color={iconTintColor}
                size={24}
              />
            )}
          </Pressable>

          <Pressable
            onPress={goToFoodDetails}
            style={styles.iconButton}
            hitSlop={10}
            disabled={!id}
          >
            {Platform.OS === 'ios' ? (
              <SymbolView
                name="plus.circle"
                tintColor={iconTintColor}
                type="hierarchical"
                size={22}
              />
            ) : (
              <MaterialCommunityIcons
                name="plus-circle-outline"
                color={iconTintColor}
                size={24}
              />
            )}
          </Pressable>

          <Pressable
            onPress={() => (entryId ? removeFood(entryId) : undefined)}
            style={styles.iconButton}
            hitSlop={10}
            disabled={!entryId}
          >
            {Platform.OS === 'ios' ? (
              <SymbolView
                name="trash"
                tintColor={iconTintColor}
                type="hierarchical"
                size={22}
              />
            ) : (
              <MaterialCommunityIcons
                name="trash-can-outline"
                color={iconTintColor}
                size={24}
              />
            )}
          </Pressable>
        </>
      )}
    </View>
  );

  const isLinkable = !!id;

  return (
    <View style={[styles.cardContainer, themeContainerStyle]}>
      {isLinkable ? (
        <Link href={{ pathname: `/food/${id}` }} style={styles.foodInfoLinkArea} asChild>
          <Pressable>{foodInfoSection}</Pressable>
        </Link>
      ) : (
        <View style={styles.foodInfoLinkArea}>{foodInfoSection}</View>
      )}
      {actionsSection}
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 16,
    width: '100%',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  foodInfoLinkArea: {
    flex: 1,
    marginRight: 12,
  },
  foodInfoContent: {
  },
  foodName: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 3,
  },
  foodCalories: {
    fontSize: 14,
    fontWeight: '400',
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconButton: {
    padding: 4,
  },
  macrosContainer: {
    alignItems: 'flex-start',
  },
  macroText: {
    fontSize: 13,
    fontWeight: '300',
    lineHeight: 18,
  },
  // Modal Styles
  centeredModalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 20,
    borderRadius: 15,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '85%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
  },
  modalTextInput: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
  },
  lightTextInputOverride: {
    backgroundColor: '#fff',
    borderColor: '#e0e0e0',
  },
  darkTextInputOverride: {
    backgroundColor: '#3a3a3a',
    borderColor: '#505050',
  },
  modalActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 10,
  },
  lightContainer: {
    backgroundColor: '#FFFFFF',
  },
  darkContainer: {
    backgroundColor: '#1E1E1E',
  },
  lightThemeText: {
    color: '#121212',
  },
  darkThemeText: {
    color: '#E0E0E0',
  },
});

export default React.memo(Card);
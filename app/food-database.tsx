import React, { useCallback, useState, useLayoutEffect } from 'react';
import {
    StyleSheet,
    Pressable,
    useColorScheme,
    SafeAreaView,
    Platform,
    FlatList,
    Alert,
} from 'react-native';
import { useNavigation } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useFoodDatabaseStore, FoodDatabaseItem } from '@/utils/state';
import { SymbolView } from 'expo-symbols';
import { View, Text } from '@/components/Themed';
import FoodFormModal from '@/components/FoodFormModal';
import { useTranslation } from '@/i18n';

export default function FoodDatabase() {
    const navigation = useNavigation();
    const colorScheme = useColorScheme();
    const isDarkMode = colorScheme === 'dark';
    const { t } = useTranslation();

    const foodItems = useFoodDatabaseStore((state) => state.foodItems);
    const removeFoodFromDatabase = useFoodDatabaseStore((state) => state.removeFoodFromDatabase);
    const addFoodToDatabase = useFoodDatabaseStore((state) => state.addFoodToDatabase);
    const updateFoodInDatabase = useFoodDatabaseStore((state) => state.updateFoodInDatabase);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingItem, setEditingItem] = useState<FoodDatabaseItem | null>(null);

    const iconMap = {
        'plus': 'plus' as const,
        'trash': 'trash-can-outline' as const,
        'archivebox': 'archive-outline' as const,
    };

    const handleOpenAddModal = () => {
        setEditingItem(null);
        setIsModalVisible(true);
    };

    const handleOpenEditModal = (item: FoodDatabaseItem) => {
        setEditingItem(item);
        setIsModalVisible(true);
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
        setEditingItem(null);
    };

    const handleSaveFood = (data: Omit<FoodDatabaseItem, 'id'>) => {
        if (editingItem) {
            updateFoodInDatabase(editingItem.id, data);
        } else {
            addFoodToDatabase(data);
        }
        handleCloseModal();
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Pressable onPress={handleOpenAddModal} hitSlop={10} style={{ paddingRight: Platform.OS === 'ios' ? 0 : 10 }}>
                    {Platform.OS === 'ios' ? (
                        <SymbolView
                            name="plus"
                            size={22}
                            tintColor={isDarkMode ? '#0A84FF' : '#007AFF'}
                        />
                    ) : (
                        <MaterialCommunityIcons
                            name={iconMap.plus}
                            size={26}
                            color={isDarkMode ? '#0A84FF' : '#007AFF'}
                        />
                    )}
                </Pressable>
            ),
        });
    }, [navigation, isDarkMode, handleOpenAddModal]);

    const handleDeleteItem = useCallback((itemId: string, itemName: string) => {
        Alert.alert(
            t('food.deleteFood'),
            `${t('food.deleteWarningPartOne')} "${itemName}" ${t('food.deleteWarningPartTwo')}`,
            [
                { text: t('common.cancel'), style: "cancel" },
                {
                    text: t('common.delete'),
                    onPress: () => removeFoodFromDatabase(itemId),
                    style: "destructive",
                },
            ]
        );
    }, [removeFoodFromDatabase, t]);

    const renderItem = useCallback(({ item }: { item: FoodDatabaseItem }) => {
        const iconColor = isDarkMode ? '#FF6347' : '#FF3B30';
        const itemBackgroundColor = isDarkMode ? '#1C1C1E' : '#FFFFFF';
        const androidItemStyle = Platform.OS === 'android' ? styles.itemRowAndroid : {};

        return (
            <Pressable onPress={() => handleOpenEditModal(item)}>
                <View style={[styles.itemRow, { backgroundColor: itemBackgroundColor }, androidItemStyle]}>
                    <View style={styles.itemInfo}>
                        <Text style={styles.itemName} numberOfLines={1}>{item.foodName}</Text>
                        <Text style={styles.itemMacros} numberOfLines={2}>
                            {item.calories} {t('food.caloriesShort')}  ·  {t('food.ProteinShort')}: {item.protein}g  {t('food.CarbsShort')}: {item.carbs}g  {t('food.FatShort')}: {item.fat}g
                            <Text style={styles.per100gText}> ({t('food.for')} 100{item.metrics})</Text>
                        </Text>
                    </View>
                    <Pressable
                        onPress={() => handleDeleteItem(item.id, item.foodName)}
                        style={styles.deleteButton}
                        hitSlop={15}
                    >
                        {Platform.OS === 'ios' ? (
                            <SymbolView
                                name="trash"
                                tintColor={iconColor}
                                size={20}
                            />
                        ) : (
                            <MaterialCommunityIcons
                                name={iconMap.trash}
                                color={iconColor}
                                size={24}
                            />
                        )}
                    </Pressable>
                </View>
            </Pressable>
        );
    }, [isDarkMode, handleDeleteItem, handleOpenEditModal, t]);

    const ItemSeparator = () => {
        if (Platform.OS === 'android' && foodItems.length > 0) {
            return <View style={[
                styles.separatorAndroid,
                { backgroundColor: isDarkMode ? 'rgba(84,84,88,0.2)' : 'rgba(198,198,200,0.3)' }
            ]} />;
        }
        return <View style={[
            styles.separator,
            { backgroundColor: isDarkMode ? 'rgba(84,84,88,0.35)' : 'rgba(198,198,200,0.5)' }
        ]} />;
    }


    const ListEmpty = () => (
        <View style={styles.emptyContainer}>
            {Platform.OS === 'ios' ? (
                <SymbolView
                    name="archivebox"
                    tintColor={isDarkMode ? '#555555' : '#AAAAAA'}
                    size={48}
                    type="hierarchical"
                />
            ) : (
                <MaterialCommunityIcons
                    name={iconMap.archivebox}
                    color={isDarkMode ? '#555555' : '#AAAAAA'}
                    size={60}
                />
            )}
            <Text style={styles.emptyText}>{t('food.dbEmpty')}</Text>
            <Text style={styles.emptySubText}>{t('food.addFoodToDbNotice')}</Text>
        </View>
    );

    const androidListStyle = Platform.OS === 'android' && foodItems.length > 0 ? styles.listStyleAndroidCard : {};
    const androidListContainerStyle = Platform.OS === 'android' && foodItems.length > 0 ? styles.listContentContainerAndroid : {};


    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: isDarkMode ? '#000000' : '#F2F2F7' }]}>
            <FlatList
                data={foodItems}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                ItemSeparatorComponent={ItemSeparator}
                ListEmptyComponent={ListEmpty}
                style={[styles.listStyle, androidListStyle]}
                contentContainerStyle={[
                    styles.listContentContainer,
                    androidListContainerStyle,
                    foodItems.length === 0 ? styles.emptyListCentering : {}
                ]}
                showsVerticalScrollIndicator={false}
            />

            <FoodFormModal
                visible={isModalVisible}
                onClose={handleCloseModal}
                onSave={handleSaveFood}
                itemToEdit={editingItem}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    listStyle: {
        flex: 1,
    },
    listStyleAndroidCard: {
        marginHorizontal: 16,
        marginVertical: 8,
        borderRadius: 12,
        overflow: 'hidden',
        elevation: 3,
    },
    listContentContainer: {
        paddingBottom: Platform.OS === 'ios' ? 20 : 10,
    },
    listContentContainerAndroid: {
        // backgroundColor: '#FFFFFF', 
        // borderRadius: 12, 
    },
    emptyListCentering: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        minHeight: 70,
        ...Platform.select({
            ios: {
                marginHorizontal: 16,
                marginVertical: 5,
                borderRadius: 10,
                // shadowColor: '#000'
                // shadowOffset: { width: 0, height: 1 },
                // shadowOpacity: 0.08,
                // shadowRadius: 3,
            },
            android: {
            },
        }),
    },
    itemRowAndroid: {
    },
    itemInfo: {
        flex: 1,
        justifyContent: 'center',
        marginRight: 12,
        backgroundColor: 'transparent',
    },
    itemName: {
        fontSize: 17,
        fontWeight: '500',
        marginBottom: 4,
    },
    itemMacros: {
        fontSize: 13,
        opacity: 0.8,
        lineHeight: 18,
    },
    per100gText: {
        fontSize: 12,
        opacity: 0.7,
    },
    deleteButton: {
        padding: 10,
        marginLeft: 8,
    },
    separator: {
        height: StyleSheet.hairlineWidth,
        marginLeft: 16 + 16,
    },
    separatorAndroid: {
        height: StyleSheet.hairlineWidth,
        marginHorizontal: 16,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '500',
        marginTop: 20,
        textAlign: 'center',
        opacity: 0.8,
    },
    emptySubText: {
        fontSize: 15,
        opacity: 0.6,
        marginTop: 10,
        textAlign: 'center',
        maxWidth: '85%',
        lineHeight: 22,
    }
});
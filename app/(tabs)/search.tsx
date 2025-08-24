import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
    useColorScheme,
    StyleSheet,
    TextInput,
    FlatList,
    ActivityIndicator,
    SafeAreaView,
    Platform,
} from 'react-native';
import { useFoodDatabaseStore, FoodDatabaseItem } from '../../utils/state';
import Card from '../../components/Card';
import { View, Text } from '@/components/Themed';
import { useHeaderHeight } from '@react-navigation/elements';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { SymbolView } from 'expo-symbols';
import { useTranslation } from '@/i18n';

export default function Search() {
    const colorScheme = useColorScheme();
    const isDarkMode = colorScheme === 'dark';
    const headerHeight = useHeaderHeight();
    const { t } = useTranslation();

    const searchFoodInDb = useFoodDatabaseStore((state) => state.searchFoodInDatabase);

    const [searchQuery, setSearchQuery] = useState<string>('');
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [searchResults, setSearchResults] = useState<FoodDatabaseItem[]>([]);
    const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const themeSpecificPlaceholderTextColor = isDarkMode ? '#8E8E93' : '#A0A0A0';

    useEffect(() => {
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }
        debounceTimeoutRef.current = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, 300);

        return () => {
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current);
            }
        };
    }, [searchQuery]);

    useEffect(() => {
        if (debouncedSearchQuery.trim().length === 0) {
            setSearchResults([]);
            setIsLoading(false);
            return;
        }

        const performSearch = () => {
            setIsLoading(true);
            const results = searchFoodInDb(debouncedSearchQuery);
            setSearchResults(results);
            setIsLoading(false);
        };

        performSearch();
    }, [debouncedSearchQuery, searchFoodInDb]);


    const renderFoodItem = useCallback(({ item }: { item: FoodDatabaseItem }) => {
        console.log(item.id)
        return (
            <Card
                foodName={item.foodName}
                quantity={100}
                foodCalories={item.calories}
                hideIcons={true}
                id={item.id}
                protein={item.protein}
                carbs={item.carbs}
                fat={item.fat}
                metrics={item.metrics}
            />
        );
    }, []);

    const ListEmptyComponent = () => {
        if (isLoading) {
            return (
                <View style={styles.emptyOrLoadingContainer}>
                    <ActivityIndicator size="large" color={isDarkMode ? '#FFF' : '#ef5a3c'} />
                </View>
            );
        }
        if (debouncedSearchQuery.trim().length > 0 && searchResults.length === 0) {
            return (
                <View style={styles.emptyOrLoadingContainer}>
                    {Platform.OS === 'ios' ? (
                        <SymbolView
                            name="magnifyingglass"
                            tintColor={isDarkMode ? '#555555' : '#AAAAAA'}
                            size={48}
                            type="hierarchical"
                        />
                    ) : (
                        <MaterialCommunityIcons
                            name={'magnify'}
                            color={isDarkMode ? '#555555' : '#AAAAAA'}
                            size={52}
                        />
                    )}
                    <Text style={styles.emptyText}>{t('food.NoResultSearch')} "{debouncedSearchQuery}"</Text>
                </View>
            );
        }

        // Second conditional block
        if (searchQuery.trim().length === 0) {
            return (
                <View style={styles.emptyOrLoadingContainer}>
                    {Platform.OS === 'ios' ? (
                        <SymbolView
                            name="text.magnifyingglass"
                            tintColor={isDarkMode ? '#555555' : '#AAAAAA'}
                            size={48}
                            type="hierarchical"
                        />
                    ) : (
                        <MaterialCommunityIcons
                            name={'text-search'}
                            color={isDarkMode ? '#555555' : '#AAAAAA'}
                            size={52}
                        />
                    )}
                    <Text style={styles.emptyText}>{t('food.searchInYourDb')}</Text>
                </View>
            );
        }
        return null;
    };

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: isDarkMode ? '#000' : '#F0F0F0' }]}>
            <View style={[styles.container, { paddingTop: headerHeight }]}>
                <View style={styles.searchBarContainer}>
                    <TextInput
                        placeholder={t('food.searchFood')}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        style={[
                            styles.textInputBase,
                            isDarkMode ? styles.darkTextInput : styles.lightTextInput,
                        ]}
                        placeholderTextColor={themeSpecificPlaceholderTextColor}
                        autoFocus={true}
                        clearButtonMode="while-editing"
                    />
                </View>

                <FlatList
                    data={searchResults}
                    renderItem={renderFoodItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContentContainer}
                    ListEmptyComponent={ListEmptyComponent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    container: {
        flex: 1,
    },
    searchBarContainer: {
        paddingHorizontal: 16,
        paddingTop: 10,
        paddingBottom: 10,
    },
    textInputBase: {
        height: 48,
        borderRadius: 12,
        paddingHorizontal: 16,
        fontSize: 17,
        borderWidth: 1,
    },
    lightTextInput: {
        backgroundColor: '#FFFFFF',
        borderColor: '#E0E0E0',
        color: '#000000',
    },
    darkTextInput: {
        backgroundColor: '#1C1C1E',
        borderColor: '#38383A',
        color: '#FFFFFF',
    },
    listContentContainer: {
        paddingHorizontal: 16,
        paddingBottom: 20,
        flexGrow: 1,
    },
    emptyOrLoadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 50,
    },
    emptyText: {
        marginTop: 16,
        fontSize: 16,
        textAlign: 'center',
        opacity: 0.7,
    },
});
import React, { useRef, useState } from 'react';
import { CameraView, useCameraPermissions } from 'expo-camera';
import {
    StyleSheet,
    TouchableOpacity,
    useColorScheme,
    TextInput,
    Modal,
    Image,
    TouchableWithoutFeedback,
    Keyboard,
    ActivityIndicator,
    Alert,
    ScrollView,
    Platform,
    Linking
} from 'react-native';
import * as FileSystem from 'expo-file-system';
import { SymbolView } from 'expo-symbols';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { View, Text } from '@/components/Themed';
import { AI_PROVIDERS, FoodDatabaseItem, useConfigStore, useDiaryStore, useFoodDatabaseStore } from '../utils/state';
import { router } from 'expo-router';
import * as Crypto from 'expo-crypto';
import { useTranslation } from '@/i18n';

enum ScanMode {
    PHOTO = 'photo',
    TEXT = 'text',
}

interface MacroData {
    foodName: string;
    serving: {
        quantity: number;
        protein: number;
        carbs: number;
        fat: number;
    };
    per100g: {
        protein: number;
        carbs: number;
        fat: number;
    };
}


export default function AiScanner() {
    const { selectedProvider, apiKey } = useConfigStore();
    const { addFood } = useDiaryStore();
    const { addFoodToDatabase } = useFoodDatabaseStore();
    const colorScheme = useColorScheme();
    const isDarkMode = colorScheme === 'dark';
    const { t } = useTranslation();

    // Camera & UI state
    const [flash, setFlash] = useState<boolean>(false);
    const [permission, requestPermission] = useCameraPermissions();
    const [selectedMode, setSelectedMode] = useState<ScanMode>(ScanMode.PHOTO);
    const [imageUri, setImageUri] = useState<string>('');
    const [textInput, setTextInput] = useState<string>('');
    const [additionalDetails, setAdditionalDetails] = useState<string>('');

    // Modal states
    const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);
    const [showResultsModal, setShowResultsModal] = useState<boolean>(false);

    // Analysis states
    const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
    const [analysisResults, setAnalysisResults] = useState<MacroData | null>(null);
    const [error, setError] = useState<string | null>(null);

    const cameraRef = useRef<CameraView>(null);

    const handleOpenSettings = () => {
        Linking.openSettings();
    };

    const cleanAndParseJson = (text: string | null | undefined): any => {
        if (!text) {
            console.error("cleanAndParseJson: No content received.");
            throw new Error("No response content from AI.");
        }
        console.log("RAW AI Content:", text); // LOG IT!

        let cleanString = text
            .replace(/```json/gi, '')
            .replace(/```/gi, '')
            .trim();

        const firstBrace = cleanString.indexOf('{');
        const lastBrace = cleanString.lastIndexOf('}');

        if (firstBrace === -1 || lastBrace === -1 || lastBrace < firstBrace) {
            console.error("cleanAndParseJson: Could not find valid JSON block { } in:", text);
        } else {
            cleanString = cleanString.substring(firstBrace, lastBrace + 1);
        }


        try {
            const parsed = JSON.parse(cleanString);
            console.log("Successfully Parsed:", parsed);
            return parsed;
        } catch (parseError) {
            console.error("JSON.parse failed! Raw content:", text);
            console.error("Cleaned string attempt:", cleanString);
            console.error("Parsing error details:", parseError);
            throw new Error('Invalid JSON response format from AI, even after cleaning.'); // Propagate error
        }
    }

    /** convert image URI to base64 for AI analysis */
    const convertImageToBase64 = async (uri: string): Promise<string> => {
        try {
            const base64 = await FileSystem.readAsStringAsync(uri, {
                encoding: FileSystem.EncodingType.Base64,
            });
            return `data:image/jpeg;base64,${base64}`;
        } catch (err) {
            throw new Error('Failed to process image for analysis');
        }
    };

    const analyzeWithOpenAI = async (model: string, base64Image?: string, textPrompt?: string): Promise<MacroData> => {
        const systemPrompt = `You are a nutrition expert that analyzes food images and text descriptions to extract nutritional information. 
Extract or estimate: food name, serving size in grams, and macronutrients (protein, carbs, fat in grams).
Use visual cues, portion sizes, and context clues. Make educated guesses based on typical serving sizes.
Respond ONLY with valid JSON in this exact format. DO NOT USE MARKDOWN or code blocks:
{
  "foodName": "string",
  "serving": {
    "quantity": number,
    "protein": number,
    "carbs": number,
    "fat": number
  },
  "per100g": {
    "protein": number,
    "carbs": number,
    "fat": number
  }
}

If analysis is impossible, respond ONLY with this JSON (no markdown):
{"error": "Unable to analyze - please provide clearer image or description"}`;

        const messages: any[] = [{ role: 'system', content: systemPrompt }];
        if (base64Image) {
            messages.push({
                role: 'user',
                content: [
                    {
                        type: 'text',
                        text: textPrompt
                            ? `Analyze this food image. Additional context: ${textPrompt}`
                            : 'Analyze this food image and provide nutritional information.'
                    },
                    { type: 'image_url', image_url: { url: base64Image } }
                ]
            });
        } else if (textPrompt) {
            messages.push({
                role: 'user',
                content: `Analyze this food description: "${textPrompt}"`
            });
        } else {
            throw new Error("No image or text prompt provided for OpenAI analysis.");
        }


        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: model,
                messages,
                max_tokens: 500,
                temperature: 0.1,
                response_format: { type: "json_object" },
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            try {
                const errorData = JSON.parse(errorText);
                throw new Error(errorData.error?.message || `OpenAI API error: ${response.status} - ${errorText}`);
            } catch (e) {
                throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
            }
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;

        const parsed = cleanAndParseJson(content);

        if (parsed.error) {
            throw new Error(parsed.error);
        }
        if (typeof parsed !== 'object' || !parsed.foodName || !parsed.serving || !parsed.per100g) {
            console.error("Parsed JSON missing required keys or not an object:", parsed);
            throw new Error("AI response JSON is missing required fields (foodName, serving, per100g).");
        }
        return parsed as MacroData;
    };

    const analyzeWithGemini = async (model: string, base64Image?: string, textPrompt?: string): Promise<MacroData> => {
        const basePrompt = `Analyze this ${base64Image ? 'food image' : 'food description'} and extract nutritional information.
Extract or estimate: Food name, Serving size in grams, Macronutrients (protein, carbs, fat in grams), Per-100g nutritional values.
Use visual cues and typical portion sizes. Make educated guesses.
Respond ONLY with valid JSON. DO NOT USE MARKDOWN or code blocks:
{
  "foodName": "string",
  "serving": {"quantity": number, "protein": number, "carbs": number, "fat": number},
  "per100g": {"protein": number, "carbs": number, "fat": number}
}
If impossible to analyze, respond ONLY with this JSON (no markdown): {"error": "description"}`;

        let parts = [];
        if (base64Image) {
            parts.push({ text: `${basePrompt}${textPrompt ? ` Additional context: ${textPrompt}` : ''}` });
            parts.push({
                inline_data: {
                    mime_type: 'image/jpeg',
                    data: base64Image.split(',')[1]
                }
            });
        } else if (textPrompt) {
            parts.push({ text: `${basePrompt}\n\nFood description: "${textPrompt}"` });
        } else {
            throw new Error("No image or text prompt provided for Gemini analysis.");
        }

        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{ parts }],
                generationConfig: {
                    temperature: 0.1,
                    maxOutputTokens: 800,
                    responseMimeType: "application/json",
                }
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            try {
                const errorData = JSON.parse(errorText);
                throw new Error(errorData.error?.message || `Gemini API error: ${response.status} - ${errorText}`);
            } catch (e) {
                throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
            }
        }

        const data = await response.json();
        if (data.candidates?.[0]?.finishReason === 'SAFETY') {
            console.warn("Gemini content blocked for safety reasons");
            throw new Error('Content blocked by AI safety filter.');
        }
        const content = data.candidates?.[0]?.content?.parts?.[0]?.text;

        const parsed = cleanAndParseJson(content); // Use helper

        if (parsed.error) {
            throw new Error(parsed.error);
        }
        if (typeof parsed !== 'object' || !parsed.foodName || !parsed.serving || !parsed.per100g) {
            console.error("Parsed JSON missing required keys or not an object:", parsed);
            throw new Error("AI response JSON is missing required fields (foodName, serving, per100g).");
        }
        return parsed as MacroData;
    };

    const performAnalysis = async () => {
        if (!apiKey) {
            Alert.alert('API Key Missing', 'Please configure your AI provider API key in settings.');
            return;
        }

        const provider = AI_PROVIDERS.find(p => p.id === selectedProvider);

        if (!provider) {
            Alert.alert('Provider not found', 'The selected AI provider is not configured correctly.');
            return;
        }

        setIsAnalyzing(true);
        setError(null);

        try {
            let base64Image: string | undefined;
            let prompt: string | undefined;

            if (selectedMode === ScanMode.PHOTO && imageUri) {
                base64Image = await convertImageToBase64(imageUri);
                prompt = additionalDetails;
            } else if (selectedMode === ScanMode.TEXT && textInput.trim()) {
                prompt = textInput.trim();
            } else {
                throw new Error('Please capture an image or enter text description');
            }

            let results: MacroData;

            if (provider.provider === 'openai') {
                results = await analyzeWithOpenAI(provider.id, base64Image, prompt);
            } else if (provider.provider === 'google') {
                results = await analyzeWithGemini(provider.id, base64Image, prompt);
            } else {
                throw new Error('Unsupported AI provider for this analysis');
            }

            setAnalysisResults(results);
            setShowResultsModal(true);

        } catch (err) {
            console.error('Analysis error:', err);
            setError(err instanceof Error ? err.message : 'Analysis failed');
        } finally {
            setIsAnalyzing(false);
        }
    };


    const handleCameraAction = async () => {
        if (imageUri) {
            // reset image
            setImageUri('');
            return;
        }

        if (cameraRef.current) {
            try {

                const photo = await cameraRef.current.takePictureAsync({
                    imageType: 'jpg',
                    quality: 0.8,
                    exif: false
                });

                if (photo) {
                    setImageUri(photo.uri);
                }
            } catch (err) {
                setError('Failed to capture photo');
            }
        }
    };

    const calculateCalories = (protein: number, carbs: number, fat: number): number => {
        return Math.round(protein * 4 + carbs * 4 + fat * 9);
    };

    const addFoodToDiary = () => {
        if (!analysisResults) return;

        const caloriesPer100 = calculateCalories(
            analysisResults.per100g.protein,
            analysisResults.per100g.carbs,
            analysisResults.per100g.fat
        );
        const foodDatabaseEntry: Omit<FoodDatabaseItem, 'id'> = {
            foodName: analysisResults.foodName,
            calories: caloriesPer100,
            protein: analysisResults.per100g.protein,
            carbs: analysisResults.per100g.carbs,
            fat: analysisResults.per100g.fat,
            metrics: 'g'
        };

        const newDbEntry = addFoodToDatabase(foodDatabaseEntry);

        const caloriesForServing = calculateCalories(
            analysisResults.serving.protein,
            analysisResults.serving.carbs,
            analysisResults.serving.fat
        );

        addFood({
            id: newDbEntry.id,
            entryId: `ai_entry_${Crypto.randomUUID()}`,
            barcode: '',
            foodName: analysisResults.foodName,
            calories: caloriesForServing,
            protein: analysisResults.serving.protein,
            carbs: analysisResults.serving.carbs,
            fat: analysisResults.serving.fat,
            quantity: analysisResults.serving.quantity,
            metrics: 'g',
        });

        setShowResultsModal(false);
        router.back();
    };

    if (!permission) {
        return <View style={styles.container}><ActivityIndicator size="large" color={isDarkMode ? '#FFFFFF' : '#ef5a3c'} /></View>;
    }

    if (!permission.granted) {
        const canAskAgain = permission.canAskAgain;

        return (
            <View style={styles.container}>
                <View style={styles.permissionContainer}>
                    <View style={styles.permissionContent}>
                        {Platform.OS === 'ios' ? (
                            <SymbolView
                                name="camera"
                                tintColor={isDarkMode ? '#FFFFFF' : '#000000'}
                                size={48}
                                resizeMode="scaleAspectFill" // This prop is specific to SymbolView
                            />
                        ) : (
                            <MaterialCommunityIcons
                                name="camera-outline"
                                color={isDarkMode ? '#FFFFFF' : '#000000'}
                                size={52}
                            />
                        )}                        <Text style={styles.permissionTitle}>
                            {canAskAgain ? t('settings.cameraAccessRequired') : t('settings.cameraAccessDenied')}
                        </Text>
                        <Text style={styles.permissionDescription}>
                            {canAskAgain ? t('settings.allowCameraAccess') : t('settings.enableCameraInSettings')}
                        </Text>
                        <TouchableOpacity
                            onPress={canAskAgain ? requestPermission : handleOpenSettings}
                            style={styles.permissionButton}
                        >
                            <Text style={styles.permissionButtonText}>
                                {canAskAgain ? t('settings.enableCamera') : t('settings.openSettings')}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                {selectedMode === ScanMode.PHOTO ? (
                    <View style={styles.cameraContainer}>
                        {imageUri ? (
                            <Image source={{ uri: imageUri }} style={styles.camera} resizeMode="cover" />
                        ) : (
                            <CameraView ref={cameraRef} style={styles.camera} facing="back" autofocus='on' enableTorch={flash} />
                        )}
                    </View>
                ) : (
                    <View style={styles.textContainer}>
                        <View style={styles.textInputWrapper}>
                            <Text style={styles.textInputLabel}>{t('food.describeYourMeal')}</Text>
                            <TextInput
                                style={[styles.textInput, { backgroundColor: isDarkMode ? '#1C1C1E' : '#F2F2F7', color: isDarkMode ? '#FFFFFF' : '#000000', borderColor: isDarkMode ? '#38383A' : '#C6C6C8' }]}
                                placeholder={t('food.describeMealExample')}
                                placeholderTextColor={isDarkMode ? '#8E8E93' : '#8E8E93'}
                                value={textInput}
                                onChangeText={setTextInput}
                                multiline
                                textAlignVertical="top"
                                maxLength={300}
                            />
                            <Text style={[styles.characterCount, { color: textInput.length >= 280 ? '#FF3B30' : '#8E8E93' }]}>
                                {textInput.length}/300
                            </Text>
                        </View>
                    </View>
                )}

                {/* Error Display */}
                {error && (
                    <View style={[styles.errorBanner, { backgroundColor: isDarkMode ? '#2C1B1B' : '#FFEBEE' }]}>
                        {Platform.OS === 'ios' ? (
                            <SymbolView
                                name="exclamationmark.triangle"
                                tintColor="#FF3B30"
                                size={16}
                            />
                        ) : (
                            <MaterialCommunityIcons
                                name="alert-octagon-outline"
                                color="#FF3B30"
                                size={18}
                            />
                        )}
                        <Text style={styles.errorText}>{error}</Text>
                        <TouchableOpacity onPress={() => setError(null)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                            {Platform.OS === 'ios' ? (
                                <SymbolView
                                    name="xmark"
                                    tintColor="#FF3B30"
                                    size={14}
                                />
                            ) : (
                                <MaterialCommunityIcons
                                    name="close"
                                    color="#FF3B30"
                                    size={18}
                                />
                            )}
                        </TouchableOpacity>
                    </View>
                )}

                {/* Loading Overlay */}
                {isAnalyzing && (
                    <View style={styles.loadingOverlay}>
                        <View style={[styles.loadingContent, { backgroundColor: isDarkMode ? '#1C1C1E' : '#FFFFFF' }]}>
                            <ActivityIndicator size="large" color="#ef5a3c" />
                            <Text style={styles.loadingText}>{t('food.analyzingNutrition')}</Text>
                        </View>
                    </View>
                )}

                {/* Controls */}
                <View style={styles.controlsContainer}>
                    {selectedMode === ScanMode.PHOTO && additionalDetails.trim().length > 0 && (
                        <View style={[styles.additionalDetailsBanner, { backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.08)' }]}>
                            <TouchableOpacity style={styles.additionalDetailsContent} onPress={() => setShowDetailsModal(true)}>
                                {Platform.OS === 'ios' ? (
                                    <SymbolView
                                        name="text.bubble.fill"
                                        tintColor={isDarkMode ? '#FFFFFF' : '#3C3C43'}
                                        size={16}
                                    />
                                ) : (
                                    <MaterialCommunityIcons
                                        name="comment-text-outline"
                                        color={isDarkMode ? '#FFFFFF' : '#3C3C43'}
                                        size={18}
                                    />
                                )}
                                <Text style={styles.additionalDetailsText} numberOfLines={1}>
                                    {additionalDetails}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.additionalDetailsClearButton} onPress={() => setAdditionalDetails('')} hitSlop={10}>
                                {Platform.OS === 'ios' ? (
                                    <SymbolView
                                        name="xmark.circle.fill"
                                        tintColor={isDarkMode ? '#8E8E93' : '#C7C7CC'}
                                        size={18}
                                    />
                                ) : (
                                    <MaterialCommunityIcons
                                        name="close-circle"
                                        color={isDarkMode ? '#8E8E93' : '#C7C7CC'}
                                        size={20}
                                    />
                                )}
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* Mode Toggle */}
                    <View style={[styles.modeToggle, { backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(130, 130, 130, 0.1)' }]}>
                        <TouchableOpacity
                            onPress={() => setSelectedMode(ScanMode.PHOTO)}
                            style={[styles.modeButton, selectedMode === ScanMode.PHOTO && styles.modeButtonActive]}
                        >
                            {Platform.OS === 'ios' ? (
                                <SymbolView
                                    name="camera"
                                    tintColor={selectedMode === ScanMode.PHOTO ? '#ef5a3c' : '#8E8E93'}
                                    size={18}
                                    resizeMode="scaleAspectFill"
                                />
                            ) : (
                                <MaterialCommunityIcons
                                    name="camera-outline" // Or "camera" for filled
                                    color={selectedMode === ScanMode.PHOTO ? '#ef5a3c' : '#8E8E93'}
                                    size={20} // Adjusted size for Android (SF 18 ~ MCI 20-22)
                                />
                            )}
                            <Text style={[styles.modeButtonText, { color: selectedMode === ScanMode.PHOTO ? '#ef5a3c' : '#8E8E93' }]}>
                                Photo
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setSelectedMode(ScanMode.TEXT)}
                            style={[styles.modeButton, selectedMode === ScanMode.TEXT && styles.modeButtonActive]}
                        >
                            {Platform.OS === 'ios' ? (
                                <SymbolView
                                    name="text.bubble"
                                    tintColor={selectedMode === ScanMode.TEXT ? '#ef5a3c' : '#8E8E93'}
                                    size={18}
                                    resizeMode="scaleAspectFill"
                                />
                            ) : (
                                <MaterialCommunityIcons
                                    name="comment-text-outline" // Or "message-text-outline"
                                    color={selectedMode === ScanMode.TEXT ? '#ef5a3c' : '#8E8E93'}
                                    size={20} // Adjusted size for Android (SF 18 ~ MCI 20-22)
                                />
                            )}
                            <Text style={[styles.modeButtonText, { color: selectedMode === ScanMode.TEXT ? '#ef5a3c' : '#8E8E93' }]}>
                                Text
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Action Buttons */}
                    <View style={styles.actionButtons}>
                        {selectedMode === ScanMode.PHOTO ? (
                            imageUri ? (
                                <TouchableOpacity
                                    onPress={handleCameraAction}
                                    style={[styles.secondaryButton, { backgroundColor: 'rgba(255, 255, 255, 0.2)' }]}
                                    disabled={isAnalyzing}
                                >
                                    {Platform.OS === 'ios' ? (
                                        <SymbolView
                                            name="arrow.clockwise"
                                            tintColor="#FFFFFF"
                                            size={20}
                                            resizeMode="scaleAspectFill"
                                        />
                                    ) : (
                                        <MaterialCommunityIcons
                                            name="refresh"
                                            color="#FFFFFF"
                                            size={24}
                                        />
                                    )}
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity
                                    onPress={() => setFlash(!flash)}
                                    style={[styles.secondaryButton, { backgroundColor: 'rgba(255, 255, 255, 0.2)' }]}
                                    disabled={isAnalyzing}
                                >
                                    {Platform.OS === 'ios' ? (
                                        <SymbolView
                                            name={flash ? 'bolt.fill' : 'bolt.slash'}
                                            tintColor="#FFFFFF"
                                            size={20}
                                            resizeMode="scaleAspectFill"
                                        />
                                    ) : (
                                        <MaterialCommunityIcons
                                            name={flash ? 'flash' : 'flash-off'}
                                            color="#FFFFFF"
                                            size={24}
                                        />
                                    )}
                                </TouchableOpacity>
                            )
                        ) : (
                            <View style={[styles.secondaryButton, { backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.2)' }]} />
                        )}

                        <TouchableOpacity
                            onPress={selectedMode === ScanMode.PHOTO && !imageUri ? handleCameraAction : performAnalysis}
                            style={[styles.primaryButton, isAnalyzing && styles.primaryButtonDisabled]}
                            disabled={isAnalyzing}
                        >
                            {Platform.OS === 'ios' ? (
                                <SymbolView
                                    name={selectedMode === ScanMode.PHOTO && !imageUri ? 'camera.fill' : 'sparkles'}
                                    tintColor="#FFFFFF"
                                    size={24}
                                    resizeMode="scaleAspectFill"
                                />
                            ) : (
                                <MaterialCommunityIcons
                                    name={
                                        selectedMode === ScanMode.PHOTO && !imageUri
                                            ? 'camera'
                                            : 'creation'
                                    }
                                    color="#FFFFFF"
                                    size={28}
                                />
                            )}
                        </TouchableOpacity>

                        {selectedMode === ScanMode.PHOTO ? (
                            <TouchableOpacity onPress={() => setShowDetailsModal(true)} style={[styles.secondaryButton, { backgroundColor: 'rgba(255, 255, 255, 0.2)' }]} disabled={isAnalyzing}>
                                {Platform.OS === 'ios' ? (
                                    <SymbolView
                                        name="plus"
                                        tintColor="#FFFFFF"
                                        size={20}
                                    />
                                ) : (
                                    <MaterialCommunityIcons
                                        name="plus"
                                        color="#FFFFFF"
                                        size={24}
                                    />
                                )}
                            </TouchableOpacity>
                        ) : (
                            <View style={[styles.secondaryButton, { backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.2)' }]} />
                        )}
                    </View>
                </View>

                {/* Modals (unchanged) */}
                <Modal
                    visible={showDetailsModal}
                    animationType="slide"
                    presentationStyle="pageSheet"
                    onRequestClose={() => setShowDetailsModal(false)}
                >
                    <View style={[styles.modalContainer, { backgroundColor: isDarkMode ? '#000000' : '#F2F2F7' }]}>
                        <View style={styles.modalHeader}>
                            <TouchableOpacity onPress={() => setShowDetailsModal(false)} style={styles.modalHeaderButton}>
                                <Text style={styles.modalCancelText}>{t('common.cancel')}</Text>
                            </TouchableOpacity>
                            <Text style={styles.modalTitle}>{t('food.addDetails')}</Text>
                            <TouchableOpacity onPress={() => setShowDetailsModal(false)} style={styles.modalHeaderButton}>
                                <Text style={styles.modalSaveText}>{t('common.done')}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.modalContent}>
                            <View style={[styles.modalInputGroup, { backgroundColor: isDarkMode ? '#1C1C1E' : '#FFFFFF' }]}>
                                <Text style={styles.modalInputLabel}>{t('food.addContext')}</Text>
                                <TextInput
                                    style={[styles.modalTextInput, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}
                                    placeholder={t('food.addContextExample')}
                                    placeholderTextColor={isDarkMode ? '#8E8E93' : '#8E8E93'}
                                    value={additionalDetails}
                                    onChangeText={setAdditionalDetails}
                                    multiline
                                    textAlignVertical="top"
                                    maxLength={200}
                                />
                                <Text style={styles.modalCharacterCount}>{additionalDetails.length}/200</Text>
                            </View>
                        </View>
                    </View>
                </Modal>
                <Modal
                    visible={showResultsModal}
                    animationType="slide"
                    presentationStyle="pageSheet"
                    onRequestClose={() => setShowResultsModal(false)}
                >
                    <View style={[styles.modalContainer, { backgroundColor: isDarkMode ? '#000000' : '#F2F2F7' }]}>
                        <View style={styles.modalHeader}>
                            <TouchableOpacity onPress={() => setShowResultsModal(false)} style={styles.modalHeaderButton}>
                                <Text style={styles.modalCancelText}>{t('common.cancel')}</Text>
                            </TouchableOpacity>
                            <Text style={styles.modalTitle}>{t('food.nutritionAnalysis')}</Text>
                            <View style={styles.modalHeaderButton} />
                        </View>
                        {analysisResults && (
                            <ScrollView style={styles.modalContent}>
                                <View style={[styles.resultsCard, { backgroundColor: isDarkMode ? '#1C1C1E' : '#FFFFFF' }]}>
                                    <Text style={styles.foodName}>{analysisResults.foodName}</Text>
                                    <Text style={styles.servingSize}>{analysisResults.serving.quantity}g {t('food.serving').toLowerCase()}</Text>
                                    <Text style={styles.caloriesDisplay}>{calculateCalories(analysisResults.serving.protein, analysisResults.serving.carbs, analysisResults.serving.fat)} {t('food.calories').toLowerCase()}</Text>
                                    <View style={styles.macrosGrid}>
                                        <View style={styles.macroItem}><Text style={styles.macroValue}>{analysisResults.serving.protein}g</Text><Text style={styles.macroLabel}>{t('food.protein')}</Text></View>
                                        <View style={styles.macroItem}><Text style={styles.macroValue}>{analysisResults.serving.carbs}g</Text><Text style={styles.macroLabel}>{t('food.carbs')}</Text></View>
                                        <View style={styles.macroItem}><Text style={styles.macroValue}>{analysisResults.serving.fat}g</Text><Text style={styles.macroLabel}>{t('food.fat')}</Text></View>
                                    </View>
                                </View>
                                <View style={styles.warningGroup}>
                                    <View style={[styles.warningGroupContainer, { backgroundColor: isDarkMode ? '#151515' : '#ffffff' }]}>
                                        <View style={styles.infoSection}>
                                            <View style={styles.infoContent}>
                                                {Platform.OS === 'ios' ? (
                                                    <SymbolView
                                                        name="info.circle"
                                                        tintColor="#007AFF"
                                                        type="hierarchical"
                                                        size={16}
                                                    />
                                                ) : (
                                                    <MaterialCommunityIcons
                                                        name="information-outline"
                                                        color="#007AFF"
                                                        size={18}
                                                    />
                                                )}
                                                <Text style={styles.infoText}>{t('food.doubleCheckWarning')}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                                <TouchableOpacity onPress={addFoodToDiary} style={styles.addButton}><Text style={styles.addButtonText}>{t('food.addToDiary')}</Text></TouchableOpacity>
                            </ScrollView>
                        )}
                    </View>
                </Modal>
            </View>
        </TouchableWithoutFeedback >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    cameraContainer: {
        flex: 1,
    },
    camera: {
        flex: 1,
        width: '100%',
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    textInputWrapper: {
        marginBottom: 20,
    },
    textInputLabel: {
        fontSize: 17,
        fontWeight: '600',
        marginBottom: 12,
    },
    textInput: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        height: 120,
        textAlignVertical: 'top',
    },
    characterCount: {
        alignSelf: 'flex-end',
        fontSize: 13,
        marginTop: 8,
    },
    errorBanner: {
        position: 'absolute',
        top: 60,
        left: 16,
        right: 16,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 12,
        zIndex: 10,
    },
    errorText: {
        flex: 1,
        color: '#FF3B30',
        fontSize: 14,
        marginLeft: 8,
    },
    loadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)',
        zIndex: 20,
    },
    loadingContent: {
        alignItems: 'center',
        padding: 24,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    loadingText: {
        color: '#8E8E93',
        fontSize: 16,
        marginTop: 12,
    },
    controlsContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingBottom: 40,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    additionalDetailsBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 12,
        marginBottom: 16,
        alignSelf: 'center',
        maxWidth: '90%',
    },
    additionalDetailsContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 8,
    },
    additionalDetailsText: {
        flex: 1,
        marginLeft: 8,
        fontSize: 14,
    },
    additionalDetailsClearButton: {
        padding: 4
    },
    modeToggle: {
        flexDirection: 'row',
        borderRadius: 16,
        padding: 4,
        marginBottom: 24,
        alignSelf: 'center',
    },
    modeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 12,
    },
    modeButtonActive: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    modeButtonText: {
        fontSize: 15,
        fontWeight: '500',
        marginLeft: 6,
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    primaryButton: {
        backgroundColor: '#ef5a3c',
        width: 70,
        height: 70,
        borderRadius: 35,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    primaryButtonDisabled: {
        opacity: 0.6,
    },
    secondaryButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    permissionContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
    },
    permissionContent: {
        alignItems: 'center',
        maxWidth: 280,
    },
    permissionTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginTop: 16,
        marginBottom: 8,
        textAlign: 'center',
    },
    permissionDescription: {
        fontSize: 16,
        color: '#8E8E93',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 32,
    },
    permissionButton: {
        backgroundColor: '#ef5a3c',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 12,
    },
    permissionText: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
    permissionButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    modalContainer: {
        flex: 1,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: 'rgba(60, 60, 67, 0.36)',
    },
    modalContent: {
        flex: 1,
        padding: 16,
    },
    modalCharacterCount: {
        fontSize: 13,
        color: '#8E8E93',
        textAlign: 'right',
        margin: 8,
    },
    modalHeaderButton: {
        minWidth: 60,
    },
    modalCancelText: {
        fontSize: 17,
        color: '#FF3B30',
        fontWeight: '400',
    },
    modalTitle: {
        fontSize: 17,
        fontWeight: '600',
        textAlign: 'center',
    },
    modalSaveText: {
        fontSize: 17,
        color: '#007AFF',
        fontWeight: '600',
        textAlign: 'right',
    },
    modalInputGroup: {
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 24,
    },
    modalInputLabel: {
        fontSize: 15,
        fontWeight: '500',
        color: '#8E8E93',
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 8,
    },
    modalTextInput: {
        fontSize: 16,
        paddingHorizontal: 16,
        paddingBottom: 16,
        minHeight: 100,
        textAlignVertical: 'top',
    },
    resultsCard: {
        borderRadius: 16,
        padding: 24,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    foodName: {
        fontSize: 24,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 8,
    },
    servingSize: {
        fontSize: 16,
        color: '#8E8E93',
        textAlign: 'center',
        marginBottom: 4,
    },
    caloriesDisplay: {
        fontSize: 32,
        fontWeight: '800',
        color: '#ef5a3c',
        textAlign: 'center',
        marginBottom: 24,
    },
    macrosGrid: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingTop: 20,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: 'rgba(60, 60, 67, 0.36)',
    },
    macroItem: {
        alignItems: 'center',
        flex: 1,
    },
    macroValue: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 4,
    },
    macroLabel: {
        fontSize: 13,
        color: '#8E8E93',
        fontWeight: '500',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    addButton: {
        backgroundColor: '#ef5a3c',
        borderRadius: 16,
        paddingVertical: 16,
        marginHorizontal: 16,
        marginBottom: 32,
        shadowColor: '#ef5a3c',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },
    addButtonText: {
        fontSize: 18,
        fontWeight: '700',
        textAlign: 'center',
    },
    warningGroup: {
        backgroundColor: 'transparent',
        marginBottom: 35,
        paddingHorizontal: 16,
    },
    warningGroupContainer: {
        borderRadius: 10,
        overflow: 'hidden',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: {
                    width: 0,
                    height: 1,
                },
                shadowOpacity: 0.05,
                shadowRadius: 2,
            },
            android: {
                elevation: 1,
            },
        }),
    },
    infoSection: {
        backgroundColor: 'transparent',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    infoContent: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: 'transparent',
    },
    infoText: {
        fontSize: 14,
        color: '#8E8E93',
        marginLeft: 8,
        flex: 1,
        lineHeight: 20,
    },
});
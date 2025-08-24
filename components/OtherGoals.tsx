import React from 'react';
import { Text, View, useColorScheme, StyleSheet, TextInput } from 'react-native';
import { useGoalsStore } from '../utils/state';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from '../i18n';

type FormData = {
    height: number | null;
    age: number | null;
};

export default function OtherGoals(): React.ReactElement {
    const colorScheme = useColorScheme();
    const { t } = useTranslation();

    const themeTextStyle = colorScheme === 'light' ? styles.lightThemeText : styles.darkThemeText;

    const themeContainerStyle =
        colorScheme === 'light' ? styles.lightContainer : styles.darkContainer;

    const inputBgStyle = colorScheme === 'light' ? styles.lightInputBg : styles.darkInputBg;

    const {
        height,
        age,
        setHeight,
        setAge
    } = useGoalsStore();

    const { control } = useForm<FormData>({
        defaultValues: {
            height: height,
            age: age
        }
    });

    function handleHeight(heightInput: number | null) {
        setHeight(heightInput);
    }

    function handleAge(ageInput: number | null) {
        setAge(ageInput);
    }

    return (
        <View style={[themeContainerStyle, styles.container]}>
            <View style={styles.weightContainer}>
                <View style={styles.weightForm}>
                    <View style={styles.weightInputContainer}>
                        <Text style={[themeTextStyle, styles.weightLabel]}>{t('common.height')}</Text>
                        <View style={styles.inputWrapper}>
                            <Controller
                                control={control}
                                render={({ field: { onChange, value } }) => (
                                    <TextInput
                                        style={[inputBgStyle, themeTextStyle, styles.input, { borderColor: colorScheme === 'light' ? '#9ca3af' : '#6b7280' }]}
                                        placeholder={t('common.height')}
                                        placeholderTextColor={colorScheme === 'light' ? '#9ca3af' : '#6b7280'}
                                        onChangeText={(val) => {
                                            const parsedVal = parseInt(val);
                                            if (isNaN(parsedVal)) {
                                                onChange(null);
                                                handleHeight(null);
                                            } else {
                                                onChange(parsedVal);
                                                handleHeight(parsedVal);
                                            }
                                        }}
                                        value={value !== null && value !== undefined ? String(value) : ''}
                                        keyboardType="numeric"
                                    />
                                )}
                                name="height"
                            />
                            <Text style={[themeTextStyle, styles.unitText]}>cm</Text>
                        </View>
                    </View>

                    <View style={styles.weightInputContainer}>
                        <Text style={[themeTextStyle, styles.weightLabel]}>{t('common.age')}</Text>
                        <View style={styles.inputWrapper}>
                            <Controller
                                control={control}
                                render={({ field: { onChange, value } }) => (
                                    <TextInput
                                        style={[inputBgStyle, themeTextStyle, styles.input, { borderColor: colorScheme === 'light' ? '#9ca3af' : '#6b7280' }]}
                                        placeholder={t('common.age')}
                                        placeholderTextColor={colorScheme === 'light' ? '#9ca3af' : '#6b7280'}
                                        onChangeText={(val) => {
                                            const parsedVal = parseInt(val);
                                            if (isNaN(parsedVal)) {
                                                onChange(null);
                                                handleAge(null);
                                            } else {
                                                onChange(parsedVal);
                                                handleAge(parsedVal);
                                            }
                                        }}
                                        value={value !== null && value !== undefined ? String(value) : ''}
                                        keyboardType="numeric"
                                    />
                                )}
                                name="age"
                            />
                            <Text style={[themeTextStyle, styles.unitText]}>years</Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 8,
        width: '100%',
    },
    lightContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    darkContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    lightInputBg: {
        backgroundColor: '#e5e5e550',
    },
    darkInputBg: {
        backgroundColor: '#00000020',
    },
    lightThemeText: {
        color: '#242c40'
    },
    darkThemeText: {
        color: '#d0d0c0'
    },
    heading: {
        fontSize: 24,
        fontWeight: '600',
        marginBottom: 24,
        textAlign: 'center'
    },
    goalsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 24,
    },
    goalItem: {
        borderRadius: 12,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    goalIcon: {
        fontSize: 32,
        marginBottom: 8,
    },
    goalText: {
        fontWeight: '500',
        textAlign: 'center',
    },
    sectionContainer: {
        marginBottom: 24,
        padding: 8,
        borderRadius: 12,
        backgroundColor: '#00000010',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 16,
    },
    inputWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        height: 48,
        borderRadius: 8,
        borderWidth: 1,
        paddingHorizontal: 12,
        fontSize: 16,
        width: '100%',
    },
    unitText: {
        position: 'absolute',
        right: 12,
        fontSize: 16,
        opacity: 0.5,
    },
    selectionText: {
        marginBottom: 16,
        fontSize: 16,
    },
    weightContainer: {
        marginBottom: 8,
    },
    weightForm: {
        flexDirection: 'row',
        marginBottom: 8,
        width: '100%',
    },
    weightInputContainer: {
        flex: 1,
        margin: 4,
    },
    weightLabel: {
        fontSize: 14,
        marginBottom: 4,
        fontWeight: '500',
    },
    weightDifference: {
        alignItems: 'center'
    },
    weightDiffText: {
        fontSize: 16,
    }
});
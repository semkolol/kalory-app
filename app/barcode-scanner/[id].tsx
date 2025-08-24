import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, useColorScheme } from 'react-native';
import { Camera, CameraView } from 'expo-camera';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useBarcodeCodeStore, useConfigStore } from '../../utils/state';

export default function BarcodeScannerComponent() {
    const { id } = useLocalSearchParams();
    const { cameraPermissions, setCameraPermissions } = useConfigStore();
    const [scanned, setScanned] = useState(false);

    const { setBarcodeCode } = useBarcodeCodeStore();

    const colorScheme = useColorScheme();

    const themeTextStyle = colorScheme === 'light' ? styles.lightThemeText : styles.darkThemeText;
    const themeContainerStyle =
        colorScheme === 'light' ? styles.lightContainer : styles.darkContainer;

    function getPermission() {
        const getBarCodeScannerPermissions = async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setCameraPermissions(status === 'granted');
        };

        getBarCodeScannerPermissions();
    }

    useEffect(() => {
        const getBarCodeScannerPermissions = async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setCameraPermissions(status === 'granted');
        };

        getBarCodeScannerPermissions();
    }, []);

    const handleBarCodeScanned = ({ type, data }: any) => {
        setScanned(true);
        if (id == 'search') {
            router.replace({ pathname: '/search/[id]/', params: { id: data } });
        } else if (id == 'add') {
            setBarcodeCode(data)
            router.navigate({ pathname: '/add-food/[id]/', params: { id: data } })
        }
    };

    if (cameraPermissions === null) {
        return <Text>Requesting for camera permission</Text>;
    }
    if (cameraPermissions === false) {
        return (<View
            style={{
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Text>No access to camera, unable to scan barcodes.</Text>
            <Button onPress={getPermission} title="Enable Camera Permission" />
        </View>
        );
    }

    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    title: '______',
                    headerStyle: themeContainerStyle,
                    headerTintColor: themeTextStyle.color,
                    headerTitleStyle: {
                        fontWeight: 'bold',
                        color: '#414141'
                    },
                }}
            />
            <CameraView
                barcodeScannerSettings={{
                    barcodeTypes: ["ean13", "ean8", "upc_a", "upc_e"],
                }}
                onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                style={StyleSheet.absoluteFillObject}
            />
            {/* <BarCodeScanner
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                style={StyleSheet.absoluteFillObject}
            /> */}
            {scanned && <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
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
    }
});

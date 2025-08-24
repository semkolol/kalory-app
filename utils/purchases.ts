// utils/purchases.ts
import Purchases, { PurchasesPackage, CustomerInfo } from 'react-native-purchases';
import { Platform } from 'react-native';
import { router } from 'expo-router';
import { useConfigStore } from './state';

const API_KEYS = {
    apple: 'PUPLIC_REV_CAT_APPLE_API_KEY',
    google: 'PUPLIC_REV_CAT_GOOGLE_API_KEY',
};

const entitlementId = 'Kalory Full Version Once';

const handleProAccess = (customerInfo: CustomerInfo) => {
    const proAccess = customerInfo.entitlements.active[entitlementId] !== undefined;
    const { setIsPro, trialStartDate, clearTrialStartDate } = useConfigStore.getState();

    setIsPro(proAccess);

    if (proAccess) {
        if (trialStartDate) {
            clearTrialStartDate();
        }
        router.replace('/(tabs)');
    }
};

export const initPurchases = () => {
    if (Platform.OS === 'ios') {
        Purchases.configure({ apiKey: API_KEYS.apple });
    } else if (Platform.OS === 'android') {
        Purchases.configure({ apiKey: API_KEYS.google });
    }

    Purchases.addCustomerInfoUpdateListener(handleProAccess);
};

export const hasProAccess = async (): Promise<boolean> => {
    try {
        const customerInfo = await Purchases.getCustomerInfo();
        const proAccess = customerInfo.entitlements.active[entitlementId] !== undefined;
        useConfigStore.getState().setIsPro(proAccess);
        return proAccess;
    } catch (e) {
        console.error('Error checking pro access:', e);
        useConfigStore.getState().setIsPro(false);
        return false;
    }
};

export const makePurchase = async (pack: PurchasesPackage) => {
    try {
        const { customerInfo } = await Purchases.purchasePackage(pack);
        handleProAccess(customerInfo);
    } catch (e) {
        if (!e.userCancelled) {
            console.error('Error making purchase:', e);
        }
    }
};

export const restorePurchase = async () => {
    try {
        const customerInfo = await Purchases.restorePurchases();
        handleProAccess(customerInfo);
    } catch (e) {
        console.error('Error restoring purchase:', e);
    }
}


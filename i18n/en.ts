export const en = {
    // Navigation & Tabs
    tabs: {
        home: "Home",
        progress: "Progress",
        fasting: "Fasting",
        search: "Search",
        settings: "Settings",
    },

    home: {
        today: "Today",
    },

    progress: {
        noData: "No data available for this period.",
        currentGoals: "Current Goals",
        updateGoal: "Update",
        totalCalories: "Total Calories",
    },

    fasting: {
        title: "Fasting",
        duration: "16:8 Protocol",
        elapsed: "Elapsed",
        startTime: "Start Time",
        endTime: "End Time",
        start: "Start Fasting",
        stop: "End Fast",
        reset: "Reset",
    },

    // Food
    food: {
        noFoodTrackedToday: "No food tracked for this day",
        calorieOverGoal: "over goal",
        caloriesLeft: "calories left",
        calories: "Calories",
        protein: "Protein",
        carbs: "Carbs",
        fat: "Fat",
        calorieAndMacroGoals: "Calorie & Macro Goals",
        weightGoals: "Weight Goals",
        goal: "Goal",
        current: "Current",
        setMacroGoal: "Set Macro Goals",
        total: "Total",
        setWeightGoal: "Set Weight Goals",
        currentWeight: "Current Weight",
        goalWeight: "Goal Weight",
        NoResultSearch: "No results found for",
        searchInYourDb: "Search for foods in your database",
        searchFood: "Search foods...",
        editQuantity: "Edit quantity",
        foodItemNotFound: "Food item not found.",
        for: "for", // would be 'für' or 'per' in german, context is XX Calories 'for' 100g
        quantity: "Quantity",
        quantityRequired: "Quantity is required",
        quantityMustBeGreater: "Quantity must be greater than 0",
        addToDiary: "Add to Diary",
        deleteFood: "Delete Food",
        deleteWarningPartOne: "Are you sure you want to delete", // again this and the below form: `${t('food.deleteWarningPartOne')} "${itemName}" ${t('food.deleteWarningPartTwo')}`
        deleteWarningPartTwo: "from your database? This action cannot be undone.",
        caloriesShort: "Cal",
        ProteinShort: "P",
        CarbsShort: "C",
        FatShort: "F",
        dbEmpty: "Your food database is empty.",
        addFoodToDbNotice: "Press the '+' button to add a food or scan food with Ai.",
        foodNameEmptyError: "Food name cannot be empty.",
        editFood: "Edit Food",
        addFood: "Add Food",
        foodName: "Food Name",
        macros: "Macros",
        describeYourMeal: "Describe your meal",
        describeMealExample: "e.g., grilled chicken breast with rice and vegetables",
        analyzingNutrition: "Analyzing nutrition...",
        addDetails: "Add Details",
        addContext: "Additional Context",
        addContextExample: "e.g., 'large portion', 'cooked in olive oil', 'with sauce'",
        nutritionAnalysis: "Nutrition Analysis",
        serving: "Serving",
        doubleCheckWarning: "Always double check the output. Achieve the best results by adding more details with text, like name or weight and capture size context, like a fork next to your food."
    },

    // Settings Screen
    settings: {
        title: "Settings",
        language: "Language",
        notifications: "Notifications",
        reminderNotifications: "Reminder Notifications",
        notificationMessageTitle: "Reminder",
        notificationMessage: "Don't forget to complete your daily tasks!",
        tos: "Terms of Service",
        privacyPolicy: "Privacy Policy",
        unlockFullAccess: "Unlock Full Access",
        aiSettings: "Ai Settings",
        foodDatabase: "Food Database",
        aiProviderNotSelected: "AI Provider Not Selected",
        aiProviderNotice: "Please select an AI provider to start scanning and analyzing your documents.",
        selectAiProvider: "Select AI Provider",
        apiKeyRequired: "API Key Required",
        pleaseAddYour: "Please add your", // this and the one below build: `${t('settings.pleaseAddYour')} ${providerName} ${t('settings.apiKeyToUseFeatures')}`
        apiKeyToUseFeatures: "API key to use AI features.",
        addApiKey: "Add API Key",
        aiServiceInfoMessage: "AI features require proper configuration to work correctly.",
        pleaseEnterYour: "Please enter your", // again this and the below form: `${t('settings.pleaseEnterYour')} ${selectedProviderData.name} ${t('settings.apiKeyToContinue')}.`
        apiKeyToContinue: "API key to continue",
        aiProvider: "AI Provider",
        apiKey: "API Key",
        youllNeedApiKeyFrom: "You'll need an API key from", // this and below form: `${t('settings.youllNeedApiKeyFrom')} ${selectedProviderData?.name} ${t('settings.apiKeyNoticeSecondPart')}.`
        apiKeyNoticeSecondPart: "to use their AI models. Your key is stored securely on your device. Please visit their Platform to generate one, if you didn't already",
        localModelNotice: "runs locally on your device and doesn't require an API key",
        estimatedMonthlyCost: "Estimated monthly cost: $1 for moderate use (around 10 scans per day).",
        cameraAccessRequired: "Camera Access Required",
        allowCameraAccess: "Allow camera access to scan and analyze your food for nutritional information.",
        enableCamera: "Continue",
        cameraAccessDenied: "Camera Access Denied",
        enableCameraInSettings: "You have denied camera access. Please enable it in your device settings.",
        openSettings: "Open Settings"
    },

    // Language Settings
    language: {
        title: "Language",
        english: "English",
        german: "Deutsch",
        french: "Français",
        italian: "Italiano",
        japanese: "日本語",
        chinese: "中文",
    },

    // Notification Settings
    notifications: {
        title: "Notifications",
        reminderNotifications: "Reminder Notifications",
        reminderTime: "Reminder Time",
        permissionRequired: "Permission Required",
        permissionMessage: "You need to enable notifications in your device settings to receive reminders.",
        infoMessage: "Daily reminders help you stay consistent with your calorie tracking.",
        notificationTitle: "Daily Reminder",
        notificationBody: "Don't forget to track your calories!",
    },

    // Onboarding
    onboarding: {
        welcome: "Welcome to Kalory",
        calculateCaloriesTitle: "Let's calculate your daily calories",
        setGoalsTitle: "Let's set your goals",
        yourDailyCalories: "Your daily calories",
        adjustPreference: "Adjust below to meet your preference",
        basedOnMifflin: "Based on Mifflin-St Jeor Equation",
        calculatingCalories: "Calculating calories...",
    },

    // Common
    common: {
        ok: "OK",
        yes: "Yes",
        no: "No",
        done: "Done",
        close: "Close",
        change: "Change",
        cancel: "Cancel",
        save: "Save",
        goBack: "Go Back!",
        thisScreenDoesntExist: "This screen doesn't exist.",
        delete: "Delete",
        continue: "Continue",
        continueToNextPage: "Continue to next page",
    },

    error: {
        validationError: "Validation Error"
    },

    paywall: {
        title: "Start Your Free Trial",
        message: "Enjoy 7 days of full access for free.",
        featureNoAds: "✓ No Ads, No Subscriptions",
        featureOffline: "✓ 100% Local & Offline Accessible",
        featureLifetime: "✓ One-Time Purchase for Lifetime Access",
        trialInfo: "7 days free, then {price} once",
        disclaimerPrefix: "After the 7-day trial, you will ",
        disclaimerBold: "not",
        disclaimerSuffix: " be charged automatically. You will be asked to make a one-time payment to continue using the app.",
        startTrialButton: "Start 7-Day Free Trial",
        trialExpiredMessage: "Purchase the app to unlock all features and use it forever.",
        purchaseButton: "Purchase Full Access - {price} once",
        restorePurchaseButton: "Restore Purchase",
        errorTitle: "An Error Occurred",
        tryAgainButton: "Try Again",
        errorNoProducts: "Couldn't find any products.",
        errorFetchOfferings: "Error fetching offerings. Please check your connection or try again later.",
    }
} as const;

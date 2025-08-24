// i18n/de.ts
export const de = {
    // Navigation & Tabs
    tabs: {
        home: "Home",
        progress: "Fortschritt",
        fasting: "Fasten",
        search: "Suche",
        settings: "Einstellungen",
    },

    home: {
        today: "Heute",
    },

    progress: {
        noData: "Für diesen Zeitraum sind keine Daten verfügbar.",
        currentGoals: "Aktuelle Ziele",
        updateGoal: "Aktualisieren",
        totalCalories: "Gesamtkalorien",
    },

    fasting: {
        title: "Fasten",
        duration: "16:8 Protokoll",
        elapsed: "Verstrichen",
        startTime: "Startzeit",
        endTime: "Endzeit",
        start: "Fasten starten",
        stop: "Fasten beenden",
        reset: "Zurücksetzen",
    },

    // Food
    food: {
        noFoodTrackedToday: "Keine Lebensmittel für diesen Tag erfasst",
        calorieOverGoal: "über dem Ziel",
        caloriesLeft: "Kalorien übrig",
        calories: "Kalorien",
        protein: "Protein",
        carbs: "Kohlen.",
        fat: "Fett",
        calorieAndMacroGoals: "Kalorien- & Makroziele",
        weightGoals: "Gewichtsziele",
        goal: "Ziel",
        current: "Aktuell",
        setMacroGoal: "Makroziele festlegen",
        total: "Gesamt",
        setWeightGoal: "Gewichtsziel festlegen",
        currentWeight: "Aktuelles Gewicht",
        goalWeight: "Zielgewicht",
        NoResultSearch: "Keine Ergebnisse gefunden für",
        searchInYourDb: "Suche Lebensmittel in deiner Datenbank",
        searchFood: "Lebensmittel suchen...",
        editQuantity: "Menge bearbeiten",
        foodItemNotFound: "Lebensmittel nicht gefunden.",
        for: "pro", // Context: XX Kalorien 'pro' 100g
        quantity: "Menge",
        quantityRequired: "Mengenangabe erforderlich",
        quantityMustBeGreater: "Menge muss größer als 0 sein",
        addToDiary: "Zum Tagebuch hinzufügen",
        deleteFood: "Lebensmittel löschen",
        deleteWarningPartOne: "Möchtest du wirklich", // Combined: "Möchtest du wirklich [itemName] aus deiner Datenbank löschen? ..."
        deleteWarningPartTwo: "aus deiner Datenbank löschen? Diese Aktion kann nicht rückgängig gemacht werden.",
        caloriesShort: "Kcal",
        ProteinShort: "P",
        CarbsShort: "K", // K for Kohlenhydrate
        FatShort: "F",
        dbEmpty: "Deine Lebensmittel-Datenbank ist leer.",
        addFoodToDbNotice: "Drücke den '+' Button, um ein Lebensmittel hinzuzufügen oder mit der KI zu scannen.",
        foodNameEmptyError: "Der Name des Lebensmittels darf nicht leer sein.",
        editFood: "Lebensmittel bearbeiten",
        addFood: "Lebensmittel hinzufügen",
        foodName: "Name des Lebensmittels",
        macros: "Makros",
        describeYourMeal: "Beschreibe deine Mahlzeit",
        describeMealExample: "z.B. gegrillte Hähnchenbrust mit Reis und Gemüse",
        analyzingNutrition: "Nährwerte werden analysiert...",
        addDetails: "Details hinzufügen",
        addContext: "Zusätzlicher Kontext",
        addContextExample: "z.B. 'große Portion', 'in Olivenöl gebraten', 'mit Soße'",
        nutritionAnalysis: "Nährwertanalyse",
        serving: "Portion",
        doubleCheckWarning: "Überprüfe das Resultat immer. Für die besten Ergebnisse füge mehr Details wie Name oder Gewicht hinzu und erfasse den Größenkontext, z.B. mit einer Gabel neben deinem Essen."
    },

    // Settings Screen
    settings: {
        title: "Einstellungen",
        language: "Sprache",
        notifications: "Benachrichtigungen",
        reminderNotifications: "Erinnerungen",
        notificationMessageTitle: "Erinnerung",
        notificationMessage: "Vergiss nicht, deine täglichen Einträge zu machen!",
        tos: "Nutzungsbedingungen",
        privacyPolicy: "Datenschutzerklärung",
        unlockFullAccess: "Vollversion freischalten",
        aiSettings: "KI-Einstellungen",
        foodDatabase: "Lebensmittel-Datenbank",
        aiProviderNotSelected: "Kein KI-Anbieter ausgewählt",
        aiProviderNotice: "Bitte wähle einen KI-Anbieter aus, um mit dem Scannen zu beginnen.",
        selectAiProvider: "KI-Anbieter auswählen",
        apiKeyRequired: "API-Schlüssel erforderlich",
        pleaseAddYour: "Bitte füge deinen", // Combined: "Bitte füge deinen [providerName] API-Schlüssel hinzu..."
        apiKeyToUseFeatures: "API-Schlüssel hinzu, um die KI-Funktionen zu nutzen.",
        addApiKey: "API-Schlüssel hinzufügen",
        aiServiceInfoMessage: "Die KI-Funktionen erfordern eine korrekte Konfiguration, um richtig zu funktionieren.",
        pleaseEnterYour: "Bitte gib deinen", // Combined: "Bitte gib deinen [providerName] API-Schlüssel ein..."
        apiKeyToContinue: "API-Schlüssel ein, um fortzufahren",
        aiProvider: "KI-Anbieter",
        apiKey: "API-Schlüssel",
        youllNeedApiKeyFrom: "Du benötigst einen API-Schlüssel von", // Combined: "Du benötigst einen API-Schlüssel von [providerName] um deren KI-Modelle zu nutzen."
        apiKeyNoticeSecondPart: "um deren KI-Modelle zu nutzen. Dein Schlüssel wird sicher auf deinem Gerät gespeichert. Bitte besuche deren Plattform, um einen zu erstellen, falls du noch keinen hast.",
        localModelNotice: "läuft lokal auf deinem Gerät und benötigt keinen API-Schlüssel",
        estimatedMonthlyCost: "Geschätzte monatliche Kosten: 1€ bei moderater Nutzung (ca. 10 Scans pro Tag).",
        cameraAccessRequired: "Kamerazugriff erforderlich",
        allowCameraAccess: "Erlaube den Kamerazugriff, um deine Lebensmittel zu scannen und auf Nährwerte zu analysieren.",
        enableCamera: "Weiter",
        cameraAccessDenied: "Kamerazugriff verweigert",
        enableCameraInSettings: "Sie haben den Kamerazugriff verweigert. Bitte aktivieren Sie ihn in den Einstellungen Ihres Geräts.",
        openSettings: "Einstellungen öffnen"
    },

    // Language Settings
    language: {
        title: "Sprache",
        english: "English",
        german: "Deutsch",
        french: "Français",
        italian: "Italiano",
        japanese: "日本語",
        chinese: "中文",
    },

    // Notification Settings
    notifications: {
        title: "Benachrichtigungen",
        reminderNotifications: "Erinnerungen",
        reminderTime: "Erinnerungszeit",
        permissionRequired: "Berechtigung erforderlich",
        permissionMessage: "Du musst Benachrichtigungen in den Geräteeinstellungen aktivieren, um Erinnerungen zu erhalten.",
        infoMessage: "Tägliche Erinnerungen helfen dir, beim Kalorien-Tracking konsequent zu bleiben.",
        notificationTitle: "Tägliche Erinnerung",
        notificationBody: "Vergiss nicht, deine Kalorien zu tracken!",
    },

    // Onboarding
    onboarding: {
        welcome: "Willkommen bei Kalory",
        calculateCaloriesTitle: "Berechnen wir deine täglichen Kalorien",
        setGoalsTitle: "Dein Ziel",
        yourDailyCalories: "Deine täglichen Kalorien",
        adjustPreference: "Du kannst deine Kalorien unten anpassen",
        basedOnMifflin: "Basierend auf der Mifflin-St Jeor Gleichung",
        calculatingCalories: "Kalorien werden berechnet...",
    },

    goals: {
        selectYourGoal: "Wähle dein Ziel",
        loseWeight: "Gewicht verlieren",
        maintain: "Gewicht halten",
        gainWeight: "Gewicht zunehmen",
    },

    // Common
    common: {
        ok: "OK",
        yes: "Ja",
        no: "Nein",
        done: "Fertig",
        close: "Schließen",
        change: "Ändern",
        cancel: "Abbrechen",
        save: "Speichern",
        goBack: "Zurück",
        thisScreenDoesntExist: "Dieser Bildschirm existiert nicht.",
        delete: "Löschen",
        continue: "Weiter",
        continueToNextPage: "Weiter zur nächsten Seite",
        low: "Niedrig",
        medium: "Mittel",
        high: "Hoch",
        activityLevel: "Aktivitätslevel",
        skinny: "Schlank",
        neutral: "Neutral",
        overweight: "Übergewichtig",
        bodyType: "Körpertyp",
        male: "Männlich",
        female: "Weiblich",
        toLose: "Zu verlieren:",
        toGain: "Zuzunehmen:",
        height: "Größe",
        age: "Alter",
    },

    error: {
        validationError: "Validierungsfehler"
    },

    paywall: {
        title: "Kostenlose Testversion starten",
        message: "Genieße 7 Tage vollen Zugriff kostenlos.",
        featureNoAds: "✓ Keine Werbung, keine Abonnements",
        featureOffline: "✓ 100% lokal & offline zugänglich",
        featureLifetime: "✓ Einmaliger Kauf für lebenslangen Zugriff",
        trialInfo: "7 Tage kostenlos, dann {price} einmalig",
        disclaimerPrefix: "Nach der 7-tägigen Testphase werden Sie ",
        disclaimerBold: "nicht",
        disclaimerSuffix: " automatisch belastet. Sie werden gebeten, eine einmalige Zahlung zu leisten, um die App weiterhin nutzen zu können.",
        startTrialButton: "7-Tage kostenlose Testversion starten",
        trialExpiredMessage: "Kaufe die App, um alle Funktionen freizuschalten und für immer zu nutzen.",
        purchaseButton: "Vollzugriff kaufen - {price} einmalig",
        restorePurchaseButton: "Kauf wiederherstellen",
        errorTitle: "Ein Fehler ist aufgetreten",
        tryAgainButton: "Erneut versuchen",
        errorNoProducts: "Es konnten keine Produkte gefunden werden.",
        errorFetchOfferings: "Fehler beim Abrufen der Angebote. Bitte überprüfen Sie Ihre Verbindung oder versuchen Sie es später erneut.",
    }
} as const;

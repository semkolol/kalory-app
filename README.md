<p align="center">
  <picture>
    <img src="https://github.com/semkolol/kalory-app/blob/master/assets/icon.png" height="100" alt="Kalory logo">
  </picture>
</p>

<p align="center">
  <strong>AI-Powered Meal Tracking</strong>
</p>

<p align="center">
  <a href="https://apps.apple.com/us/app/kalory-ai-calorie-counter/id6478826572?platform=iphone">
    Kalory:
  </a> 
  Open Source and Private Alternative to YAZIO, MyFitnessPal, CalAI.
</p>

# Getting Started

Welcome to setting up the app! Follow these steps to get it running locally. The app operates fully offline, handling user data and in-app purchase logic locally. *(Note: Be aware of potential challenges with local in-app purchase handling.)*

## Prerequisites

Before you begin, ensure you have the following:

- **Node.js**: Download and install from [nodejs.org](https://nodejs.org/en/download).
- **Compatible Device**: A simulator or physical device running at least **iOS 15** or equivalent Android version.
- **Accounts for In-App Purchases** (optional):
  - [RevenueCat](https://www.revenuecat.com/) account.
  - [Apple Developer](https://developer.apple.com/) account.
- **API Key for AI Scan Feature** (optional):
  - [OpenAI](https://platform.openai.com/) or [Google Gemini](https://ai.google.dev/) API key.

## Configuration

To enable specific features, configure the following:

1. **In-App Purchases**:
   - Sign up for a RevenueCat account and an Apple Developer account.
   - Replace the API keys in the following file:
     ```bash
     @/utils/purchases.ts
     ```

2. **AI Scan Feature**:
   - Obtain an API key from OpenAI or Google Gemini.
   - Update the relevant configuration file with your API key (check the project documentation for the exact file).

## Running Locally

Follow these steps to run the app on your local machine:

1. **Navigate to the Project Directory**:
   Open your terminal and go to the root directory of the project:
   ```bash
   cd /path/to/your/project
   ```

2. **Install Dependencies**:
   Install all required dependencies using npm:
   ```bash
   npm install
   ```

3. **Run the App**:
   Use one of the following commands to run the app on your chosen platform:
   - For iOS:
     ```bash
     npx expo run:ios -d
     ```
   - For Android:
     ```bash
     npx expo run:android -d
     ```
   *Note*: The `-d` flag allows you to select a specific device or simulator.

4. **Development Note**:
   The app was developed with an **iOS-first** approach, so some features may perform better on iOS devices or simulators.

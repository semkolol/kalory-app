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

## Getting Started
### Prerequisites

Node.js
https://nodejs.org/en/download

Having a compatible Simulator or Physical Device, at least iOS 15

The app is fully local, user data, in-app purchase logic etc. even the AI API calls and your API-Keys so no server stuff needed.
(I'm aware of the "issues" when handling in-app purchases locally)

## Config
If you want the in-app purchases to work, you will need an revenue-cat account and a apple developer account and replace the API-Keys in @/utils/purchases.ts

You'll also need an OpenAI or Google Gemini API-Key to use the AI Scan feature.

## Run Locally
Go into the root directory with your terminal

Install dependencies
``
  npm install
``

Run locally
``
  npx expo run:ios -d

  or

  npx expo run:android -d
``

-d to choose device

Note: that the app was developed iOS-first in mind

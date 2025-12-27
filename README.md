# RTX AI - React Native Expo App

This is a [**React Native**](https://reactnative.dev) AI chat application built with [**Expo**](https://expo.dev).

## Important Note

This app uses `react-native-reanimated` which requires native code. You **cannot** run this app in Expo Go. You need to:

1. Use a development build with `npx expo run:android` or `npx expo run:ios`
2. OR use an Android Emulator / iOS Simulator

## Getting Started

### Prerequisites

- Node.js >= 20
- npm or yarn
- **For Android**: Android Studio with emulator OR physical device
- **For iOS**: macOS with Xcode and iOS Simulator

### Installation

1. Install dependencies:

```sh
npm install
```

### Running the App

#### Option 1: Run on Android Emulator/Device (Recommended)

Make sure Android Studio is installed and an emulator is running, then:

```sh
npx expo run:android
```

This will:
- Build a development version of the app with native code
- Install it on your emulator/device
- Start the Metro bundler

#### Option 2: Run on iOS Simulator (macOS only)

Make sure Xcode is installed, then:

```sh
npx expo run:ios
```

#### Option 3: Development Server Only

```sh
npm start
```

Then press `a` for Android or `i` for iOS. Note: This creates a development build, not Expo Go.

#### Clearing Cache

If you encounter build errors, try clearing the cache:

```sh
npx expo start -c
```

Or for a complete clean:

```sh
rm -rf node_modules
npm install
npx expo run:android
```

### Development

- **Linting**: Run `npm run lint` to check code style
- **Testing**: Run `npm run test` to run tests

## Features

- AI-powered chat interface
- Multiple conversation management
- Settings customization
- Dark/Light theme support
- Persistent storage
- Markdown message rendering

## Tech Stack

- **Expo SDK 54** - Development framework
- **React Native** - Mobile framework
- **TypeScript** - Type safety
- **React Navigation** - Navigation with Drawer
- **React Native Reanimated** - Smooth animations
- **Zustand** - State management
- **Axios** - HTTP client
- **Expo Vector Icons** - Icons
- **Expo Clipboard** - Clipboard functionality
- **Expo FileSystem** - Local storage

## Project Structure

```
.
├── assets/          # Images, fonts, and other assets
├── src/
│   ├── components/  # Reusable UI components
│   ├── constants/   # App constants and configuration
│   ├── navigation/  # Navigation setup
│   ├── screens/     # Screen components
│   ├── services/    # API and storage services
│   ├── store/       # State management
│   ├── types/       # TypeScript type definitions
│   └── utils/       # Utility functions
├── App.tsx          # Root component
├── app.json         # Expo configuration
└── package.json     # Dependencies and scripts
```

## Troubleshooting

### Reanimated NullPointerException

If you see errors related to `ReanimatedModule`, make sure you:

1. Cleared the cache: `npx expo start -c`
2. Reinstalled dependencies: `rm -rf node_modules && npm install`
3. Used `npx expo run:android` instead of Expo Go

The app uses native modules and requires a development build.

## License

See the [LICENSE](LICENSE) file for details.

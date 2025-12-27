# RTX AI - React Native Expo App

This is a [**React Native**](https://reactnative.dev) AI chat application built with [**Expo**](https://expo.dev).

## Getting Started

### Prerequisites

- Node.js >= 20
- npm or yarn
- Expo Go app on your mobile device (for testing)

### Installation

1. Install dependencies:

```sh
npm install
```

### Running the App

#### Start the Development Server

```sh
npm start
```

This will start the Expo development server. You can then:

- Press `a` to open on Android emulator
- Press `i` to open on iOS simulator (macOS only)
- Scan the QR code with Expo Go app on your phone

#### Run on Android

```sh
npm run android
```

#### Run on iOS

```sh
npm run ios
```

Note: iOS development requires macOS.

#### Run on Web

```sh
npm run web
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
- **React Navigation** - Navigation
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

## License

See the [LICENSE](LICENSE) file for details.

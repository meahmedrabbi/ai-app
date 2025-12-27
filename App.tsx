/**
 * RTX AI - React Native AI Chat Application
 * Built with Expo
 *
 * @format
 */

import React from 'react';
import {StatusBar} from 'expo-status-bar';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {AppNavigator} from './src/navigation';

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <AppNavigator />
    </SafeAreaProvider>
  );
}

export default App;

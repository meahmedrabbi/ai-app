/**
 * RTX AI - React Native AI Chat Application
 * Built with React Native CLI
 *
 * @format
 */

import React from 'react';
import {StatusBar} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {AppNavigator} from './src/navigation';
import {Colors} from './src/constants';

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle="light-content"
        backgroundColor={Colors.shadowGrey}
      />
      <AppNavigator />
    </SafeAreaProvider>
  );
}

export default App;

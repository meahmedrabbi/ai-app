/**
 * RTX AI App Navigation
 * Main navigation structure with drawer and stack navigators
 */

import React, {useEffect, useCallback} from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {StyleSheet} from 'react-native';
import type {DrawerContentComponentProps} from '@react-navigation/drawer';
import {ChatScreen, SettingsScreen, AboutScreen} from '../screens';
import DrawerContent from './DrawerContent';
import {useChatStore} from '../store';
import {Colors, UIConfig} from '../constants';
import type {RootStackParamList, DrawerParamList} from '../types';

const Drawer = createDrawerNavigator<DrawerParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

const DrawerNavigator: React.FC = () => {
  const renderDrawerContent = useCallback(
    (props: DrawerContentComponentProps) => <DrawerContent {...props} />,
    [],
  );

  return (
    <Drawer.Navigator
      drawerContent={renderDrawerContent}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          width: UIConfig.drawerWidth,
          backgroundColor: Colors.parchment,
        },
        drawerType: 'front',
        overlayColor: 'rgba(0,0,0,0.4)',
        swipeEnabled: true,
        swipeEdgeWidth: 50,
      }}>
      <Drawer.Screen name="Chat" component={ChatScreen} />
    </Drawer.Navigator>
  );
};

const AppNavigator: React.FC = () => {
  const initialize = useChatStore(state => state.initialize);

  useEffect(() => {
    // Initialize store on app launch
    initialize();
  }, [initialize]);

  return (
    <GestureHandlerRootView style={styles.container}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
          }}>
          <Stack.Screen name="Main" component={DrawerNavigator} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="About" component={AboutScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default AppNavigator;

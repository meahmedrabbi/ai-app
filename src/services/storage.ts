/**
 * RTX AI Storage Service
 * Handles persistent storage using AsyncStorage
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import {StorageKeys} from '../constants';
import type {Chat, Settings} from '../types';

/**
 * Save chats to AsyncStorage
 */
export const saveChats = async (chats: Chat[]): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(chats);
    await AsyncStorage.setItem(StorageKeys.CHATS, jsonValue);
  } catch (error) {
    console.error('Error saving chats:', error);
    throw error;
  }
};

/**
 * Load chats from AsyncStorage
 */
export const loadChats = async (): Promise<Chat[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(StorageKeys.CHATS);
    if (jsonValue !== null) {
      return JSON.parse(jsonValue) as Chat[];
    }
    return [];
  } catch (error) {
    console.error('Error loading chats:', error);
    return [];
  }
};

/**
 * Save API key to AsyncStorage
 */
export const saveApiKey = async (apiKey: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(StorageKeys.API_KEY, apiKey);
  } catch (error) {
    console.error('Error saving API key:', error);
    throw error;
  }
};

/**
 * Load API key from AsyncStorage
 */
export const loadApiKey = async (): Promise<string | null> => {
  try {
    const apiKey = await AsyncStorage.getItem(StorageKeys.API_KEY);
    return apiKey;
  } catch (error) {
    console.error('Error loading API key:', error);
    return null;
  }
};

/**
 * Remove API key from AsyncStorage
 */
export const removeApiKey = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(StorageKeys.API_KEY);
  } catch (error) {
    console.error('Error removing API key:', error);
    throw error;
  }
};

/**
 * Save settings to AsyncStorage
 */
export const saveSettings = async (settings: Settings): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(settings);
    await AsyncStorage.setItem(StorageKeys.SETTINGS, jsonValue);
  } catch (error) {
    console.error('Error saving settings:', error);
    throw error;
  }
};

/**
 * Load settings from AsyncStorage
 */
export const loadSettings = async (): Promise<Settings | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(StorageKeys.SETTINGS);
    if (jsonValue !== null) {
      return JSON.parse(jsonValue) as Settings;
    }
    return null;
  } catch (error) {
    console.error('Error loading settings:', error);
    return null;
  }
};

/**
 * Clear all app data from AsyncStorage
 */
export const clearAllData = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([
      StorageKeys.CHATS,
      StorageKeys.API_KEY,
      StorageKeys.SETTINGS,
    ]);
  } catch (error) {
    console.error('Error clearing all data:', error);
    throw error;
  }
};

/**
 * Clear only chats from AsyncStorage
 */
export const clearChats = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(StorageKeys.CHATS);
  } catch (error) {
    console.error('Error clearing chats:', error);
    throw error;
  }
};

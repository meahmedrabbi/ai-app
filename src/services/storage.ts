/**
 * RTX AI Storage Service
 * Handles persistent storage using Expo FileSystem
 */

import * as FileSystem from 'expo-file-system';
import {StorageKeys} from '../constants';
import type {Chat, Settings} from '../types';

const getFilePath = (key: string): string => {
  return `${FileSystem.documentDirectory}${key}.json`;
};

const writeData = async (key: string, value: string): Promise<void> => {
  try {
    const filePath = getFilePath(key);
    await FileSystem.writeAsStringAsync(filePath, value);
  } catch (error) {
    console.error(`Error writing data for key ${key}:`, error);
    throw error;
  }
};

const readData = async (key: string): Promise<string | null> => {
  try {
    const filePath = getFilePath(key);
    const fileInfo = await FileSystem.getInfoAsync(filePath);
    if (fileInfo.exists) {
      return await FileSystem.readAsStringAsync(filePath);
    }
    return null;
  } catch (error) {
    console.error(`Error reading data for key ${key}:`, error);
    return null;
  }
};

const removeData = async (key: string): Promise<void> => {
  try {
    const filePath = getFilePath(key);
    const fileInfo = await FileSystem.getInfoAsync(filePath);
    if (fileInfo.exists) {
      await FileSystem.deleteAsync(filePath);
    }
  } catch (error) {
    console.error(`Error removing data for key ${key}:`, error);
    throw error;
  }
};

/**
 * Save chats to storage
 */
export const saveChats = async (chats: Chat[]): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(chats);
    await writeData(StorageKeys.CHATS, jsonValue);
  } catch (error) {
    console.error('Error saving chats:', error);
    throw error;
  }
};

/**
 * Load chats from storage
 */
export const loadChats = async (): Promise<Chat[]> => {
  try {
    const jsonValue = await readData(StorageKeys.CHATS);
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
 * Save API key to storage
 */
export const saveApiKey = async (apiKey: string): Promise<void> => {
  try {
    await writeData(StorageKeys.API_KEY, apiKey);
  } catch (error) {
    console.error('Error saving API key:', error);
    throw error;
  }
};

/**
 * Load API key from storage
 */
export const loadApiKey = async (): Promise<string | null> => {
  try {
    const apiKey = await readData(StorageKeys.API_KEY);
    return apiKey;
  } catch (error) {
    console.error('Error loading API key:', error);
    return null;
  }
};

/**
 * Remove API key from storage
 */
export const removeApiKey = async (): Promise<void> => {
  try {
    await removeData(StorageKeys.API_KEY);
  } catch (error) {
    console.error('Error removing API key:', error);
    throw error;
  }
};

/**
 * Save settings to storage
 */
export const saveSettings = async (settings: Settings): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(settings);
    await writeData(StorageKeys.SETTINGS, jsonValue);
  } catch (error) {
    console.error('Error saving settings:', error);
    throw error;
  }
};

/**
 * Load settings from storage
 */
export const loadSettings = async (): Promise<Settings | null> => {
  try {
    const jsonValue = await readData(StorageKeys.SETTINGS);
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
 * Clear all app data from storage
 */
export const clearAllData = async (): Promise<void> => {
  try {
    await Promise.all([
      removeData(StorageKeys.CHATS),
      removeData(StorageKeys.API_KEY),
      removeData(StorageKeys.SETTINGS),
    ]);
  } catch (error) {
    console.error('Error clearing all data:', error);
    throw error;
  }
};

/**
 * Clear only chats from storage
 */
export const clearChats = async (): Promise<void> => {
  try {
    await removeData(StorageKeys.CHATS);
  } catch (error) {
    console.error('Error clearing chats:', error);
    throw error;
  }
};

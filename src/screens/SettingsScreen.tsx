/**
 * RTX AI Settings Screen
 * Configuration for API key, model selection, and generation parameters
 */

import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  Platform,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import {useChatStore} from '../store';
import {Colors, ModelOptions, APIConfig, AppInfo} from '../constants';
import {isValidApiKey} from '../utils';
import {Header} from '../components';
import type {RootStackParamList} from '../types';

type SettingsScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Settings'
>;

const SettingsScreen: React.FC = () => {
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const {apiKey, settings, setApiKey, updateSettings, clearAllChats} =
    useChatStore();

  const [localApiKey, setLocalApiKey] = useState(apiKey || '');
  const [showApiKey, setShowApiKey] = useState(false);
  const [selectedModel, setSelectedModel] = useState(settings.model);
  const [temperature, setTemperature] = useState(settings.temperature);
  const [maxTokens, setMaxTokens] = useState(settings.maxTokens);

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleSaveApiKey = useCallback(() => {
    if (!localApiKey.trim()) {
      Alert.alert('Error', 'Please enter an API key');
      return;
    }

    if (!isValidApiKey(localApiKey.trim())) {
      Alert.alert(
        'Warning',
        'API key format seems incorrect. HuggingFace keys typically start with "hf_". Save anyway?',
        [
          {text: 'Cancel', style: 'cancel'},
          {
            text: 'Save',
            onPress: () => {
              setApiKey(localApiKey.trim());
              Alert.alert('Success', 'API key saved successfully');
            },
          },
        ],
      );
      return;
    }

    setApiKey(localApiKey.trim());
    Alert.alert('Success', 'API key saved successfully');
  }, [localApiKey, setApiKey]);

  const handleModelSelect = useCallback(
    (model: string) => {
      setSelectedModel(model);
      updateSettings({model});
    },
    [updateSettings],
  );

  const handleTemperatureChange = useCallback(
    (value: number) => {
      const roundedValue = Math.round(value * 10) / 10;
      setTemperature(roundedValue);
      updateSettings({temperature: roundedValue});
    },
    [updateSettings],
  );

  const handleMaxTokensChange = useCallback(
    (value: number) => {
      const roundedValue = Math.round(value);
      setMaxTokens(roundedValue);
      updateSettings({maxTokens: roundedValue});
    },
    [updateSettings],
  );

  const handleClearAllChats = useCallback(() => {
    Alert.alert(
      'Clear All Chats',
      'Are you sure you want to delete all chat history? This action cannot be undone.',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete All',
          style: 'destructive',
          onPress: () => {
            clearAllChats();
            Alert.alert('Success', 'All chats have been deleted');
          },
        },
      ],
    );
  }, [clearAllChats]);

  const handleAbout = useCallback(() => {
    navigation.navigate('About');
  }, [navigation]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title="Settings"
        showMenu={false}
        showSettings={false}
        leftIcon="arrow-back"
        onLeftPress={handleBack}
      />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* API Key Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>HuggingFace API Key</Text>
          <Text style={styles.sectionDescription}>
            Enter your HuggingFace API key to enable AI chat functionality.
            Get your key at huggingface.co/settings/tokens
          </Text>

          <View style={styles.apiKeyContainer}>
            <TextInput
              style={styles.apiKeyInput}
              value={localApiKey}
              onChangeText={setLocalApiKey}
              placeholder="hf_..."
              placeholderTextColor={Colors.mutedText}
              secureTextEntry={!showApiKey}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity
              style={styles.visibilityButton}
              onPress={() => setShowApiKey(!showApiKey)}>
              <Icon
                name={showApiKey ? 'visibility-off' : 'visibility'}
                size={24}
                color={Colors.mutedText}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSaveApiKey}>
            <Icon name="save" size={20} color={Colors.white} />
            <Text style={styles.saveButtonText}>Save API Key</Text>
          </TouchableOpacity>
        </View>

        {/* Model Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AI Model</Text>
          <Text style={styles.sectionDescription}>
            Select the language model to use for generating responses.
          </Text>

          <View style={styles.modelOptions}>
            {ModelOptions.map(model => (
              <TouchableOpacity
                key={model.value}
                style={[
                  styles.modelOption,
                  selectedModel === model.value && styles.modelOptionSelected,
                ]}
                onPress={() => handleModelSelect(model.value)}>
                <Text
                  style={[
                    styles.modelOptionText,
                    selectedModel === model.value &&
                      styles.modelOptionTextSelected,
                  ]}>
                  {model.label}
                </Text>
                {selectedModel === model.value && (
                  <Icon name="check" size={18} color={Colors.white} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Generation Parameters */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Generation Parameters</Text>

          {/* Temperature */}
          <View style={styles.sliderContainer}>
            <View style={styles.sliderHeader}>
              <Text style={styles.sliderLabel}>Temperature</Text>
              <Text style={styles.sliderValue}>{temperature.toFixed(1)}</Text>
            </View>
            <Slider
              style={styles.slider}
              minimumValue={APIConfig.temperature.min}
              maximumValue={APIConfig.temperature.max}
              value={temperature}
              onSlidingComplete={handleTemperatureChange}
              minimumTrackTintColor={Colors.fadedCopper}
              maximumTrackTintColor={Colors.khakiBeige}
              thumbTintColor={Colors.fadedCopper}
            />
            <Text style={styles.sliderDescription}>
              Higher values make output more random, lower values more focused.
            </Text>
          </View>

          {/* Max Tokens */}
          <View style={styles.sliderContainer}>
            <View style={styles.sliderHeader}>
              <Text style={styles.sliderLabel}>Max Tokens</Text>
              <Text style={styles.sliderValue}>{maxTokens}</Text>
            </View>
            <Slider
              style={styles.slider}
              minimumValue={APIConfig.maxNewTokens.min}
              maximumValue={APIConfig.maxNewTokens.max}
              value={maxTokens}
              onSlidingComplete={handleMaxTokensChange}
              minimumTrackTintColor={Colors.fadedCopper}
              maximumTrackTintColor={Colors.khakiBeige}
              thumbTintColor={Colors.fadedCopper}
              step={64}
            />
            <Text style={styles.sliderDescription}>
              Maximum length of the generated response.
            </Text>
          </View>
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, styles.dangerTitle]}>
            Danger Zone
          </Text>

          <TouchableOpacity
            style={styles.dangerButton}
            onPress={handleClearAllChats}>
            <Icon name="delete-forever" size={20} color={Colors.error} />
            <Text style={styles.dangerButtonText}>Clear All Chats</Text>
          </TouchableOpacity>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>

          <TouchableOpacity style={styles.aboutButton} onPress={handleAbout}>
            <View style={styles.aboutContent}>
              <Text style={styles.aboutAppName}>{AppInfo.name}</Text>
              <Text style={styles.aboutVersion}>Version {AppInfo.version}</Text>
            </View>
            <Icon name="chevron-right" size={24} color={Colors.mutedText} />
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.shadowGrey,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.parchment,
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.khakiBeige,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.shadowGrey,
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: Colors.mutedText,
    marginBottom: 16,
    lineHeight: 20,
  },
  apiKeyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  apiKeyInput: {
    flex: 1,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.khakiBeige,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
    fontSize: 15,
    color: Colors.shadowGrey,
  },
  visibilityButton: {
    padding: 12,
    marginLeft: 8,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.fadedCopper,
    paddingVertical: 14,
    borderRadius: 12,
  },
  saveButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  modelOptions: {
    gap: 10,
  },
  modelOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.khakiBeige,
    marginBottom: 8,
  },
  modelOptionSelected: {
    backgroundColor: Colors.fadedCopper,
    borderColor: Colors.fadedCopper,
  },
  modelOptionText: {
    fontSize: 15,
    color: Colors.shadowGrey,
    fontWeight: '500',
  },
  modelOptionTextSelected: {
    color: Colors.white,
  },
  sliderContainer: {
    marginBottom: 20,
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sliderLabel: {
    fontSize: 15,
    color: Colors.shadowGrey,
    fontWeight: '500',
  },
  sliderValue: {
    fontSize: 15,
    color: Colors.fadedCopper,
    fontWeight: '600',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderDescription: {
    fontSize: 12,
    color: Colors.mutedText,
    marginTop: -4,
  },
  dangerTitle: {
    color: Colors.error,
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.error,
  },
  dangerButtonText: {
    color: Colors.error,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  aboutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.khakiBeige,
  },
  aboutContent: {
    flex: 1,
  },
  aboutAppName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.shadowGrey,
  },
  aboutVersion: {
    fontSize: 13,
    color: Colors.mutedText,
    marginTop: 2,
  },
  bottomSpacing: {
    height: 40,
  },
});

export default SettingsScreen;

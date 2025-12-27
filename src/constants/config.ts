/**
 * RTX AI App Configuration
 * Constants and configuration values for the application
 */

// AsyncStorage keys
export const StorageKeys = {
  CHATS: '@rtxai_chats',
  API_KEY: '@rtxai_api_key',
  SETTINGS: '@rtxai_settings',
} as const;

// HuggingFace API Models
export const HuggingFaceModels = {
  MISTRAL: 'mistralai/Mistral-7B-Instruct-v0.2',
  LLAMA: 'meta-llama/Llama-2-7b-chat-hf',
  ZEPHYR: 'HuggingFaceH4/zephyr-7b-beta',
  PHI2: 'microsoft/phi-2',
} as const;

export const ModelOptions = [
  {label: 'Mistral 7B', value: HuggingFaceModels.MISTRAL},
  {label: 'Llama 2 7B', value: HuggingFaceModels.LLAMA},
  {label: 'Zephyr 7B', value: HuggingFaceModels.ZEPHYR},
  {label: 'Phi-2', value: HuggingFaceModels.PHI2},
] as const;

// Default settings
export const DefaultSettings = {
  model: HuggingFaceModels.MISTRAL,
  temperature: 0.7,
  maxTokens: 512,
  topP: 0.9,
} as const;

// API Configuration
export const APIConfig = {
  baseUrl: 'https://api-inference.huggingface.co/models',
  timeout: 30000, // 30 seconds
  maxNewTokens: {
    min: 128,
    max: 1024,
    default: 512,
  },
  temperature: {
    min: 0.1,
    max: 1.0,
    default: 0.7,
  },
} as const;

// UI Configuration
export const UIConfig = {
  headerHeight: 60,
  drawerWidth: 280,
  maxMessageWidth: 0.8, // 80% of screen width
  messageBorderRadius: 16,
  inputBorderRadius: 20,
  messageSpacing: 12,
  animationDuration: 300,
  typingIndicatorDelay: [0, 150, 300],
  maxMessagesInMemory: 200,
} as const;

// App Info
export const AppInfo = {
  name: 'RTX AI',
  version: '1.0.0',
  packageName: 'com.thertxnetwork.ai',
} as const;

/**
 * RTX AI Type Definitions
 */

// Message types
export type MessageRole = 'user' | 'assistant';

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: number;
}

// Chat session types
export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
  isPinned: boolean;
}

// Settings types
export interface Settings {
  model: string;
  temperature: number;
  maxTokens: number;
  topP: number;
}

// API types
export interface HuggingFaceRequest {
  inputs: string;
  parameters: {
    max_new_tokens: number;
    temperature: number;
    top_p: number;
    return_full_text: boolean;
    do_sample: boolean;
  };
}

export interface HuggingFaceResponse {
  generated_text: string;
}

// Error types
export type ErrorType =
  | 'network'
  | 'api_key'
  | 'rate_limit'
  | 'model_loading'
  | 'timeout'
  | 'empty_response'
  | 'unknown';

export interface AppError {
  type: ErrorType;
  message: string;
  retryAfter?: number;
}

// Store types
export interface ChatState {
  chats: Chat[];
  currentChatId: string | null;
  isLoading: boolean;
  error: AppError | null;
  apiKey: string | null;
  settings: Settings;
}

export interface ChatActions {
  initialize: () => Promise<void>;
  createChat: () => string;
  addMessage: (chatId: string, message: Omit<Message, 'id' | 'timestamp'>) => void;
  updateChatTitle: (chatId: string, title: string) => void;
  deleteChat: (chatId: string) => void;
  setCurrentChat: (chatId: string | null) => void;
  getCurrentChat: () => Chat | null;
  clearAllChats: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: AppError | null) => void;
  setApiKey: (key: string | null) => void;
  updateSettings: (settings: Partial<Settings>) => void;
  togglePinChat: (chatId: string) => void;
  saveChats: () => Promise<void>;
}

export type ChatStore = ChatState & ChatActions;

// Navigation types
export type RootStackParamList = {
  Main: undefined;
  Settings: undefined;
  About: undefined;
};

export type DrawerParamList = {
  Chat: undefined;
};

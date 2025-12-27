/**
 * RTX AI Zustand Store
 * Global state management for the application
 */

import {create} from 'zustand';
import {v4 as uuidv4} from 'uuid';
import {DefaultSettings} from '../constants';
import {
  loadChats,
  saveChats as saveChatsToStorage,
  loadApiKey,
  saveApiKey as saveApiKeyToStorage,
  loadSettings,
  saveSettings as saveSettingsToStorage,
  clearChats as clearChatsFromStorage,
} from '../services/storage';
import type {Chat, ChatStore, Message, AppError, Settings} from '../types';

export const useChatStore = create<ChatStore>((set, get) => ({
  // Initial state
  chats: [],
  currentChatId: null,
  isLoading: false,
  error: null,
  apiKey: null,
  settings: {...DefaultSettings},

  // Initialize store from persistent storage
  initialize: async () => {
    try {
      const [chats, apiKey, settings] = await Promise.all([
        loadChats(),
        loadApiKey(),
        loadSettings(),
      ]);

      set({
        chats: chats || [],
        apiKey: apiKey,
        settings: settings || {...DefaultSettings},
      });
    } catch (error) {
      console.error('Error initializing store:', error);
    }
  },

  // Create a new chat session
  createChat: () => {
    const newChat: Chat = {
      id: uuidv4(),
      title: 'New Chat',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isPinned: false,
    };

    set(state => {
      const newChats = [newChat, ...state.chats];
      // Save asynchronously
      saveChatsToStorage(newChats).catch(console.error);
      return {
        chats: newChats,
        currentChatId: newChat.id,
      };
    });

    return newChat.id;
  },

  // Add a message to a chat
  addMessage: (chatId: string, messageData: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      id: uuidv4(),
      ...messageData,
      timestamp: Date.now(),
    };

    set(state => {
      const newChats = state.chats.map(chat => {
        if (chat.id === chatId) {
          return {
            ...chat,
            messages: [...chat.messages, newMessage],
            updatedAt: Date.now(),
          };
        }
        return chat;
      });

      // Save asynchronously
      saveChatsToStorage(newChats).catch(console.error);

      return {chats: newChats};
    });
  },

  // Update chat title
  updateChatTitle: (chatId: string, title: string) => {
    set(state => {
      const newChats = state.chats.map(chat => {
        if (chat.id === chatId) {
          return {
            ...chat,
            title,
            updatedAt: Date.now(),
          };
        }
        return chat;
      });

      // Save asynchronously
      saveChatsToStorage(newChats).catch(console.error);

      return {chats: newChats};
    });
  },

  // Delete a chat
  deleteChat: (chatId: string) => {
    set(state => {
      const newChats = state.chats.filter(chat => chat.id !== chatId);
      const newCurrentChatId =
        state.currentChatId === chatId ? null : state.currentChatId;

      // Save asynchronously
      saveChatsToStorage(newChats).catch(console.error);

      return {
        chats: newChats,
        currentChatId: newCurrentChatId,
      };
    });
  },

  // Set current chat
  setCurrentChat: (chatId: string | null) => {
    set({currentChatId: chatId});
  },

  // Get current chat
  getCurrentChat: () => {
    const state = get();
    return state.chats.find(chat => chat.id === state.currentChatId) || null;
  },

  // Clear all chats
  clearAllChats: () => {
    clearChatsFromStorage().catch(console.error);
    set({
      chats: [],
      currentChatId: null,
    });
  },

  // Set loading state
  setLoading: (isLoading: boolean) => {
    set({isLoading});
  },

  // Set error
  setError: (error: AppError | null) => {
    set({error});
  },

  // Set API key
  setApiKey: (apiKey: string | null) => {
    if (apiKey) {
      saveApiKeyToStorage(apiKey).catch(console.error);
    }
    set({apiKey});
  },

  // Update settings
  updateSettings: (newSettings: Partial<Settings>) => {
    set(state => {
      const updatedSettings = {...state.settings, ...newSettings};
      // Save asynchronously
      saveSettingsToStorage(updatedSettings).catch(console.error);
      return {settings: updatedSettings};
    });
  },

  // Toggle pin status
  togglePinChat: (chatId: string) => {
    set(state => {
      const newChats = state.chats.map(chat => {
        if (chat.id === chatId) {
          return {
            ...chat,
            isPinned: !chat.isPinned,
            updatedAt: Date.now(),
          };
        }
        return chat;
      });

      // Save asynchronously
      saveChatsToStorage(newChats).catch(console.error);

      return {chats: newChats};
    });
  },

  // Manually save chats (for explicit save operations)
  saveChats: async () => {
    const state = get();
    await saveChatsToStorage(state.chats);
  },
}));

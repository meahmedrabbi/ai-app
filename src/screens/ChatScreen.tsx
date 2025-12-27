/**
 * RTX AI Chat Screen
 * Main chat interface with messages and input
 */

import React, {useCallback, useRef, useEffect, useMemo} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  SafeAreaView,
  BackHandler,
  Alert,
} from 'react-native';
import {useNavigation, DrawerActions} from '@react-navigation/native';
import type {DrawerNavigationProp} from '@react-navigation/drawer';
import {
  ChatMessage,
  TypingIndicator,
  InputBar,
  Header,
  EmptyState,
  ErrorBanner,
} from '../components';
import {useChatStore} from '../store';
import {sendMessage, generateTitle, cancelCurrentRequest} from '../services/api';
import {generateFallbackTitle} from '../utils';
import {Colors} from '../constants';
import type {Message, RootStackParamList} from '../types';

type ChatScreenNavigationProp = DrawerNavigationProp<RootStackParamList, 'Main'>;

const ChatScreen: React.FC = () => {
  const navigation = useNavigation<ChatScreenNavigationProp>();
  const flatListRef = useRef<FlatList<Message>>(null);

  const {
    currentChatId,
    isLoading,
    error,
    apiKey,
    settings,
    chats,
    createChat,
    addMessage,
    updateChatTitle,
    setCurrentChat,
    setLoading,
    setError,
  } = useChatStore();

  const currentChat = chats.find(chat => chat.id === currentChatId);
  const messages = useMemo(
    () => currentChat?.messages || [],
    [currentChat?.messages],
  );

  // Handle Android back button
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (navigation.canGoBack()) {
        navigation.goBack();
        return true;
      }
      return false;
    });

    return () => backHandler.remove();
  }, [navigation]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({animated: true});
      }, 100);
    }
  }, [messages.length]);

  const handleMenuPress = useCallback(() => {
    navigation.dispatch(DrawerActions.openDrawer());
  }, [navigation]);

  const handleSettingsPress = useCallback(() => {
    // Navigate to Settings - we'll use parent navigation
    navigation.getParent()?.navigate('Settings');
  }, [navigation]);

  const handleNewChat = useCallback(() => {
    const chatId = createChat();
    setCurrentChat(chatId);
  }, [createChat, setCurrentChat]);

  const handleSuggestionPress = useCallback(
    (suggestion: string) => {
      // Create new chat and send suggestion
      const chatId = createChat();
      setCurrentChat(chatId);

      // Small delay to ensure state is updated
      setTimeout(() => {
        handleSendMessage(suggestion, chatId);
      }, 100);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [createChat, setCurrentChat],
  );

  const handleSendMessage = useCallback(
    async (text: string, overrideChatId?: string) => {
      if (!apiKey) {
        setError({
          type: 'api_key',
          message: 'Please configure your API key in settings.',
        });
        return;
      }

      let chatId = overrideChatId || currentChatId;

      // Create new chat if none exists
      if (!chatId) {
        chatId = createChat();
      }

      // Add user message
      addMessage(chatId, {
        role: 'user',
        content: text,
      });

      setLoading(true);
      setError(null);

      // Get updated messages including the new user message
      const chat = useChatStore.getState().chats.find(c => c.id === chatId);
      const allMessages = chat?.messages || [];

      const result = await sendMessage(allMessages, apiKey, settings.model, {
        maxNewTokens: settings.maxTokens,
        temperature: settings.temperature,
        topP: settings.topP,
      });

      setLoading(false);

      if ('error' in result) {
        setError(result.error);
        return;
      }

      // Add AI response
      addMessage(chatId, {
        role: 'assistant',
        content: result.response,
      });

      // Generate title if this is the first exchange
      const updatedChat = useChatStore.getState().chats.find(c => c.id === chatId);
      if (
        updatedChat &&
        updatedChat.title === 'New Chat' &&
        updatedChat.messages.length === 2
      ) {
        // Try to generate title
        const generatedTitle = await generateTitle(
          text,
          result.response,
          apiKey,
          settings.model,
        );

        if (generatedTitle) {
          updateChatTitle(chatId, generatedTitle);
        } else {
          // Fallback to first message
          updateChatTitle(chatId, generateFallbackTitle(text));
        }
      }
    },
    [
      apiKey,
      currentChatId,
      createChat,
      addMessage,
      settings,
      setLoading,
      setError,
      updateChatTitle,
    ],
  );

  const handleStopGeneration = useCallback(() => {
    cancelCurrentRequest();
    setLoading(false);
  }, [setLoading]);

  const handleRetry = useCallback(() => {
    // Retry last user message
    const lastUserMessage = [...messages]
      .reverse()
      .find(m => m.role === 'user');

    if (lastUserMessage && currentChatId) {
      handleSendMessage(lastUserMessage.content);
    }
  }, [messages, currentChatId, handleSendMessage]);

  const handleDismissError = useCallback(() => {
    setError(null);
  }, [setError]);

  const handleRegenerateLastResponse = useCallback(() => {
    if (!currentChatId || messages.length < 2) {
      return;
    }

    const lastUserMessage = [...messages]
      .reverse()
      .find(m => m.role === 'user');

    if (lastUserMessage) {
      // Remove last AI message by getting chat without it
      Alert.alert(
        'Regenerate Response',
        'Do you want to regenerate the last AI response?',
        [
          {text: 'Cancel', style: 'cancel'},
          {
            text: 'Regenerate',
            onPress: () => handleSendMessage(lastUserMessage.content),
          },
        ],
      );
    }
  }, [currentChatId, messages, handleSendMessage]);

  const renderMessage = useCallback(
    ({item, index}: {item: Message; index: number}) => (
      <ChatMessage
        message={item}
        showActions={item.role === 'assistant'}
        onRegenerate={
          index === messages.length - 1 && item.role === 'assistant'
            ? handleRegenerateLastResponse
            : undefined
        }
      />
    ),
    [messages.length, handleRegenerateLastResponse],
  );

  const keyExtractor = useCallback((item: Message) => item.id, []);

  const getItemLayout = useCallback(
    (_data: ArrayLike<Message> | null | undefined, index: number) => ({
      length: 100,
      offset: 100 * index,
      index,
    }),
    [],
  );

  // Render empty state if no chat is selected or chat has no messages
  if (!currentChatId || messages.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Header
          onMenuPress={handleMenuPress}
          onSettingsPress={handleSettingsPress}
        />
        <EmptyState
          onNewChat={handleNewChat}
          onSuggestionPress={handleSuggestionPress}
          hasApiKey={!!apiKey}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title={currentChat?.title || 'RTX AI'}
        onMenuPress={handleMenuPress}
        onSettingsPress={handleSettingsPress}
      />

      <View style={styles.container}>
        {error && (
          <ErrorBanner
            error={error}
            onRetry={handleRetry}
            onDismiss={handleDismissError}
            onSettings={handleSettingsPress}
          />
        )}

        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={keyExtractor}
          getItemLayout={getItemLayout}
          style={styles.messageList}
          contentContainerStyle={styles.messageListContent}
          windowSize={10}
          maxToRenderPerBatch={10}
          removeClippedSubviews={true}
          updateCellsBatchingPeriod={50}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={isLoading ? <TypingIndicator /> : null}
        />

        <InputBar
          onSend={handleSendMessage}
          onStop={handleStopGeneration}
          disabled={!apiKey}
          isLoading={isLoading}
        />
      </View>
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
  messageList: {
    flex: 1,
  },
  messageListContent: {
    paddingVertical: 16,
  },
});

export default ChatScreen;

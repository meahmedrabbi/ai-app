/**
 * RTX AI Empty State Component
 * Displayed when no chat is active
 */

import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import {Colors} from '../constants';

interface SuggestionProps {
  text: string;
  onPress: () => void;
}

const Suggestion: React.FC<SuggestionProps> = ({text, onPress}) => (
  <TouchableOpacity style={styles.suggestion} onPress={onPress} activeOpacity={0.7}>
    <Icon name="lightbulb-outline" size={18} color={Colors.fadedCopper} />
    <Text style={styles.suggestionText}>{text}</Text>
    <Icon name="arrow-forward" size={16} color={Colors.mutedText} />
  </TouchableOpacity>
);

interface EmptyStateProps {
  onNewChat: () => void;
  onSuggestionPress: (text: string) => void;
  hasApiKey: boolean;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  onNewChat,
  onSuggestionPress,
  hasApiKey,
}) => {
  const suggestions = [
    'Explain quantum computing in simple terms',
    'Write a short poem about technology',
    'Help me brainstorm ideas for a mobile app',
    'What are the best practices for React Native?',
  ];

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Icon name="chat" size={64} color={Colors.fadedCopper} />
      </View>

      <Text style={styles.title}>Welcome to RTX AI</Text>
      <Text style={styles.subtitle}>
        Your intelligent AI assistant powered by cutting-edge language models
      </Text>

      {!hasApiKey && (
        <View style={styles.warningContainer}>
          <Icon name="warning" size={20} color={Colors.warning} />
          <Text style={styles.warningText}>
            Please configure your HuggingFace API key in settings to start chatting.
          </Text>
        </View>
      )}

      {hasApiKey && (
        <>
          <TouchableOpacity
            style={styles.newChatButton}
            onPress={onNewChat}
            activeOpacity={0.8}>
            <Icon name="add" size={24} color={Colors.white} />
            <Text style={styles.newChatButtonText}>Start New Chat</Text>
          </TouchableOpacity>

          <Text style={styles.suggestionsTitle}>Try asking about:</Text>

          <View style={styles.suggestionsContainer}>
            {suggestions.map((suggestion, index) => (
              <Suggestion
                key={index}
                text={suggestion}
                onPress={() => onSuggestionPress(suggestion)}
              />
            ))}
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: Colors.parchment,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.khakiBeige,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: Colors.shadowGrey,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.mutedText,
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff3cd',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  warningText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: '#856404',
  },
  newChatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.fadedCopper,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 25,
    marginBottom: 32,
    shadowColor: Colors.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  newChatButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  suggestionsTitle: {
    fontSize: 14,
    color: Colors.mutedText,
    marginBottom: 16,
    fontWeight: '500',
  },
  suggestionsContainer: {
    width: '100%',
  },
  suggestion: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.khakiBeige,
  },
  suggestionText: {
    flex: 1,
    fontSize: 14,
    color: Colors.shadowGrey,
    marginLeft: 12,
  },
});

export default EmptyState;

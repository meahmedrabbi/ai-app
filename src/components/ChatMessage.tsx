/**
 * RTX AI Chat Message Component
 * Renders individual chat messages with styling and animations
 */

import React, {useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import Markdown from 'react-native-markdown-display';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Colors, UIConfig} from '../constants';
import {formatTimestamp} from '../utils';
import type {Message} from '../types';

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const MAX_MESSAGE_WIDTH = SCREEN_WIDTH * UIConfig.maxMessageWidth;

interface ChatMessageProps {
  message: Message;
  onLongPress?: () => void;
  onCopy?: () => void;
  onRegenerate?: () => void;
  showActions?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = React.memo(
  ({message, onLongPress, onCopy, onRegenerate, showActions = false}) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const isUser = message.role === 'user';

    useEffect(() => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: UIConfig.animationDuration,
        useNativeDriver: true,
      }).start();
    }, [fadeAnim]);

    const handleCopy = () => {
      Clipboard.setString(message.content);
      Alert.alert('Copied', 'Message copied to clipboard');
      onCopy?.();
    };

    const handleLongPress = () => {
      if (onLongPress) {
        onLongPress();
      } else {
        // Default long press behavior: show copy option
        Alert.alert(
          'Message Options',
          undefined,
          [
            {text: 'Copy', onPress: handleCopy},
            ...(message.role === 'assistant' && onRegenerate
              ? [{text: 'Regenerate', onPress: onRegenerate}]
              : []),
            {text: 'Cancel', style: 'cancel' as const},
          ],
          {cancelable: true},
        );
      }
    };

    const markdownStyles = {
      body: {
        color: isUser ? Colors.white : Colors.shadowGrey,
        fontSize: 15,
        lineHeight: 22,
      },
      code_inline: {
        backgroundColor: isUser
          ? 'rgba(255,255,255,0.2)'
          : 'rgba(0,0,0,0.1)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
      },
      code_block: {
        backgroundColor: isUser
          ? 'rgba(255,255,255,0.2)'
          : 'rgba(0,0,0,0.1)',
        padding: 10,
        borderRadius: 8,
      },
      fence: {
        backgroundColor: isUser
          ? 'rgba(255,255,255,0.2)'
          : 'rgba(0,0,0,0.1)',
        padding: 10,
        borderRadius: 8,
      },
      link: {
        color: isUser ? Colors.white : Colors.fadedCopper,
      },
    };

    return (
      <Animated.View
        style={[
          styles.container,
          isUser ? styles.userContainer : styles.aiContainer,
          {opacity: fadeAnim},
        ]}>
        <TouchableOpacity
          activeOpacity={0.8}
          onLongPress={handleLongPress}
          style={[
            styles.bubble,
            isUser ? styles.userBubble : styles.aiBubble,
          ]}>
          {isUser ? (
            <Text style={styles.userText}>{message.content}</Text>
          ) : (
            <Markdown style={markdownStyles}>{message.content}</Markdown>
          )}
        </TouchableOpacity>

        <View
          style={[
            styles.metaContainer,
            isUser ? styles.userMeta : styles.aiMeta,
          ]}>
          <Text style={styles.timestamp}>
            {formatTimestamp(message.timestamp)}
          </Text>

          {showActions && !isUser && (
            <TouchableOpacity
              onPress={handleCopy}
              style={styles.actionButton}
              hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
              <Icon name="content-copy" size={14} color={Colors.mutedText} />
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>
    );
  },
  (prevProps, nextProps) => {
    // Custom comparison for memoization
    return (
      prevProps.message.id === nextProps.message.id &&
      prevProps.message.content === nextProps.message.content &&
      prevProps.showActions === nextProps.showActions
    );
  },
);

const styles = StyleSheet.create({
  container: {
    marginVertical: UIConfig.messageSpacing / 2,
    paddingHorizontal: 16,
  },
  userContainer: {
    alignItems: 'flex-end',
  },
  aiContainer: {
    alignItems: 'flex-start',
  },
  bubble: {
    maxWidth: MAX_MESSAGE_WIDTH,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: UIConfig.messageBorderRadius,
    shadowColor: Colors.black,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  userBubble: {
    backgroundColor: Colors.fadedCopper,
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: Colors.khakiBeige,
    borderBottomLeftRadius: 4,
  },
  userText: {
    color: Colors.white,
    fontSize: 15,
    lineHeight: 22,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    paddingHorizontal: 4,
  },
  userMeta: {
    justifyContent: 'flex-end',
  },
  aiMeta: {
    justifyContent: 'flex-start',
  },
  timestamp: {
    fontSize: 11,
    color: Colors.mutedText,
  },
  actionButton: {
    marginLeft: 8,
    padding: 4,
  },
});

export default ChatMessage;

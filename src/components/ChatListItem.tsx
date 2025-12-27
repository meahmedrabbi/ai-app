/**
 * RTX AI Chat List Item Component
 * Renders individual chat session in the drawer
 */

import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Colors} from '../constants';
import {formatRelativeTime, truncateText} from '../utils';
import type {Chat} from '../types';

interface ChatListItemProps {
  chat: Chat;
  isActive: boolean;
  onPress: () => void;
  onDelete: () => void;
  onPin: () => void;
  onExport?: () => void;
}

const ChatListItem: React.FC<ChatListItemProps> = React.memo(
  ({chat, isActive, onPress, onDelete, onPin, onExport}) => {
    const handleLongPress = () => {
      Alert.alert(
        chat.title,
        'Choose an action',
        [
          {
            text: chat.isPinned ? 'Unpin' : 'Pin',
            onPress: onPin,
          },
          ...(onExport ? [{text: 'Export', onPress: onExport}] : []),
          {
            text: 'Delete',
            onPress: () => {
              Alert.alert(
                'Delete Chat',
                'Are you sure you want to delete this chat?',
                [
                  {text: 'Cancel', style: 'cancel'},
                  {text: 'Delete', style: 'destructive', onPress: onDelete},
                ],
              );
            },
            style: 'destructive',
          },
          {text: 'Cancel', style: 'cancel'},
        ],
        {cancelable: true},
      );
    };

    const lastMessage = chat.messages[chat.messages.length - 1];
    const preview = lastMessage ? truncateText(lastMessage.content, 40) : 'No messages';

    return (
      <TouchableOpacity
        style={[styles.container, isActive && styles.activeContainer]}
        onPress={onPress}
        onLongPress={handleLongPress}
        activeOpacity={0.7}>
        <View style={styles.content}>
          <View style={styles.titleRow}>
            {chat.isPinned && (
              <Icon
                name="push-pin"
                size={14}
                color={Colors.fadedCopper}
                style={styles.pinIcon}
              />
            )}
            <Text
              style={[styles.title, isActive && styles.activeTitle]}
              numberOfLines={1}>
              {chat.title}
            </Text>
          </View>

          <Text style={styles.preview} numberOfLines={1}>
            {preview}
          </Text>

          <Text style={styles.timestamp}>
            {formatRelativeTime(chat.updatedAt)}
          </Text>
        </View>

        {isActive && <View style={styles.activeIndicator} />}
      </TouchableOpacity>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.chat.id === nextProps.chat.id &&
      prevProps.chat.title === nextProps.chat.title &&
      prevProps.chat.updatedAt === nextProps.chat.updatedAt &&
      prevProps.chat.isPinned === nextProps.chat.isPinned &&
      prevProps.isActive === nextProps.isActive
    );
  },
);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeContainer: {
    backgroundColor: 'rgba(143, 114, 88, 0.1)',
  },
  content: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pinIcon: {
    marginRight: 4,
    transform: [{rotate: '45deg'}],
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.shadowGrey,
    flex: 1,
  },
  activeTitle: {
    color: Colors.fadedCopper,
  },
  preview: {
    fontSize: 13,
    color: Colors.mutedText,
    marginTop: 2,
  },
  timestamp: {
    fontSize: 11,
    color: Colors.mutedText,
    marginTop: 4,
  },
  activeIndicator: {
    width: 4,
    height: '100%',
    backgroundColor: Colors.fadedCopper,
    borderRadius: 2,
    marginLeft: 8,
  },
});

export default ChatListItem;

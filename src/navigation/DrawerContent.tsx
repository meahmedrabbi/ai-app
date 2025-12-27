/**
 * RTX AI Custom Drawer Content
 * Sidebar navigation with chat list and controls
 */

import React, {useCallback, useMemo, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useChatStore} from '../store';
import {ChatListItem} from '../components';
import {Colors} from '../constants';
import {groupChatsByDate} from '../utils';
import type {Chat} from '../types';

const DrawerContent: React.FC<DrawerContentComponentProps> = ({navigation}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const {chats, currentChatId, createChat, setCurrentChat, deleteChat, togglePinChat} =
    useChatStore();

  // Filter and group chats
  const filteredChats = useMemo(() => {
    if (!searchQuery.trim()) {
      return chats;
    }
    const query = searchQuery.toLowerCase();
    return chats.filter(
      chat =>
        chat.title.toLowerCase().includes(query) ||
        chat.messages.some(msg =>
          msg.content.toLowerCase().includes(query),
        ),
    );
  }, [chats, searchQuery]);

  const groupedChats = useMemo(() => {
    return groupChatsByDate(filteredChats);
  }, [filteredChats]);

  const handleNewChat = useCallback(() => {
    const chatId = createChat();
    setCurrentChat(chatId);
    navigation.closeDrawer();
  }, [createChat, setCurrentChat, navigation]);

  const handleChatPress = useCallback(
    (chatId: string) => {
      setCurrentChat(chatId);
      navigation.closeDrawer();
    },
    [setCurrentChat, navigation],
  );

  const handleDeleteChat = useCallback(
    (chatId: string) => {
      deleteChat(chatId);
    },
    [deleteChat],
  );

  const handlePinChat = useCallback(
    (chatId: string) => {
      togglePinChat(chatId);
    },
    [togglePinChat],
  );

  const handleSettingsPress = useCallback(() => {
    navigation.getParent()?.navigate('Settings');
  }, [navigation]);

  const renderChatItem = useCallback(
    ({item}: {item: Chat}) => (
      <ChatListItem
        chat={item}
        isActive={item.id === currentChatId}
        onPress={() => handleChatPress(item.id)}
        onDelete={() => handleDeleteChat(item.id)}
        onPin={() => handlePinChat(item.id)}
      />
    ),
    [currentChatId, handleChatPress, handleDeleteChat, handlePinChat],
  );

  const renderSectionHeader = useCallback(
    (title: string) => (
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionHeaderText}>{title}</Text>
      </View>
    ),
    [],
  );

  // Flatten grouped chats with section headers
  const flattenedData = useMemo(() => {
    const result: Array<{type: 'header'; title: string} | {type: 'chat'; data: Chat}> =
      [];

    Object.entries(groupedChats).forEach(([group, groupChats]) => {
      result.push({type: 'header', title: group});
      groupChats.forEach(chat => {
        result.push({type: 'chat', data: chat});
      });
    });

    return result;
  }, [groupedChats]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Icon name="chat" size={28} color={Colors.parchment} />
          <Text style={styles.headerTitle}>RTX AI</Text>
        </View>
        <View style={styles.headerBorder} />
      </View>

      {/* New Chat Button */}
      <TouchableOpacity
        style={styles.newChatButton}
        onPress={handleNewChat}
        activeOpacity={0.8}>
        <Icon name="add" size={24} color={Colors.white} />
        <Text style={styles.newChatButtonText}>New Chat</Text>
      </TouchableOpacity>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color={Colors.mutedText} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search chats..."
          placeholderTextColor={Colors.mutedText}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Icon name="close" size={18} color={Colors.mutedText} />
          </TouchableOpacity>
        )}
      </View>

      {/* Chat List */}
      <DrawerContentScrollView style={styles.scrollView}>
        {flattenedData.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Icon name="chat-bubble-outline" size={40} color={Colors.mutedText} />
            <Text style={styles.emptyText}>
              {searchQuery ? 'No matching chats' : 'No chats yet'}
            </Text>
            <Text style={styles.emptySubtext}>
              {searchQuery
                ? 'Try a different search term'
                : 'Start a new conversation'}
            </Text>
          </View>
        ) : (
          flattenedData.map(item => {
            if (item.type === 'header') {
              return (
                <View key={`header-${item.title}`}>
                  {renderSectionHeader(item.title)}
                </View>
              );
            } else {
              return (
                <View key={item.data.id}>
                  {renderChatItem({item: item.data})}
                </View>
              );
            }
          })
        )}
      </DrawerContentScrollView>

      {/* Footer */}
      <TouchableOpacity
        style={styles.settingsButton}
        onPress={handleSettingsPress}
        activeOpacity={0.7}>
        <Icon name="settings" size={22} color={Colors.mutedText} />
        <Text style={styles.settingsText}>Settings</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.parchment,
  },
  header: {
    backgroundColor: Colors.shadowGrey,
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.parchment,
    marginLeft: 12,
  },
  headerBorder: {
    height: 3,
    backgroundColor: Colors.fadedCopper,
    marginTop: 16,
    borderRadius: 2,
  },
  newChatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.fadedCopper,
    marginHorizontal: 16,
    marginTop: 16,
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: Colors.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  newChatButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.khakiBeige,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.shadowGrey,
    marginLeft: 8,
    padding: 0,
  },
  scrollView: {
    flex: 1,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(0,0,0,0.03)',
  },
  sectionHeaderText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.mutedText,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.mutedText,
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 13,
    color: Colors.mutedText,
    marginTop: 4,
  },
  settingsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.khakiBeige,
    backgroundColor: Colors.white,
  },
  settingsText: {
    fontSize: 15,
    color: Colors.mutedText,
    marginLeft: 12,
    fontWeight: '500',
  },
});

export default DrawerContent;

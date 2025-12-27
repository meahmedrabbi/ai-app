/**
 * RTX AI Header Component
 * Main header bar with navigation and settings
 */

import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Platform} from 'react-native';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import {Colors, UIConfig} from '../constants';

interface HeaderProps {
  title?: string;
  onMenuPress?: () => void;
  onSettingsPress?: () => void;
  showMenu?: boolean;
  showSettings?: boolean;
  leftIcon?: string;
  onLeftPress?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  title = 'RTX AI',
  onMenuPress,
  onSettingsPress,
  showMenu = true,
  showSettings = true,
  leftIcon,
  onLeftPress,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        {showMenu && (
          <TouchableOpacity
            onPress={onMenuPress}
            style={styles.iconButton}
            hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
            <Icon name="menu" size={28} color={Colors.parchment} />
          </TouchableOpacity>
        )}
        {leftIcon && onLeftPress && (
          <TouchableOpacity
            onPress={onLeftPress}
            style={styles.iconButton}
            hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
            <Icon name={leftIcon} size={28} color={Colors.parchment} />
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.title}>{title}</Text>

      <View style={styles.rightSection}>
        {showSettings && (
          <TouchableOpacity
            onPress={onSettingsPress}
            style={styles.iconButton}
            hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
            <Icon name="settings" size={26} color={Colors.parchment} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: UIConfig.headerHeight,
    backgroundColor: Colors.shadowGrey,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 0 : 0,
    shadowColor: Colors.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  leftSection: {
    width: 50,
    alignItems: 'flex-start',
  },
  rightSection: {
    width: 50,
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.parchment,
  },
  iconButton: {
    padding: 4,
  },
});

export default Header;

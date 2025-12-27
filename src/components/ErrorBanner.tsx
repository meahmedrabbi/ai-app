/**
 * RTX AI Error Banner Component
 * Displays error messages with retry options
 */

import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import type {AppError} from '../types';

interface ErrorBannerProps {
  error: AppError;
  onRetry?: () => void;
  onDismiss?: () => void;
  onSettings?: () => void;
}

const ErrorBanner: React.FC<ErrorBannerProps> = ({
  error,
  onRetry,
  onDismiss,
  onSettings,
}) => {
  const getIcon = () => {
    switch (error.type) {
      case 'network':
        return 'wifi-off';
      case 'api_key':
        return 'key';
      case 'rate_limit':
        return 'schedule';
      case 'model_loading':
        return 'hourglass-empty';
      case 'timeout':
        return 'timer-off';
      default:
        return 'error-outline';
    }
  };

  const getBackgroundColor = () => {
    switch (error.type) {
      case 'api_key':
        return '#fff3cd';
      case 'rate_limit':
      case 'model_loading':
        return '#cce5ff';
      default:
        return '#f8d7da';
    }
  };

  const getTextColor = () => {
    switch (error.type) {
      case 'api_key':
        return '#856404';
      case 'rate_limit':
      case 'model_loading':
        return '#004085';
      default:
        return '#721c24';
    }
  };

  return (
    <View style={[styles.container, {backgroundColor: getBackgroundColor()}]}>
      <Icon name={getIcon()} size={20} color={getTextColor()} />

      <View style={styles.content}>
        <Text style={[styles.message, {color: getTextColor()}]}>
          {error.message}
        </Text>

        {error.retryAfter && (
          <Text style={[styles.retryText, {color: getTextColor()}]}>
            Retry in {error.retryAfter} seconds
          </Text>
        )}
      </View>

      <View style={styles.actions}>
        {error.type === 'api_key' && onSettings && (
          <TouchableOpacity onPress={onSettings} style={styles.actionButton}>
            <Text style={[styles.actionText, {color: getTextColor()}]}>
              Settings
            </Text>
          </TouchableOpacity>
        )}

        {onRetry && error.type !== 'api_key' && (
          <TouchableOpacity onPress={onRetry} style={styles.actionButton}>
            <Text style={[styles.actionText, {color: getTextColor()}]}>
              Retry
            </Text>
          </TouchableOpacity>
        )}

        {onDismiss && (
          <TouchableOpacity onPress={onDismiss} style={styles.dismissButton}>
            <Icon name="close" size={18} color={getTextColor()} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
  },
  content: {
    flex: 1,
    marginLeft: 12,
  },
  message: {
    fontSize: 14,
    fontWeight: '500',
  },
  retryText: {
    fontSize: 12,
    marginTop: 2,
    opacity: 0.8,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  dismissButton: {
    padding: 4,
    marginLeft: 4,
  },
});

export default ErrorBanner;

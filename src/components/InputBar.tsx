/**
 * RTX AI Input Bar Component
 * Fixed bottom input bar for sending messages
 */

import React, {useState, useCallback} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Text,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Colors, UIConfig} from '../constants';

interface InputBarProps {
  onSend: (message: string) => void;
  onStop?: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  placeholder?: string;
}

const InputBar: React.FC<InputBarProps> = ({
  onSend,
  onStop,
  disabled = false,
  isLoading = false,
  placeholder = 'Type a message...',
}) => {
  const [text, setText] = useState('');
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handleSend = useCallback(() => {
    if (text.trim() && !disabled && !isLoading) {
      onSend(text.trim());
      setText('');
    }
  }, [text, disabled, isLoading, onSend]);

  const handleStop = useCallback(() => {
    if (onStop) {
      onStop();
    }
  }, [onStop]);

  const handlePressIn = useCallback(() => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  }, [scaleAnim]);

  const handlePressOut = useCallback(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  }, [scaleAnim]);

  const canSend = text.trim().length > 0 && !disabled && !isLoading;
  const showCharCount = text.length > 100;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
      <View style={styles.container}>
        {showCharCount && (
          <Text style={styles.charCount}>{text.length} characters</Text>
        )}
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, disabled && styles.inputDisabled]}
            value={text}
            onChangeText={setText}
            placeholder={disabled ? 'Configure API key in settings' : placeholder}
            placeholderTextColor={Colors.mutedText}
            multiline
            maxLength={4000}
            editable={!disabled}
            returnKeyType="send"
            blurOnSubmit={false}
            onSubmitEditing={handleSend}
          />

          {isLoading ? (
            <TouchableOpacity
              style={[styles.sendButton, styles.stopButton]}
              onPress={handleStop}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              activeOpacity={0.8}>
              <Animated.View style={{transform: [{scale: scaleAnim}]}}>
                <Icon name="stop" size={24} color={Colors.white} />
              </Animated.View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[
                styles.sendButton,
                !canSend && styles.sendButtonDisabled,
              ]}
              onPress={handleSend}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              disabled={!canSend}
              activeOpacity={0.8}>
              <Animated.View style={{transform: [{scale: scaleAnim}]}}>
                <Icon
                  name="send"
                  size={22}
                  color={canSend ? Colors.white : Colors.mutedText}
                />
              </Animated.View>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.parchment,
    borderTopWidth: 1,
    borderTopColor: Colors.khakiBeige,
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: Platform.OS === 'ios' ? 28 : 12,
  },
  charCount: {
    fontSize: 11,
    color: Colors.mutedText,
    textAlign: 'right',
    marginBottom: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.khakiBeige,
    borderRadius: UIConfig.inputBorderRadius,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    paddingTop: Platform.OS === 'ios' ? 12 : 8,
    fontSize: 15,
    maxHeight: 120,
    color: Colors.shadowGrey,
  },
  inputDisabled: {
    backgroundColor: '#f0f0f0',
    borderColor: '#ddd',
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.fadedCopper,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
    shadowColor: Colors.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  sendButtonDisabled: {
    backgroundColor: Colors.khakiBeige,
    shadowOpacity: 0,
    elevation: 0,
  },
  stopButton: {
    backgroundColor: Colors.error,
  },
});

export default InputBar;

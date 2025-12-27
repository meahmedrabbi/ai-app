/**
 * RTX AI Typing Indicator Component
 * Animated dots to indicate AI is generating a response
 */

import React, {useEffect, useRef} from 'react';
import {View, StyleSheet, Animated, Dimensions} from 'react-native';
import {Colors, UIConfig} from '../constants';

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const MAX_MESSAGE_WIDTH = SCREEN_WIDTH * UIConfig.maxMessageWidth;

const TypingIndicator: React.FC = () => {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const createAnimation = (animValue: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(animValue, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(animValue, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ]),
      );
    };

    const animation = Animated.parallel([
      createAnimation(dot1, UIConfig.typingIndicatorDelay[0]),
      createAnimation(dot2, UIConfig.typingIndicatorDelay[1]),
      createAnimation(dot3, UIConfig.typingIndicatorDelay[2]),
    ]);

    animation.start();

    return () => {
      animation.stop();
    };
  }, [dot1, dot2, dot3]);

  const getDotStyle = (animValue: Animated.Value) => ({
    transform: [
      {
        translateY: animValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -6],
        }),
      },
    ],
    opacity: animValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0.5, 1],
    }),
  });

  return (
    <View style={styles.container}>
      <View style={styles.bubble}>
        <Animated.View style={[styles.dot, getDotStyle(dot1)]} />
        <Animated.View style={[styles.dot, getDotStyle(dot2)]} />
        <Animated.View style={[styles.dot, getDotStyle(dot3)]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    marginVertical: UIConfig.messageSpacing / 2,
  },
  bubble: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.khakiBeige,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: UIConfig.messageBorderRadius,
    borderBottomLeftRadius: 4,
    maxWidth: MAX_MESSAGE_WIDTH,
    shadowColor: Colors.black,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.shadowGrey,
    marginHorizontal: 3,
  },
});

export default TypingIndicator;

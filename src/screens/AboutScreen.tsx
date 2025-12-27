/**
 * RTX AI About Screen
 * App information and credits
 */

import React, {useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Colors, AppInfo} from '../constants';
import {Header} from '../components';

const AboutScreen: React.FC = () => {
  const navigation = useNavigation();

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleOpenLink = useCallback((url: string) => {
    Linking.openURL(url).catch(err => {
      console.error('Error opening link:', err);
    });
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title="About"
        showMenu={false}
        showSettings={false}
        leftIcon="arrow-back"
        onLeftPress={handleBack}
      />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* App Info */}
        <View style={styles.appInfoSection}>
          <View style={styles.iconContainer}>
            <Icon name="chat" size={48} color={Colors.fadedCopper} />
          </View>
          <Text style={styles.appName}>{AppInfo.name}</Text>
          <Text style={styles.version}>Version {AppInfo.version}</Text>
          <Text style={styles.packageName}>{AppInfo.packageName}</Text>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About This App</Text>
          <Text style={styles.description}>
            RTX AI is an intelligent AI chat application powered by cutting-edge
            language models. Built with React Native, it provides a seamless
            conversational experience similar to leading AI assistants.
          </Text>
        </View>

        {/* Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Features</Text>

          <View style={styles.featureItem}>
            <Icon name="psychology" size={24} color={Colors.fadedCopper} />
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Multiple AI Models</Text>
              <Text style={styles.featureDescription}>
                Choose from Mistral, Llama, Zephyr, and more
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <Icon name="history" size={24} color={Colors.fadedCopper} />
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Chat History</Text>
              <Text style={styles.featureDescription}>
                All conversations are saved locally
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <Icon name="tune" size={24} color={Colors.fadedCopper} />
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Customizable Parameters</Text>
              <Text style={styles.featureDescription}>
                Adjust temperature and token limits
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <Icon name="code" size={24} color={Colors.fadedCopper} />
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Markdown Support</Text>
              <Text style={styles.featureDescription}>
                Rich formatting for AI responses
              </Text>
            </View>
          </View>
        </View>

        {/* Links */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resources</Text>

          <TouchableOpacity
            style={styles.linkItem}
            onPress={() =>
              handleOpenLink('https://huggingface.co/docs/api-inference')
            }>
            <Icon name="open-in-new" size={20} color={Colors.fadedCopper} />
            <Text style={styles.linkText}>HuggingFace API Documentation</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkItem}
            onPress={() =>
              handleOpenLink('https://huggingface.co/settings/tokens')
            }>
            <Icon name="vpn-key" size={20} color={Colors.fadedCopper} />
            <Text style={styles.linkText}>Get Your API Key</Text>
          </TouchableOpacity>
        </View>

        {/* Credits */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Credits</Text>
          <Text style={styles.creditsText}>
            Built with React Native CLI{'\n'}
            Powered by HuggingFace Inference API{'\n'}
            Icons by Material Design
          </Text>
        </View>

        {/* Legal */}
        <View style={styles.section}>
          <Text style={styles.legalText}>
            © 2024 RTX Network. All rights reserved.{'\n'}
            This app is not affiliated with HuggingFace.
          </Text>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
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
  appInfoSection: {
    alignItems: 'center',
    paddingVertical: 32,
    borderBottomWidth: 1,
    borderBottomColor: Colors.khakiBeige,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: Colors.khakiBeige,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  appName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: Colors.shadowGrey,
    marginBottom: 4,
  },
  version: {
    fontSize: 16,
    color: Colors.mutedText,
    marginBottom: 4,
  },
  packageName: {
    fontSize: 12,
    color: Colors.mutedText,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.khakiBeige,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.shadowGrey,
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: Colors.shadowGrey,
    lineHeight: 22,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureContent: {
    marginLeft: 16,
    flex: 1,
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.shadowGrey,
  },
  featureDescription: {
    fontSize: 13,
    color: Colors.mutedText,
    marginTop: 2,
  },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  linkText: {
    fontSize: 15,
    color: Colors.fadedCopper,
    marginLeft: 12,
    fontWeight: '500',
  },
  creditsText: {
    fontSize: 14,
    color: Colors.mutedText,
    lineHeight: 22,
  },
  legalText: {
    fontSize: 12,
    color: Colors.mutedText,
    textAlign: 'center',
    lineHeight: 18,
  },
  bottomSpacing: {
    height: 40,
  },
});

// Add Platform import
import {Platform} from 'react-native';

export default AboutScreen;

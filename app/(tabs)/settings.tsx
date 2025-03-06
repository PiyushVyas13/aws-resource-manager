import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TextInput, Pressable, ScrollView, Platform, Image } from 'react-native';
import { useStore } from '../../store';
import { Moon, Sun, Key, ChevronRight, Shield, Eye, EyeOff } from 'lucide-react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function Settings() {
  const { darkMode, setDarkMode, awsCredentials, setAWSCredentials } = useStore();
  const [showCredentials, setShowCredentials] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [credentials, setCredentials] = useState({
    accessKeyId: awsCredentials?.accessKeyId || '',
    secretAccessKey: awsCredentials?.secretAccessKey || '',
    region: awsCredentials?.region || '',
  });
  const [error, setError] = useState('');

  const authenticate = async () => {
    try {
      if (Platform.OS === 'web') {
        // On web, just show/edit credentials without biometric auth
        setShowCredentials(true);
        setIsEditing(true);
        return;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to view AWS credentials',
        fallbackLabel: 'Use passcode',
      });

      if (result.success) {
        setShowCredentials(true);
        setIsEditing(true);
        setError('');
      } else {
        setError('Authentication failed');
      }
    } catch (err) {
      setError('Authentication not available');
    }
  };

  const saveCredentials = async () => {
    try {
      if (!credentials.accessKeyId || !credentials.secretAccessKey || !credentials.region) {
        setError('All fields are required');
        return;
      }

      // Encrypt and store credentials
      if (Platform.OS !== 'web') {
        await SecureStore.setItemAsync(
          'aws_credentials',
          JSON.stringify(credentials)
        );
      }

      setAWSCredentials(credentials);
      setIsEditing(false);
      setShowCredentials(false);
      setError('');
    } catch (err) {
      setError('Failed to save credentials');
    }
  };

  return (
    <ScrollView style={[styles.container, darkMode && styles.containerDark]}>
      <Image
        source={{ uri: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop' }}
        style={styles.heroImage}
      />

      <View style={styles.content}>
        <Animated.View
          entering={FadeInDown.delay(100)}
          style={[styles.section, darkMode && styles.sectionDark]}
        >
          <Text style={[styles.sectionTitle, darkMode && styles.textDark]}>Appearance</Text>
          <View style={styles.option}>
            {darkMode ? (
              <Moon size={24} color={darkMode ? '#ffffff' : '#1a1a1a'} />
            ) : (
              <Sun size={24} color={darkMode ? '#ffffff' : '#1a1a1a'} />
            )}
            <Text style={[styles.optionText, darkMode && styles.textDark]}>Dark Mode</Text>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: '#e5e5e5', true: '#007AFF50' }}
              thumbColor={darkMode ? '#007AFF' : '#ffffff'}
            />
          </View>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(200)}
          style={[styles.section, darkMode && styles.sectionDark]}
        >
          <Text style={[styles.sectionTitle, darkMode && styles.textDark]}>AWS Credentials</Text>

          {!isEditing ? (
            <Pressable
              style={styles.credentialsButton}
              onPress={authenticate}
            >
              <View style={styles.credentialsButtonContent}>
                <Key size={24} color={darkMode ? '#ffffff' : '#1a1a1a'} />
                <Text style={[styles.credentialsButtonText, darkMode && styles.textDark]}>
                  {awsCredentials ? 'View/Edit Credentials' : 'Add AWS Credentials'}
                </Text>
              </View>
              <ChevronRight size={20} color={darkMode ? '#ffffff' : '#1a1a1a'} />
            </Pressable>
          ) : (
            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={[styles.label, darkMode && styles.textDark]}>Access Key ID</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={[styles.input, darkMode && styles.inputDark]}
                    value={credentials.accessKeyId}
                    onChangeText={(text) => setCredentials(prev => ({ ...prev, accessKeyId: text }))}
                    placeholder="Enter Access Key ID"
                    placeholderTextColor={darkMode ? '#666666' : '#999999'}
                    secureTextEntry={!showCredentials}
                  />
                  <Pressable
                    style={styles.eyeButton}
                    onPress={() => setShowCredentials(!showCredentials)}
                  >
                    {showCredentials ? (
                      <EyeOff size={20} color={darkMode ? '#ffffff' : '#1a1a1a'} />
                    ) : (
                      <Eye size={20} color={darkMode ? '#ffffff' : '#1a1a1a'} />
                    )}
                  </Pressable>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, darkMode && styles.textDark]}>Secret Access Key</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={[styles.input, darkMode && styles.inputDark]}
                    value={credentials.secretAccessKey}
                    onChangeText={(text) => setCredentials(prev => ({ ...prev, secretAccessKey: text }))}
                    placeholder="Enter Secret Access Key"
                    placeholderTextColor={darkMode ? '#666666' : '#999999'}
                    secureTextEntry={!showCredentials}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, darkMode && styles.textDark]}>Region</Text>
                <TextInput
                  style={[styles.input, darkMode && styles.inputDark]}
                  value={credentials.region}
                  onChangeText={(text) => setCredentials(prev => ({ ...prev, region: text }))}
                  placeholder="e.g., us-east-1"
                  placeholderTextColor={darkMode ? '#666666' : '#999999'}
                />
              </View>

              {error ? (
                <Text style={styles.errorText}>{error}</Text>
              ) : null}

              <View style={styles.buttonGroup}>
                <Pressable
                  style={[styles.button, styles.cancelButton]}
                  onPress={() => {
                    setIsEditing(false);
                    setShowCredentials(false);
                    setError('');
                  }}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </Pressable>
                <Pressable
                  style={[styles.button, styles.saveButton]}
                  onPress={saveCredentials}
                >
                  <Text style={styles.saveButtonText}>Save Credentials</Text>
                </Pressable>
              </View>
            </View>
          )}

          <View style={styles.securityNote}>
            <Shield size={16} color={darkMode ? '#666666' : '#999999'} />
            <Text style={[styles.securityText, darkMode && styles.securityTextDark]}>
              Your credentials are encrypted and stored securely on your device
            </Text>
          </View>
        </Animated.View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  containerDark: {
    backgroundColor: '#000000',
  },
  heroImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  content: {
    padding: 16,
    gap: 16,
  },
  section: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionDark: {
    backgroundColor: '#1a1a1a',
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: '#1a1a1a',
  },
  textDark: {
    color: '#ffffff',
  },
  credentialsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  credentialsButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  credentialsButtonText: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: '#1a1a1a',
  },
  form: {
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: '#1a1a1a',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: '#1a1a1a',
  },
  inputDark: {
    backgroundColor: '#333333',
    borderColor: '#444444',
    color: '#ffffff',
  },
  eyeButton: {
    position: 'absolute',
    right: 12,
  },
  errorText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#EF4444',
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f8fafc',
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: '#1a1a1a',
  },
  saveButton: {
    backgroundColor: '#007AFF',
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: '#ffffff',
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
  },
  securityText: {
    flex: 1,
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: '#666666',
  },
  securityTextDark: {
    color: '#999999',
  },
});

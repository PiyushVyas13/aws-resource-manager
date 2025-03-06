import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, ScrollView } from 'react-native';
import { CircleAlert as AlertCircle, Check } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useStore } from '../../store';

interface FormField {
  key: string;
  label: string;
  placeholder: string;
  type?: 'text' | 'select';
  options?: string[];
  required?: boolean;
  validation?: (value: string) => string | null;
}

interface ResourceFormProps {
  fields: FormField[];
  onSubmit: (values: Record<string, string>) => Promise<void>;
  color: string;
  submitLabel?: string;
}

export function ResourceForm({ fields, onSubmit, color, submitLabel = 'Create Resource' }: ResourceFormProps) {
  const { darkMode } = useStore();
  const [values, setValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (key: string, value: string) => {
    setValues(prev => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    fields.forEach(field => {
      if (field.required && !values[field.key]) {
        newErrors[field.key] = `${field.label} is required`;
      } else if (field.validation && values[field.key]) {
        const error = field.validation(values[field.key]);
        if (error) {
          newErrors[field.key] = error;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  console.log(fields);

  const handleSubmit = async () => {
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(values);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setValues({});
      }, 2000);
    } catch (error) {
      // Handle error
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView
      style={[
        styles.container,
        darkMode && styles.containerDark
      ]}
      contentContainerStyle={styles.contentContainer}
    >
      {fields.map((field, index) => (
        <Animated.View
          key={field.key}
          entering={FadeInDown.delay(index * 100)}
          style={styles.fieldContainer}
        >
          <Text style={[
            styles.label,
            darkMode && styles.labelDark
          ]}>
            {field.label}
            {field.required && <Text style={styles.required}> *</Text>}
          </Text>

          {field.type === 'select' ? (
            <View style={styles.selectContainer}>
              {field.options?.map(option => (
                <Pressable
                  key={option}
                  style={[
                    styles.selectOption,
                    darkMode && styles.selectOptionDark,
                    values[field.key] === option && {
                      backgroundColor: `${color}15`,
                      borderColor: color
                    }
                  ]}
                  onPress={() => handleChange(field.key, option)}
                >
                  <Text style={[
                    styles.selectText,
                    darkMode && styles.selectTextDark,
                    values[field.key] === option && { color }
                  ]}>
                    {option}
                  </Text>
                </Pressable>
              ))}
            </View>
          ) : (
            <TextInput
              style={[
                styles.input,
                darkMode && styles.inputDark,
                errors[field.key] && styles.inputError
              ]}
              placeholder={field.placeholder}
              placeholderTextColor={darkMode ? '#666666' : '#999999'}
              value={values[field.key] || ''}
              onChangeText={(value) => handleChange(field.key, value)}
            />
          )}

          {errors[field.key] && (
            <View style={styles.errorContainer}>
              <AlertCircle size={16} color="#EF4444" />
              <Text style={styles.errorText}>{errors[field.key]}</Text>
            </View>
          )}
        </Animated.View>
      ))}

      <Animated.View
        entering={FadeInDown.delay(fields.length * 100)}
        style={styles.submitContainer}
      >
        <Pressable
          style={[
            styles.submitButton,
            { backgroundColor: color },
            isSubmitting && styles.submitButtonDisabled
          ]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {showSuccess ? (
            <View style={styles.successContent}>
              <Check size={20} color="#ffffff" />
              <Text style={styles.submitText}>Resource Created!</Text>
            </View>
          ) : (
            <Text style={styles.submitText}>
              {isSubmitting ? 'Creating...' : submitLabel}
            </Text>
          )}
        </Pressable>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  containerDark: {
    backgroundColor: '#1a1a1a',
  },
  contentContainer: {
    padding: 16,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  labelDark: {
    color: '#ffffff',
  },
  required: {
    color: '#EF4444',
  },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#1a1a1a',
  },
  inputDark: {
    backgroundColor: '#333333',
    borderColor: '#444444',
    color: '#ffffff',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 6,
  },
  errorText: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: '#EF4444',
  },
  selectContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  selectOption: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  selectOptionDark: {
    borderColor: '#444444',
    backgroundColor: '#333333',
  },
  selectText: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: '#666666',
  },
  selectTextDark: {
    color: '#ffffff',
  },
  submitContainer: {
    marginTop: 24,
  },
  submitButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitText: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: '#ffffff',
  },
  successContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});

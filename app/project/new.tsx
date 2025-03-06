import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, ScrollView, Image } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useStore } from '../../store';
import { Cloud, Database, HardDrive, Network, Package, ChevronRight, Check, X } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInRight, FadeOutLeft } from 'react-native-reanimated';

const RESOURCE_TYPES = [
  {
    id: 'compute',
    title: 'Compute',
    icon: Cloud,
    color: '#FF6B6B',
    description: 'EC2 instances for your applications',
  },
  {
    id: 'database',
    title: 'Database',
    icon: Database,
    color: '#4ECDC4',
    description: 'RDS and DynamoDB databases',
  },
  {
    id: 'storage',
    title: 'Storage',
    icon: HardDrive,
    color: '#96CEB4',
    description: 'S3 buckets and EBS volumes',
  },
  {
    id: 'network',
    title: 'Network',
    icon: Network,
    color: '#9B59B6',
    description: 'Elastic IPs and VPCs',
  },
  {
    id: 'other',
    title: 'Other',
    icon: Package,
    color: '#F39C12',
    description: 'SQS queues and other services',
  },
];

// Mock unassigned resources
const UNASSIGNED_RESOURCES = {
  compute: [
    { id: 'i-123', name: 'Unused Server', type: 't3.medium', state: 'stopped' },
    { id: 'i-456', name: 'Test Instance', type: 't3.small', state: 'stopped' },
  ],
  database: [
    { id: 'db-123', name: 'Dev Database', engine: 'postgres', size: 'db.t3.micro' },
    { id: 'db-456', name: 'Test DB', engine: 'mysql', size: 'db.t3.small' },
  ],
  storage: [
    { id: 'bucket-123', name: 'unused-assets', region: 'us-east-1' },
    { id: 'bucket-456', name: 'test-data', region: 'us-west-2' },
  ],
  network: [
    { id: 'eip-123', publicIp: '54.123.456.789' },
    { id: 'eip-456', publicIp: '54.987.654.321' },
  ],
  other: [
    { id: 'sqs-123', name: 'unused-queue', messageCount: 0 },
    { id: 'sqs-456', name: 'test-queue', messageCount: 0 },
  ],
};

export default function NewProject() {
  const router = useRouter();
  const { addProject } = useStore();
  const [step, setStep] = useState(0);
  const [projectName, setProjectName] = useState('');
  const [nameError, setNameError] = useState('');
  const [selectedType, setSelectedType] = useState<any>(null);
  const [selectedResources, setSelectedResources] = useState<any>({});
  const [isCreating, setIsCreating] = useState(false);

  const validateProjectName = () => {
    if (!projectName.trim()) {
      setNameError('Project name is required');
      return false;
    }
    if (projectName.length < 3) {
      setNameError('Project name must be at least 3 characters');
      return false;
    }
    if (!/^[a-zA-Z0-9-\s]+$/.test(projectName)) {
      setNameError('Project name can only contain letters, numbers, spaces, and hyphens');
      return false;
    }
    setNameError('');
    return true;
  };

  const handleNext = () => {
    if (step === 0 && !validateProjectName()) return;
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    if (step === 0) {
      router.back();
    } else {
      setStep(prev => prev - 1);
      setSelectedType(null);
    }
  };

  const handleResourceSelect = (resource: any) => {
    setSelectedResources((prev:any) => ({
      ...prev,
      [selectedType]: [...(prev[selectedType] || []), resource],
    }));
  };

  const handleResourceDeselect = (resource: any) => {
    setSelectedResources((prev: any) => ({
      ...prev,
      [selectedType]: prev[selectedType].filter((r:any) => r.id !== resource.id),
    }));
  };

  const handleCreateProject = async () => {
    setIsCreating(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    const newProject = {
      id: Math.random().toString(36).substr(2, 9),
      name: projectName,
      createdAt: new Date(),
      resources: {
        compute: {
          ec2: selectedResources.compute || [],
          lambda: [],
        },
        database: {
          rds: selectedResources.database || [],
          dynamodb: [],
        },
        storage: {
          s3: selectedResources.storage || [],
          ebs: [],
        },
        network: {
          elasticIp: selectedResources.network || [],
        },
        other: {
          sqs: selectedResources.other || [],
        },
      },
    };

    addProject(newProject);
    router.replace(`/project/${newProject.id}`);
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <Animated.View
            entering={FadeInRight}
            exiting={FadeOutLeft}
            style={styles.stepContainer}
          >
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop' }}
              style={styles.stepImage}
            />
            <Text style={styles.stepTitle}>Name your project</Text>
            <Text style={styles.stepDescription}>
              Give your project a descriptive name to help you identify it later
            </Text>
            <TextInput
              style={[styles.input, nameError && styles.inputError]}
              placeholder="e.g., Production Environment"
              value={projectName}
              onChangeText={text => {
                setProjectName(text);
                if (nameError) setNameError('');
              }}
            />
            {nameError ? (
              <View style={styles.errorContainer}>
                <X size={16} color="#EF4444" />
                <Text style={styles.errorText}>{nameError}</Text>
              </View>
            ) : null}
          </Animated.View>
        );

      case 1:
        return (
          <Animated.View
            entering={FadeInRight}
            exiting={FadeOutLeft}
            style={styles.stepContainer}
          >
            <Text style={styles.stepTitle}>Select resource type</Text>
            <Text style={styles.stepDescription}>
              Choose the type of resource you want to add to your project
            </Text>
            <ScrollView style={styles.resourceList}>
              {RESOURCE_TYPES.map((type, index) => {
                const Icon = type.icon;
                return (
                  <Animated.View
                    key={type.id}
                    entering={FadeInDown.delay(index * 100)}
                  >
                    <Pressable
                      style={[
                        styles.resourceTypeCard,
                        { borderColor: type.color },
                      ]}
                      onPress={() => {
                        setSelectedType(type.id);
                        setStep(2);
                      }}
                    >
                      <View style={[styles.iconContainer, { backgroundColor: `${type.color}15` }]}>
                        <Icon size={24} color={type.color} />
                      </View>
                      <View style={styles.resourceTypeInfo}>
                        <Text style={styles.resourceTypeTitle}>{type.title}</Text>
                        <Text style={styles.resourceTypeDescription}>{type.description}</Text>
                      </View>
                      <ChevronRight size={20} color="#666666" />
                    </Pressable>
                  </Animated.View>
                );
              })}
            </ScrollView>
          </Animated.View>
        );

      case 2:
        const resources = UNASSIGNED_RESOURCES[selectedType] || [];
        const selected = selectedResources[selectedType] || [];

        return (
          <Animated.View
            entering={FadeInRight}
            exiting={FadeOutLeft}
            style={styles.stepContainer}
          >
            <Text style={styles.stepTitle}>Select resources</Text>
            <Text style={styles.stepDescription}>
              Choose the resources you want to add to your project
            </Text>
            <ScrollView style={styles.resourceList}>
              {resources.map((resource, index) => {
                const isSelected = selected.some(r => r.id === resource.id);
                return (
                  <Animated.View
                    key={resource.id}
                    entering={FadeInDown.delay(index * 100)}
                  >
                    <Pressable
                      style={[
                        styles.resourceCard,
                        isSelected && styles.resourceCardSelected,
                      ]}
                      onPress={() => {
                        if (isSelected) {
                          handleResourceDeselect(resource);
                        } else {
                          handleResourceSelect(resource);
                        }
                      }}
                    >
                      <View style={styles.resourceInfo}>
                        <Text style={styles.resourceName}>{resource.name}</Text>
                        <Text style={styles.resourceDetails}>
                          {resource.type || resource.engine || resource.region || resource.publicIp}
                        </Text>
                      </View>
                      {isSelected && (
                        <View style={styles.selectedCheck}>
                          <Check size={16} color="#ffffff" />
                        </View>
                      )}
                    </Pressable>
                  </Animated.View>
                );
              })}
            </ScrollView>
          </Animated.View>
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: step === 0 ? 'New Project' : step === 1 ? 'Add Resources' : 'Select Resources',
          headerLeft: () => (
            <Pressable onPress={handleBack} style={styles.headerButton}>
              <Text style={styles.headerButtonText}>
                {step === 0 ? 'Cancel' : 'Back'}
              </Text>
            </Pressable>
          ),
        }}
      />

      {renderStep()}

      <View style={styles.footer}>
        {step === 2 ? (
          <>
            <Pressable
              style={styles.secondaryButton}
              onPress={() => setStep(1)}
            >
              <Text style={styles.secondaryButtonText}>Add More Resources</Text>
            </Pressable>
            <Pressable
              style={[styles.primaryButton, isCreating && styles.primaryButtonDisabled]}
              onPress={handleCreateProject}
              disabled={isCreating}
            >
              <Text style={styles.primaryButtonText}>
                {isCreating ? 'Creating Project...' : 'Create Project'}
              </Text>
            </Pressable>
          </>
        ) : (
          <Pressable
            style={[styles.primaryButton, step === 0 && !projectName && styles.primaryButtonDisabled]}
            onPress={handleNext}
            disabled={step === 0 && !projectName}
          >
            <Text style={styles.primaryButtonText}>Continue</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  stepContainer: {
    flex: 1,
    padding: 16,
  },
  stepImage: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    marginBottom: 24,
  },
  stepTitle: {
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: '#666666',
    marginBottom: 24,
  },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: '#1a1a1a',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 8,
  },
  errorText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#EF4444',
  },
  resourceList: {
    flex: 1,
  },
  resourceTypeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resourceTypeInfo: {
    flex: 1,
    marginLeft: 16,
  },
  resourceTypeTitle: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: '#1a1a1a',
  },
  resourceTypeDescription: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#666666',
    marginTop: 4,
  },
  resourceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  resourceCardSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#007AFF10',
  },
  resourceInfo: {
    flex: 1,
  },
  resourceName: {
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
    color: '#1a1a1a',
  },
  resourceDetails: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#666666',
    marginTop: 4,
  },
  selectedCheck: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  primaryButtonDisabled: {
    opacity: 0.5,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  secondaryButton: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#1a1a1a',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  headerButton: {
    marginLeft: 8,
  },
  headerButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
});

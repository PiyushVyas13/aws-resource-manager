import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, Image, Modal, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { useStore } from '../../store';
import { Cloud, Database, HardDrive, Network, Package, Plus, Power, Trash2, X } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { StorageForm } from '@/components/forms/storage-form';
import { NetworkForm } from '@/components/forms/network-form';
import { QueueForm } from '@/components/forms/queue-form';
import { DatabaseForm } from '@/components/forms/database-form';
import { ComputeForm } from '@/components/forms/compute-form';

const AddResourceModal = ({ visible, onClose, title, color, children }: any) => {
  const { darkMode } = useStore();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <Animated.View
          entering={FadeInDown}
          style={[
            styles.modalContent,
            darkMode && styles.modalContentDark
          ]}
        >
          <View style={[
            styles.modalHeader,
            darkMode && styles.modalHeaderDark
          ]}>
            <Text style={[
              styles.modalTitle,
              darkMode && styles.modalTitleDark
            ]}>{title}</Text>
            <Pressable
              onPress={onClose}
              style={styles.modalClose}
              hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
            >
              <X size={24} color={darkMode ? '#ffffff' : '#666666'} />
            </Pressable>
          </View>

          <View style={styles.modalBody}>
            {children}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const ResourceCard = ({ title, icon: Icon, color, onAdd, children }: any) => (
  <Animated.View
    entering={FadeInDown}
    style={[styles.resourceCard, { borderLeftColor: color }]}
  >
    <View style={styles.resourceHeader}>
      <View style={styles.resourceTitle}>
        <Icon size={24} color={color} />
        <Text style={styles.resourceTitleText}>{title}</Text>
      </View>
      <Pressable
        style={[styles.addButton, { backgroundColor: `${color}15` }]}
        onPress={onAdd}
      >
        <Plus size={20} color={color} />
        <Text style={[styles.addButtonText, { color }]}>Add Resource</Text>
      </Pressable>
    </View>
    {children}
  </Animated.View>
);

const LoadingOverlay = ({ visible }: {visible: boolean}) => (
  visible ? (
    <View style={styles.loadingOverlay}>
      <ActivityIndicator size="large" color="#007AFF" />
    </View>
  ) : null
);

const InstanceCard = ({ name, state, type, onPower, onDelete }: any) => {
  const [isLoading, setIsLoading] = useState(false);

  const handlePower = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
    onPower();
    setIsLoading(false);
  };

  const handleDelete = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
    onDelete();
    setIsLoading(false);
  };

  return (
    <Animated.View
      entering={FadeInRight}
      style={styles.instanceCard}
    >
      <LoadingOverlay visible={isLoading} />
      <View style={styles.instanceHeader}>
        <Text style={styles.instanceName}>{name}</Text>
        <View style={styles.instanceActions}>
          <Pressable
            onPress={handlePower}
            disabled={isLoading}
            style={[
              styles.actionButton,
              { backgroundColor: state === 'running' ? '#22C55E15' : '#EF444415' }
            ]}
          >
            <Power size={18} color={state === 'running' ? '#22C55E' : '#EF4444'} />
          </Pressable>
          <Pressable
            onPress={handleDelete}
            disabled={isLoading}
            style={[styles.actionButton, { backgroundColor: '#EF444415' }]}
          >
            <Trash2 size={18} color="#EF4444" />
          </Pressable>
        </View>
      </View>
      <View style={styles.instanceDetails}>
        <View style={[styles.statusBadge, {
          backgroundColor: state === 'running' ? '#22C55E15' : '#64748B15'
        }]}>
          <Text style={[styles.statusText, {
            color: state === 'running' ? '#22C55E' : '#64748B'
          }]}>{state}</Text>
        </View>
        <Text style={styles.instanceType}>{type}</Text>
      </View>
    </Animated.View>
  );
};

export default function ProjectDetails() {
  const { id } = useLocalSearchParams();
  const { projects, updateProject } = useStore();
  const router = useRouter();
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const project = projects.find(p => p.id === id);

  const handlePowerToggle = (resourceType: any, instanceId: any) => {
    if (!project) return;

    const updatedProject = { ...project };
    if (resourceType === 'ec2') {
      const instance = updatedProject.resources.compute.ec2.find(i => i.id === instanceId);
      if (instance) {
        instance.state = instance.state === 'running' ? 'stopped' : 'running';
      }
    } else if (resourceType === 'rds') {
      const instance = updatedProject.resources.database.rds.find(i => i.id === instanceId);
      if (instance) {
        instance.state = instance.state === 'available' ? 'stopped' : 'available';
      }
    }
    updateProject(updatedProject);
  };

  const handleDelete = (resourceType: string, instanceId: string) => {
    if (!project) return;

    const updatedProject = { ...project };
    if (resourceType === 'ec2') {
      updatedProject.resources.compute.ec2 = updatedProject.resources.compute.ec2.filter(
        i => i.id !== instanceId
      );
    } else if (resourceType === 'rds') {
      updatedProject.resources.database.rds = updatedProject.resources.database.rds.filter(
        i => i.id !== instanceId
      );
    }
    updateProject(updatedProject);
  };



  const handleAddCompute = async (values: Record<string, string>) => {
    if (!project) return;

    const updatedProject = { ...project };
    updatedProject.resources.compute.ec2.push({
      id: `i-${Math.random().toString(36).substr(2, 9)}`,
      name: values.name,
      state: 'stopped',
      type: values.type,
    });

    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
    updateProject(updatedProject);
    setActiveModal(null);
  };

  const handleAddDatabase = async (values: Record<string, string>) => {
    if (!project) return;

    const updatedProject = { ...project };
    updatedProject.resources.database.rds.push({
      id: `db-${Math.random().toString(36).substr(2, 9)}`,
      name: values.name,
      state: 'stopped',
      engine: values.engine,
      size: values.size,
    });

    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
    updateProject(updatedProject);
    setActiveModal(null);
  };

  const handleAddStorage = async (values: Record<string, string>) => {
    if (!project) return;

    const updatedProject = { ...project };
    updatedProject.resources.storage.s3.push({
      name: values.name,
      createdAt: new Date(),
      region: values.region,
    });

    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
    updateProject(updatedProject);
    setActiveModal(null);
  };

  const handleAddNetwork = async (values: Record<string, string>) => {
    if (!project) return;

    const updatedProject = { ...project };
    updatedProject.resources.network.elasticIp.push({
      allocationId: `eip-${Math.random().toString(36).substr(2, 9)}`,
      publicIp: `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`,
      name: values.name,
    });

    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
    updateProject(updatedProject);
    setActiveModal(null);
  };

  const handleAddQueue = async (values: Record<string, string>) => {
    if (!project) return;

    const updatedProject = { ...project };
    updatedProject.resources.other.sqs.push({
      url: `https://sqs.us-east-1.amazonaws.com/123456789012/${values.name}`,
      name: values.name,
      messageCount: 0,
    });

    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
    updateProject(updatedProject);
    setActiveModal(null);
  };

  if (!project) {
    return (
      <View style={styles.container}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1594322436404-5a0526db4d13?q=80&w=2029&auto=format&fit=crop' }}
          style={styles.errorImage}
        />
        <Text style={styles.errorTitle}>Project Not Found</Text>
        <Text style={styles.errorText}>The project you're looking for doesn't exist or has been deleted.</Text>
        <Pressable
          style={styles.errorButton}
          onPress={() => router.back()}
        >
          <Text style={styles.errorButtonText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>


      <View style={styles.header}>
        <Text style={styles.title}>{project.name}</Text>
        <Text style={styles.date}>
          Created on {new Date(project.createdAt).toLocaleDateString()}
        </Text>
      </View>

      <ResourceCard
        title="Compute"
        icon={Cloud}
        color="#FF6B6B"
        onAdd={() => setActiveModal('compute')}
      >
        {project.resources.compute.ec2.map((instance) => (
          <InstanceCard
            key={instance.id}
            name={instance.name}
            state={instance.state}
            type={instance.type}
            onPower={() => handlePowerToggle('ec2', instance.id)}
            onDelete={() => handleDelete('ec2', instance.id)}
          />
        ))}
      </ResourceCard>

      <ResourceCard
        title="Database"
        icon={Database}
        color="#4ECDC4"
        onAdd={() => setActiveModal('database')}
      >
        {project.resources.database.rds.map((instance) => (
          <InstanceCard
            key={instance.id}
            name={instance.name}
            state={instance.state}
            type={instance.engine}
            onPower={() => handlePowerToggle('rds', instance.id)}
            onDelete={() => handleDelete('rds', instance.id)}
          />
        ))}
      </ResourceCard>

      <ResourceCard
        title="Storage"
        icon={HardDrive}
        color="#96CEB4"
        onAdd={() => setActiveModal('storage')}
      >
        {project.resources.storage.s3.map((bucket) => (
          <Animated.View
            key={bucket.name}
            entering={FadeInRight}
            style={styles.bucketCard}
          >
            <Text style={styles.bucketName}>{bucket.name}</Text>
            <Text style={styles.bucketRegion}>{bucket.region}</Text>
          </Animated.View>
        ))}
      </ResourceCard>

      <ResourceCard
        title="Network"
        icon={Network}
        color="#9B59B6"
        onAdd={() => setActiveModal('network')}
      >
        {project.resources.network.elasticIp.map((ip) => (
          <Animated.View
            key={ip.allocationId}
            entering={FadeInRight}
            style={styles.ipCard}
          >
            <Text style={styles.ipAddress}>{ip.publicIp}</Text>
            {ip.instanceId && (
              <Text style={styles.ipInstance}>Attached to: {ip.instanceId}</Text>
            )}
          </Animated.View>
        ))}
      </ResourceCard>

      <ResourceCard
        title="Other"
        icon={Package}
        color="#F39C12"
        onAdd={() => setActiveModal('other')}
      >
        {project.resources.other.sqs.map((queue) => (
          <Animated.View
            key={queue.url}
            entering={FadeInRight}
            style={styles.queueCard}
          >
            <Text style={styles.queueName}>{queue.name}</Text>
            <View style={styles.queueStats}>
              <Text style={styles.queueMessages}>
                {queue.messageCount} messages
              </Text>
            </View>
          </Animated.View>
        ))}
      </ResourceCard>

      <AddResourceModal
        visible={activeModal === 'compute'}
        onClose={() => setActiveModal(null)}
        title="Add Compute Resource"
        color="#FF6B6B"
      >
        <ComputeForm onSubmit={handleAddCompute} />
      </AddResourceModal>

      <AddResourceModal
        visible={activeModal === 'database'}
        onClose={() => setActiveModal(null)}
        title="Add Database Resource"
        color="#4ECDC4"
      >
        <DatabaseForm onSubmit={handleAddDatabase} />
      </AddResourceModal>

      <AddResourceModal
        visible={activeModal === 'storage'}
        onClose={() => setActiveModal(null)}
        title="Add Storage Resource"
        color="#96CEB4"
      >
        <StorageForm onSubmit={handleAddStorage} />
      </AddResourceModal>

      <AddResourceModal
        visible={activeModal === 'network'}
        onClose={() => setActiveModal(null)}
        title="Add Network Resource"
        color="#9B59B6"
      >
        <NetworkForm onSubmit={handleAddNetwork} />
      </AddResourceModal>

      <AddResourceModal
        visible={activeModal === 'other'}
        onClose={() => setActiveModal(null)}
        title="Add Queue Resource"
        color="#F39C12"
      >
        <QueueForm onSubmit={handleAddQueue} />
      </AddResourceModal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter_600Semibold',
    color: '#1a1a1a',
  },
  content: {
    padding: 16,
    gap: 16,
  },
  header: {
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#666666',
  },
  resourceCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    borderLeftWidth: 4,
  },
  resourceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  resourceTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  resourceTitleText: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    color: '#1a1a1a',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    gap: 6,
  },
  addButtonText: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },
  instanceCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    position: 'relative',
    overflow: 'hidden',
  },
  instanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  instanceName: {
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
    color: '#1a1a1a',
  },
  instanceActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
  },
  instanceDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
  },
  instanceType: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#666666',
  },
  bucketCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  bucketName: {
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  bucketRegion: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#666666',
  },
  ipCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  ipAddress: {
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  ipInstance: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#666666',
  },
  queueCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  queueName: {
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  queueStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  queueMessages: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#666666',
  },
  errorImage: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    marginBottom: 24,
  },
  errorTitle: {
    fontSize: 24,
    fontFamily: 'Inter_600SemiBold',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: '#666666',
    textAlign: 'center',
    marginBottom: 24,
  },
  errorButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  errorButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    textAlign: 'center',
  },

  modalText: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: '#666666',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    borderRadius: 12,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
    maxHeight: '80%',
    elevation: 10,
    zIndex: 1000,
    alignSelf: 'center',
  },
  modalContentDark: {
    backgroundColor: '#1a1a1a',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
    backgroundColor: '#ffffff',
  },
  modalHeaderDark: {
    backgroundColor: '#1a1a1a',
    borderBottomColor: '#333333',
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    color: '#1a1a1a',
  },
  modalTitleDark: {
    color: '#ffffff',
  },
  modalClose: {
    padding: 4,
  },
  modalBody: {
    flex: 1,
  },

});

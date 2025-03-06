import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, TextInput, Image } from 'react-native';
import { Link } from 'expo-router';
import { useStore } from '@/store';
import { Cloud, Database, HardDrive, Network, Package, Plus, Search } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const ResourceBadge = ({ count, icon: Icon, color = '#007AF00' }: any) => (
  <View style={[styles.badge, { backgroundColor: `${color}10` }]}>
    <Icon size={14} color={color} />
    <Text style={[styles.badgeText, { color }]}>{count}</Text>
  </View>
);

export default function Projects() {
  const { projects } = useStore();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Projects</Text>
        <Link href="/project/new" asChild>
          <Pressable style={styles.newButton}>
            <Plus size={20} color="#ffffff" />
            <Text style={styles.newButtonText}>New Project</Text>
          </Pressable>
        </Link>
      </View>

      <View style={styles.searchWrapper}>
        <Animated.View
          entering={FadeInDown.delay(100)}
          style={styles.searchContainer}
        >
          <Search size={20} color="#666666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search projects..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#666666"
          />
        </Animated.View>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.projectsGrid}>
          {filteredProjects.map((project, index) => (
            <Link
              key={project.id}
              href={`/project/${project.id}`}
              asChild
            >
              <Pressable>
                <Animated.View
                  entering={FadeInRight.delay(index * 100)}
                  style={styles.projectCard}
                >
                  <View style={styles.projectHeader}>
                    <Text style={styles.projectName}>{project.name}</Text>
                    <Text style={styles.projectDate}>
                      {new Date(project.createdAt).toLocaleDateString()}
                    </Text>
                  </View>

                  <View style={styles.resourceSection}>
                    <Text style={styles.sectionTitle}>Compute</Text>
                    <View style={styles.resourceBadges}>
                      <ResourceBadge
                        count={project.resources.compute.ec2.length}
                        icon={Cloud}
                        color="#FF6B6B"
                      />
                      <Text style={styles.resourceLabel}>EC2</Text>
                    </View>
                  </View>

                  <View style={styles.resourceSection}>
                    <Text style={styles.sectionTitle}>Database</Text>
                    <View style={styles.resourceBadges}>
                      <ResourceBadge
                        count={project.resources.database.rds.length}
                        icon={Database}
                        color="#4ECDC4"
                      />
                      <Text style={styles.resourceLabel}>RDS</Text>
                      <ResourceBadge
                        count={project.resources.database.dynamodb.length}
                        icon={Database}
                        color="#45B7D1"
                      />
                      <Text style={styles.resourceLabel}>DynamoDB</Text>
                    </View>
                  </View>

                  <View style={styles.resourceSection}>
                    <Text style={styles.sectionTitle}>Storage</Text>
                    <View style={styles.resourceBadges}>
                      <ResourceBadge
                        count={project.resources.storage.s3.length}
                        icon={HardDrive}
                        color="#96CEB4"
                      />
                      <Text style={styles.resourceLabel}>S3</Text>
                    </View>
                  </View>

                  <View style={styles.resourceSection}>
                    <Text style={styles.sectionTitle}>Network</Text>
                    <View style={styles.resourceBadges}>
                      <ResourceBadge
                        count={project.resources.network.elasticIp.length}
                        icon={Network}
                        color="#9B59B6"
                      />
                      <Text style={styles.resourceLabel}>Elastic IP</Text>
                    </View>
                  </View>

                  <View style={styles.resourceSection}>
                    <Text style={styles.sectionTitle}>Other</Text>
                    <View style={styles.resourceBadges}>
                      <ResourceBadge
                        count={project.resources.other.sqs.length}
                        icon={Package}
                        color="#F39C12"
                      />
                      <Text style={styles.resourceLabel}>SQS</Text>
                    </View>
                  </View>
                </Animated.View>
              </Pressable>
            </Link>
          ))}
        </View>

        {filteredProjects.length === 0 && (
          <Animated.View
            entering={FadeInDown}
            style={styles.emptyState}
          >
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1600267185393-e158a98703de?q=80&w=2070&auto=format&fit=crop' }}
              style={styles.emptyStateImage}
            />
            <Text style={styles.emptyStateTitle}>
              {searchQuery ? 'No matching projects found' : 'No projects yet'}
            </Text>
            <Text style={styles.emptyStateText}>
              {searchQuery
                ? 'Try adjusting your search terms'
                : 'Create your first project to start managing your AWS resources'
              }
            </Text>
            <Link href="/project/new" asChild>
              <Pressable style={styles.emptyStateButton}>
                <Plus size={20} color="#ffffff" />
                <Text style={styles.buttonText}>Create Project</Text>
              </Pressable>
            </Link>
          </Animated.View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 24,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  title: {
    fontSize: 32,
    fontFamily: 'Inter_700Bold',
    color: '#1a1a1a',
  },
  newButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 8,
  },
  newButtonText: {
    color: '#ffffff',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
  },
  searchWrapper: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: '#1a1a1a',
  },
  projectsGrid: {
    gap: 16,
  },
  projectCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 16,
  },
  projectHeader: {
    marginBottom: 16,
  },
  projectName: {
    fontSize: 20,
    fontFamily: 'Inter_600SemiBold',
    color: '#1a1a1a',
  },
  projectDate: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#666666',
    marginTop: 4,
  },
  resourceSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: '#666666',
    marginBottom: 8,
  },
  resourceBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    alignItems: 'center',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6,
    borderRadius: 8,
    gap: 4,
  },
  badgeText: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
  },
  resourceLabel: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: '#1a1a1a',
  },
  emptyState: {
    alignItems: 'center',
    padding: 24,
  },
  emptyStateImage: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    marginBottom: 24,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontFamily: 'Inter_600SemiBold',
    color: '#1a1a1a',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: '#666666',
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyStateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
  },
});

import React from 'react';
import { View, Text, ScrollView, Image, StyleSheet, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { useStore } from '@/store';
import { Cloud, Database, HardDrive, Network, Package, Plus } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const ResourceCard = ({ title, count, icon: Icon, delay = 0 }: any) => (
  <Animated.View
    entering={FadeInDown.delay(delay)}
    style={styles.resourceCard}
  >
    <Icon size={24} color="#007AFF" />
    <View style={styles.resourceInfo}>
      <Text style={styles.resourceTitle}>{title}</Text>
      <Text style={styles.resourceCount}>{count}</Text>
    </View>
  </Animated.View>
);

export default function Dashboard() {
  const { projects, awsCredentials } = useStore();

  if (!awsCredentials) {
    return (
      <View style={styles.container}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1483478550801-ceba5fe50e8e?q=80&w=2070&auto=format&fit=crop' }}
          style={styles.heroImage}
        />
        <View style={styles.content}>
          <Text style={styles.title}>Welcome to AWS Resource Manager</Text>
          <Text style={styles.subtitle}>
            Connect your AWS account to get started managing your cloud resources
          </Text>
          <Link href="/settings" asChild>
            <Pressable style={styles.button}>
              <Text style={styles.buttonText}>Connect AWS Account</Text>
            </Pressable>
          </Link>
        </View>
      </View>
    );
  }

  const totalResources = projects.reduce((acc, project) => {
    return {
      ec2: acc.ec2 + project.resources.compute.ec2.length,
      rds: acc.rds + project.resources.database.rds.length,
      s3: acc.s3 + project.resources.storage.s3.length,
      elasticIp: acc.elasticIp + project.resources.network.elasticIp.length,
      sqs: acc.sqs + project.resources.other.sqs.length,
    };
  }, { ec2: 0, rds: 0, s3: 0, elasticIp: 0, sqs: 0 });

  return (
    <SafeAreaView style={styles.container} >
      <ScrollView contentContainerStyle={styles.scrollContent} >
        <View style={styles.header}>
          <Text style={styles.greeting}>Hello!</Text>
          <Link href="/project/new" asChild>
            <Pressable style={styles.newProjectButton}>
              <Plus size={20} color="#007AFF" />
              <Text style={styles.newProjectText}>New Project</Text>
            </Pressable>
          </Link>
        </View>

        <Text style={styles.sectionTitle}>Resource Overview</Text>
        <View style={styles.resourceGrid}>
          <ResourceCard title="Compute" count={totalResources.ec2} icon={Cloud} delay={100} />
          <ResourceCard title="Database" count={totalResources.rds} icon={Database} delay={200} />
          <ResourceCard title="Storage" count={totalResources.s3} icon={HardDrive} delay={300} />
          <ResourceCard title="Network" count={totalResources.elasticIp} icon={Network} delay={400} />
          <ResourceCard title="Other" count={totalResources.sqs} icon={Package} delay={500} />
        </View>

        <Text style={styles.sectionTitle}>Recent Projects</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.projectsScroll}
        >
          {projects.slice(0, 5).map((project, index) => (
            <Link
              key={project.id}
              href={`/project/${project.id}`}
              asChild
            >
              <Pressable>
                <Animated.View
                  entering={FadeInDown.delay(index * 100)}
                  style={styles.projectCard}
                >
                  <Text style={styles.projectName}>{project.name}</Text>
                  <Text style={styles.projectDate}>
                    {new Date(project.createdAt).toLocaleDateString()}
                  </Text>
                  <View style={styles.projectStats}>
                    <Text style={styles.statsText}>
                      {project.resources.compute.ec2.length} EC2 •{' '}
                      {project.resources.database.rds.length} RDS •{' '}
                      {project.resources.storage.s3.length} S3
                    </Text>
                  </View>
                </Animated.View>
              </Pressable>
            </Link>
          ))}
        </ScrollView>
      </ScrollView>
    </SafeAreaView>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 28,
    fontFamily: 'Inter_700Bold',
    color: '#1a1a1a',
  },
  newProjectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e6f2ff',
    padding: 12,
    borderRadius: 12,
    gap: 8,
  },
  newProjectText: {
    color: '#007AFF',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter_600SemiBold',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  resourceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  resourceCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  resourceInfo: {
    marginTop: 12,
  },
  resourceTitle: {
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
    color: '#1a1a1a',
  },
  resourceCount: {
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
    color: '#007AFF',
    marginTop: 4,
  },
  projectsScroll: {
    paddingRight: 16,
  },
  projectCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    width: 280,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  projectName: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    color: '#1a1a1a',
  },
  projectDate: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#666666',
    marginTop: 4,
  },
  projectStats: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  statsText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#666666',
  },
  heroImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  content: {
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: '#666666',
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
});

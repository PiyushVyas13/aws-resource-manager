import { create } from 'zustand';
import { AWSCredentials, Project } from '../types/aws';

// Mock data for demonstration
const mockProjects: Project[] = [
  {
    id: '1',
    name: 'E-Commerce Backend',
    createdAt: new Date('2024-01-15'),
    resources: {
      compute: {
        ec2: [
          {
            id: 'i-123456',
            name: 'API Server',
            state: 'running',
            type: 't3.medium',
            publicIp: '54.123.456.789'
          }
        ],
        lambda: ['auth-service', 'payment-processor']
      },
      database: {
        rds: [
          {
            id: 'db-123456',
            name: 'Main Database',
            state: 'available',
            engine: 'postgres',
            size: 'db.t3.medium'
          }
        ],
        dynamodb: [
          {
            name: 'Sessions',
            status: 'active',
            itemCount: 15000
          }
        ]
      },
      storage: {
        s3: [
          {
            name: 'user-uploads',
            createdAt: new Date('2024-01-15'),
            region: 'us-east-1'
          }
        ],
        ebs: ['vol-123456']
      },
      network: {
        elasticIp: [
          {
            allocationId: 'eip-123456',
            publicIp: '54.123.456.789',
            instanceId: 'i-123456'
          }
        ]
      },
      other: {
        sqs: [
          {
            url: 'https://sqs.us-east-1.amazonaws.com/123456789012/orders',
            name: 'orders',
            messageCount: 150
          }
        ]
      }
    }
  },
  {
    id: '2',
    name: 'Analytics Platform',
    createdAt: new Date('2024-02-01'),
    resources: {
      compute: {
        ec2: [
          {
            id: 'i-789012',
            name: 'Analytics Engine',
            state: 'running',
            type: 't3.large',
            publicIp: '54.789.012.345'
          }
        ],
        lambda: ['data-processor', 'report-generator']
      },
      database: {
        rds: [],
        dynamodb: [
          {
            name: 'AnalyticsData',
            status: 'active',
            itemCount: 50000
          }
        ]
      },
      storage: {
        s3: [
          {
            name: 'raw-data',
            createdAt: new Date('2024-02-01'),
            region: 'us-east-1'
          },
          {
            name: 'processed-data',
            createdAt: new Date('2024-02-01'),
            region: 'us-east-1'
          }
        ],
        ebs: []
      },
      network: {
        elasticIp: []
      },
      other: {
        sqs: [
          {
            url: 'https://sqs.us-east-1.amazonaws.com/123456789012/analytics',
            name: 'analytics',
            messageCount: 500
          }
        ]
      }
    }
  }
];

interface AppState {
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
  awsCredentials: AWSCredentials | null;
  setAWSCredentials: (credentials: AWSCredentials) => void;
  projects: Project[];
  addProject: (project: Project) => void;
  updateProject: (project: Project) => void;
  deleteProject: (projectId: string) => void;
}

export const useStore = create<AppState>((set) => ({
  darkMode: false,
  setDarkMode: (darkMode) => set({ darkMode }),
  awsCredentials: null,
  setAWSCredentials: (credentials) => set({ awsCredentials: credentials }),
  projects: mockProjects, // Initialize with mock data
  addProject: (project) =>
    set((state) => ({ projects: [...state.projects, project] })),
  updateProject: (project) =>
    set((state) => ({
      projects: state.projects.map((p) => (p.id === project.id ? project : p)),
    })),
  deleteProject: (projectId) =>
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== projectId),
    })),
}));
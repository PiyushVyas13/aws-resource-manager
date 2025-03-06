import { Tabs } from 'expo-router';
import { useStore } from '../../store';
import { Chrome as Home, FolderKanban, Settings } from 'lucide-react-native';

export default function TabLayout() {
  const { darkMode } = useStore();

  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: darkMode ? '#1a1a1a' : '#ffffff',
        },
        headerTintColor: darkMode ? '#ffffff' : '#000000',
        tabBarStyle: {
          backgroundColor: darkMode ? '#1a1a1a' : '#ffffff',
          borderTopColor: darkMode ? '#333333' : '#e5e5e5',
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: darkMode ? '#888888' : '#666666',
        headerShadowVisible: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
          headerStyle: {
            backgroundColor: darkMode ? '#000000' : '#f5f5f5',
          },
          headerShown: false
        }}
      />
      <Tabs.Screen
        name="projects"
        options={{
          title: 'Projects',
          tabBarIcon: ({ color, size }) => <FolderKanban size={size} color={color} />,
          headerStyle: {
            backgroundColor: darkMode ? '#000000' : '#f5f5f5',
          },
          headerShown: false
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => <Settings size={size} color={color} />,
          headerStyle: {
            backgroundColor: darkMode ? '#000000' : '#f5f5f5',
          },
        }}
      />
    </Tabs>
  );
}

import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { SplashScreen } from 'expo-router';
import { useColorScheme } from 'react-native';
import { useStore } from '../store';

export default function RootLayout() {
  const { darkMode } = useStore();

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: darkMode ? '#1a1a1a' : '#ffffff',
          },
          headerTintColor: darkMode ? '#ffffff' : '#000000',
          contentStyle: {
            backgroundColor: darkMode ? '#000000' : '#f5f5f5',
          },
          headerShadowVisible: false,
        }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="project/[id]"
          options={{
            title: 'Project Details',
            presentation: 'card',
          }}
        />
        <Stack.Screen
          name="project/new"
          options={{
            title: 'New Project',
            presentation: 'modal',
            headerStyle: {
              backgroundColor: darkMode ? '#000000' : '#f5f5f5',
            },
          }}
        />
      </Stack>
      <StatusBar style={darkMode ? 'light' : 'dark'} />
    </>
  );
}

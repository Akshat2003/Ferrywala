// App.tsx
import React, { useState, useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import global styles for NativeWind
import "./global.css";

// Import screens
import SplashScreen from './src/screens/SplashScreen';
import HomeScreen from './src/screens/main/HomeScreen';
import CategoryListingScreen from './src/screens/main/CategoryListingScreen';

// Import navigation types
import { RootStackParamList } from './src/navigation/types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  const handleSplashComplete = () => {
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <SplashScreen onAnimationComplete={handleSplashComplete} />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
              headerShown: false,
              animation: 'slide_from_right',
              gestureEnabled: true,
            }}
          >
            <Stack.Screen 
              name="Home" 
              component={HomeScreen} 
            />
            <Stack.Screen 
              name="CategoryListing" 
              component={CategoryListingScreen}
              options={{
                animation: 'slide_from_right',
              }}
            />
            {/* Placeholder screens for future implementation */}
            <Stack.Screen 
              name="VendorDetail" 
              component={PlaceholderScreen}
              options={{
                animation: 'slide_from_right',
              }}
            />
            <Stack.Screen 
              name="Search" 
              component={PlaceholderScreen}
              options={{
                animation: 'slide_from_bottom',
              }}
            />
            <Stack.Screen 
              name="Cart" 
              component={PlaceholderScreen}
              options={{
                animation: 'slide_from_right',
              }}
            />
            <Stack.Screen 
              name="Profile" 
              component={PlaceholderScreen}
              options={{
                animation: 'slide_from_right',
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

// Placeholder component for screens not yet implemented
const PlaceholderScreen: React.FC = () => {
  const React = require('react');
  const { View, Text, TouchableOpacity } = require('react-native');
  const { useNavigation } = require('@react-navigation/native');
  const { SafeAreaView } = require('react-native-safe-area-context');
  
  const navigation = useNavigation();
  
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 justify-center items-center p-6">
        <Text className="text-6xl mb-4">🚧</Text>
        <Text className="text-xl font-semibold text-gray-900 text-center mb-2">
          Coming Soon
        </Text>
        <Text className="text-base text-gray-600 text-center mb-6">
          This screen is under development and will be available soon.
        </Text>
        <TouchableOpacity
          className="px-6 py-3 rounded-lg"
          style={{ backgroundColor: '#FF6100' }}
          onPress={() => navigation.goBack()}
        >
          <Text className="text-base font-medium text-white">
            Go Back
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
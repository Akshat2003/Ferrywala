// src/components/common/LoadingSpinner.tsx
import React from 'react';
import {
  View,
  ActivityIndicator,
  Text,
} from 'react-native';

interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  color?: string;
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'large',
  color = '#FF6100',
  message,
}) => {
  return (
    <View className="flex-1 justify-center items-center p-6">
      <ActivityIndicator size={size} color={color} />
      {message && (
        <Text className="mt-4 text-base text-gray-600 text-center">
          {message}
        </Text>
      )}
    </View>
  );
};

export default LoadingSpinner;
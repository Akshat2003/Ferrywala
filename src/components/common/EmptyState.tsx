// src/components/common/EmptyState.tsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';

interface EmptyStateProps {
  icon: string;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  message,
  actionLabel,
  onAction,
}) => {
  return (
    <View className="flex-1 justify-center items-center p-8">
      <Text className="text-6xl mb-4">{icon}</Text>
      <Text className="text-xl font-semibold text-gray-900 text-center mb-2">
        {title}
      </Text>
      <Text className="text-base text-gray-600 text-center mb-6">
        {message}
      </Text>
      {actionLabel && onAction && (
        <TouchableOpacity
          className="px-6 py-3 rounded-lg"
          style={{ backgroundColor: '#FF6100' }}
          onPress={onAction}
        >
          <Text className="text-base font-medium text-white">
            {actionLabel}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default EmptyState;
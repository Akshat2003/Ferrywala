// src/components/common/ErrorMessage.tsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <View className="flex-1 justify-center items-center p-6">
      <Icon name="error-outline" size={48} color="#FF6100" />
      <Text className="mt-4 text-base text-gray-600 text-center">
        {message}
      </Text>
      {onRetry && (
        <TouchableOpacity 
          className="mt-5 px-5 py-2 rounded-lg"
          style={{ backgroundColor: '#FF6100' }}
          onPress={onRetry}
        >
          <Text className="text-base font-medium text-white">Retry</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ErrorMessage;
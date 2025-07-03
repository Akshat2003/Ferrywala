// src/components/layout/BackHeader.tsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface BackHeaderProps {
  title: string;
  subtitle?: string;
  onBack: () => void;
  rightIcon?: string;
  onRightPress?: () => void;
}

const BackHeader: React.FC<BackHeaderProps> = ({
  title,
  subtitle,
  onBack,
  rightIcon,
  onRightPress,
}) => {
  return (
    <View className="bg-white border-b border-gray-100">
      <View className="flex-row items-center justify-between px-4 py-3">
        <TouchableOpacity
          className="flex-row items-center flex-1"
          onPress={onBack}
          activeOpacity={0.7}
        >
          <Icon 
            name={Platform.OS === 'ios' ? 'arrow-back-ios' : 'arrow-back'} 
            size={24} 
            color="#374151" 
          />
          <View className="ml-3 flex-1">
            <Text className="text-lg font-semibold text-gray-900" numberOfLines={1}>
              {title}
            </Text>
            {subtitle && (
              <Text className="text-sm text-gray-600" numberOfLines={1}>
                {subtitle}
              </Text>
            )}
          </View>
        </TouchableOpacity>
        
        {rightIcon && onRightPress && (
          <TouchableOpacity
            className="ml-4 p-2"
            onPress={onRightPress}
            activeOpacity={0.7}
          >
            <Icon name={rightIcon} size={24} color="#374151" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default BackHeader;
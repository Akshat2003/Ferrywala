// src/components/home/LocationPermissionCard.tsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';

interface LocationPermissionCardProps {
  onRequestPermission: () => void;
}

const LocationPermissionCard: React.FC<LocationPermissionCardProps> = ({
  onRequestPermission,
}) => {
  return (
    <View className="flex-row items-center rounded-xl p-4 border" style={{ backgroundColor: '#FFF5F0', borderColor: '#FFE5D6' }}>
      <View className="w-12 h-12 rounded-full bg-white justify-center items-center mr-4">
        <Text className="text-2xl">📍</Text>
      </View>
      <View className="flex-1 mr-2">
        <Text className="text-base font-semibold text-gray-900 mb-0.5">
          Enable Location Services
        </Text>
        <Text className="text-sm text-gray-600">
          Allow location access to discover vendors and services near you
        </Text>
      </View>
      <TouchableOpacity
        className="px-5 py-2 rounded-lg"
        style={{ backgroundColor: '#FF6100' }}
        onPress={onRequestPermission}
        activeOpacity={0.8}
      >
        <Text className="text-sm font-medium text-white">Enable</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LocationPermissionCard;
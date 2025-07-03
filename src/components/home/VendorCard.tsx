// src/components/home/VendorCard.tsx
import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Vendor } from '../../types/vendor.types';

interface VendorCardProps {
  vendor: Vendor;
  onPress: () => void;
}

const VendorCard: React.FC<VendorCardProps> = ({ vendor, onPress }) => {
  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      fruitwala: '🍎',
      sabjiwala: '🥬',
      atalewala: '♻️',
      sugarcane: '🥤',
      mochi: '👞',
      chainrepair: '🔗',
      gasrepair: '🔥',
      welding: '⚡',
      paan: '🍃',
      gardener: '🌱',
      watchman: '👮',
      driver: '🚗',
    };
    return icons[category] || '📦';
  };

  return (
    <TouchableOpacity
      className="w-40 bg-white rounded-xl shadow-sm"
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View className="relative h-32">
        <Image
          source={{ uri: vendor.profileImage }}
          className="w-full h-full rounded-t-xl bg-gray-200"
          // defaultSource={require('../../assets/placeholder-vendor.png')}
        />
        {vendor.isVerified && (
          <View className="absolute top-2 right-2 bg-white rounded-full p-1">
            <Text className="text-xs" style={{ color: '#FF6100' }}>✓</Text>
          </View>
        )}
        {vendor.isAvailable && (
          <View className="absolute bottom-2 right-2 bg-white rounded-full p-1">
            <View className="w-3 h-3 rounded-full bg-green-500" />
          </View>
        )}
      </View>

      <View className="p-3">
        <View className="flex-row items-center mb-1">
          <Text className="text-base mr-1">{getCategoryIcon(vendor.category)}</Text>
          <Text className="text-xs font-medium text-gray-600 capitalize">
            {vendor.category}
          </Text>
        </View>

        <Text className="text-base font-semibold text-gray-900 mb-1" numberOfLines={1}>
          {vendor.name}
        </Text>

        <View className="flex-row items-center mb-1">
          <Text className="text-sm" style={{ color: '#FFB800' }}>⭐</Text>
          <Text className="text-sm font-medium text-gray-900 ml-1">
            {vendor.rating.toFixed(1)}
          </Text>
          <Text className="text-xs text-gray-600 ml-0.5">
            ({vendor.totalRatings})
          </Text>
        </View>

        {vendor.distance && (
          <View className="flex-row items-center">
            <Icon name="location-on" size={14} color="#6B7280" />
            <Text className="text-xs text-gray-600 ml-1">
              {vendor.distance < 1
                ? `${(vendor.distance * 1000).toFixed(0)}m`
                : `${vendor.distance.toFixed(1)}km`}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default VendorCard;
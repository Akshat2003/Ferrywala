// src/components/category/VendorListItem.tsx
import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Vendor } from '../../types/vendor.types';

interface VendorListItemProps {
  vendor: Vendor;
  onPress: () => void;
  onCallPress?: () => void;
  onCartPress?: () => void;
}

const VendorListItem: React.FC<VendorListItemProps> = ({
  vendor,
  onPress,
  onCallPress,
  onCartPress,
}) => {
  const formatWorkingHours = () => {
    if (!vendor.workingHours) return null;
    return `${vendor.workingHours.start} - ${vendor.workingHours.end}`;
  };

  const formatDistance = () => {
    if (!vendor.distance) return null;
    return vendor.distance < 1
      ? `${(vendor.distance * 1000).toFixed(0)}m away`
      : `${vendor.distance.toFixed(1)}km away`;
  };

  return (
    <TouchableOpacity
      className="bg-white mx-5 mb-3 rounded-xl shadow-sm overflow-hidden"
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View className="flex-row p-4">
        {/* Vendor Image */}
        <View className="relative">
          <Image
            source={{ uri: vendor.profileImage }}
            className="w-20 h-20 rounded-xl bg-gray-200"
          />
          {vendor.isAvailable && (
            <View className="absolute -top-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white" />
          )}
        </View>

        {/* Vendor Details */}
        <View className="flex-1 ml-3">
          <View className="flex-row items-start justify-between">
            <View className="flex-1">
              <View className="flex-row items-center">
                <Text className="text-base font-semibold text-gray-900" numberOfLines={1}>
                  {vendor.name}
                </Text>
                {vendor.isVerified && (
                  <View className="ml-1 bg-blue-100 rounded-full px-1.5 py-0.5">
                    <Text className="text-xs" style={{ color: '#2563EB' }}>✓</Text>
                  </View>
                )}
              </View>
              
              <View className="flex-row items-center mt-1">
                <Icon name="star" size={16} color="#FFB800" />
                <Text className="text-sm font-medium text-gray-900 ml-0.5">
                  {vendor.rating.toFixed(1)}
                </Text>
                <Text className="text-sm text-gray-600 ml-1">
                  ({vendor.totalRatings})
                </Text>
                {vendor.distance && (
                  <>
                    <Text className="text-gray-400 mx-2">•</Text>
                    <Icon name="location-on" size={14} color="#6B7280" />
                    <Text className="text-sm text-gray-600 ml-0.5">
                      {formatDistance()}
                    </Text>
                  </>
                )}
              </View>

              {vendor.description && (
                <Text className="text-sm text-gray-600 mt-1" numberOfLines={1}>
                  {vendor.description}
                </Text>
              )}

              {vendor.workingHours && (
                <View className="flex-row items-center mt-1">
                  <Icon name="schedule" size={14} color="#6B7280" />
                  <Text className="text-sm text-gray-600 ml-1">
                    {formatWorkingHours()}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Quick Actions */}
          <View className="flex-row items-center mt-3">
            {vendor.type === 'product' && (
              <TouchableOpacity
                className="flex-row items-center px-4 py-2 rounded-lg mr-2"
                style={{ backgroundColor: '#FF6100' }}
                onPress={onCartPress}
                activeOpacity={0.7}
              >
                <Icon name="shopping-cart" size={16} color="#FFFFFF" />
                <Text className="text-sm font-medium text-white ml-1">
                  Add to Cart
                </Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity
              className="flex-row items-center px-4 py-2 rounded-lg border border-gray-300"
              onPress={onCallPress}
              activeOpacity={0.7}
            >
              <Icon name="phone" size={16} color="#6B7280" />
              <Text className="text-sm font-medium text-gray-700 ml-1">
                Call
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Available Services Preview */}
      {vendor.services.length > 0 && (
        <View className="px-4 pb-3">
          <View className="flex-row flex-wrap">
            {vendor.services.slice(0, 3).map((service, index) => (
              <View
                key={service.id}
                className="bg-gray-50 rounded-full px-3 py-1 mr-2 mb-2"
              >
                <Text className="text-xs text-gray-700">
                  {service.name} • ₹{service.price}/{service.unit}
                </Text>
              </View>
            ))}
            {vendor.services.length > 3 && (
              <View className="bg-orange-50 rounded-full px-3 py-1">
                <Text className="text-xs" style={{ color: '#FF6100' }}>
                  +{vendor.services.length - 3} more
                </Text>
              </View>
            )}
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default VendorListItem;
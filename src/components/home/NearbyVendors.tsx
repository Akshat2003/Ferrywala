// src/components/home/NearbyVendors.tsx
import React from 'react';
import {
  FlatList,
  View,
  Text,
} from 'react-native';
import VendorCard from './VendorCard';
import { Vendor } from '../../types/vendor.types';

interface NearbyVendorsProps {
  vendors: Vendor[];
  onVendorPress: (vendorId: string) => void;
  hasLocation: boolean;
}

const NearbyVendors: React.FC<NearbyVendorsProps> = ({
  vendors,
  onVendorPress,
  hasLocation,
}) => {
  if (!hasLocation) {
    return (
      <View className="items-center py-8 px-6">
        <Text className="text-5xl mb-4">📍</Text>
        <Text className="text-base font-medium text-gray-900 text-center">
          Enable location to see nearby vendors
        </Text>
      </View>
    );
  }

  if (vendors.length === 0) {
    return (
      <View className="items-center py-8 px-6">
        <Text className="text-5xl mb-4">🔍</Text>
        <Text className="text-base font-medium text-gray-900 text-center">
          No vendors found nearby
        </Text>
        <Text className="text-sm text-gray-600 text-center mt-1">
          Try adjusting your filters or search radius
        </Text>
      </View>
    );
  }

  const renderVendor = ({ item }: { item: Vendor }) => (
    <VendorCard
      vendor={item}
      onPress={() => onVendorPress(item.id)}
    />
  );

  return (
    <FlatList
      data={vendors}
      renderItem={renderVendor}
      keyExtractor={(item) => item.id}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 20 }}
      ItemSeparatorComponent={() => <View className="w-4" />}
    />
  );
};

export default NearbyVendors;
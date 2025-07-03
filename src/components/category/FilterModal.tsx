// src/components/category/FilterModal.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  Switch,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Slider from '@react-native-community/slider';

export interface FilterOptions {
  maxDistance: number;
  minRating: number;
  availableOnly: boolean;
  verifiedOnly: boolean;
  priceRange: {
    min: number;
    max: number;
  };
}

interface FilterModalProps {
  visible: boolean;
  currentFilters: FilterOptions;
  onApplyFilters: (filters: FilterOptions) => void;
  onClose: () => void;
  vendorType: 'product' | 'service';
}

const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  currentFilters,
  onApplyFilters,
  onClose,
  vendorType,
}) => {
  const [filters, setFilters] = useState<FilterOptions>(currentFilters);

  const handleReset = () => {
    const defaultFilters: FilterOptions = {
      maxDistance: 5,
      minRating: 0,
      availableOnly: false,
      verifiedOnly: false,
      priceRange: {
        min: 0,
        max: 5000,
      },
    };
    setFilters(defaultFilters);
  };

  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50">
        <View className="flex-1" />
        
        <View className="bg-white rounded-t-3xl max-h-[80%]">
          {/* Header */}
          <View className="flex-row items-center justify-between px-5 py-4 border-b border-gray-100">
            <Text className="text-xl font-semibold text-gray-900">
              Filters
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView className="px-5 py-4">
            {/* Distance Filter */}
            <View className="mb-6">
              <Text className="text-base font-medium text-gray-900 mb-3">
                Maximum Distance
              </Text>
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-sm text-gray-600">0 km</Text>
                <Text className="text-base font-semibold" style={{ color: '#FF6100' }}>
                  {filters.maxDistance} km
                </Text>
                <Text className="text-sm text-gray-600">10 km</Text>
              </View>
              <Slider
                value={filters.maxDistance}
                onValueChange={(value) =>
                  setFilters({ ...filters, maxDistance: Math.round(value) })
                }
                minimumValue={0}
                maximumValue={10}
                step={1}
                minimumTrackTintColor="#FF6100"
                maximumTrackTintColor="#E5E7EB"
                thumbTintColor="#FF6100"
              />
            </View>

            {/* Rating Filter */}
            <View className="mb-6">
              <Text className="text-base font-medium text-gray-900 mb-3">
                Minimum Rating
              </Text>
              <View className="flex-row justify-between">
                {[0, 3, 3.5, 4, 4.5].map((rating) => (
                  <TouchableOpacity
                    key={rating}
                    className={`px-4 py-2 rounded-lg border ${
                      filters.minRating === rating
                        ? 'border-orange-500'
                        : 'border-gray-300'
                    }`}
                    style={
                      filters.minRating === rating
                        ? { backgroundColor: '#FFF5F0' }
                        : { backgroundColor: '#FFFFFF' }
                    }
                    onPress={() => setFilters({ ...filters, minRating: rating })}
                  >
                    <Text
                      className={`text-sm font-medium ${
                        filters.minRating === rating
                          ? 'text-orange-600'
                          : 'text-gray-700'
                      }`}
                    >
                      {rating === 0 ? 'Any' : `${rating}+`}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Price Range (for products) */}
            {vendorType === 'product' && (
              <View className="mb-6">
                <Text className="text-base font-medium text-gray-900 mb-3">
                  Price Range
                </Text>
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-sm text-gray-600">₹0</Text>
                  <Text className="text-base font-semibold" style={{ color: '#FF6100' }}>
                    ₹{filters.priceRange.min} - ₹{filters.priceRange.max}
                  </Text>
                  <Text className="text-sm text-gray-600">₹5000</Text>
                </View>
                <View className="flex-row items-center">
                  <Slider
                    className="flex-1 mr-2"
                    value={filters.priceRange.min}
                    onValueChange={(value) =>
                      setFilters({
                        ...filters,
                        priceRange: {
                          ...filters.priceRange,
                          min: Math.round(value),
                        },
                      })
                    }
                    minimumValue={0}
                    maximumValue={filters.priceRange.max - 100}
                    step={50}
                    minimumTrackTintColor="#FF6100"
                    maximumTrackTintColor="#E5E7EB"
                    thumbTintColor="#FF6100"
                  />
                  <Slider
                    className="flex-1 ml-2"
                    value={filters.priceRange.max}
                    onValueChange={(value) =>
                      setFilters({
                        ...filters,
                        priceRange: {
                          ...filters.priceRange,
                          max: Math.round(value),
                        },
                      })
                    }
                    minimumValue={filters.priceRange.min + 100}
                    maximumValue={5000}
                    step={50}
                    minimumTrackTintColor="#FF6100"
                    maximumTrackTintColor="#E5E7EB"
                    thumbTintColor="#FF6100"
                  />
                </View>
              </View>
            )}

            {/* Toggle Filters */}
            <View className="mb-6">
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-base font-medium text-gray-900">
                  Available Now Only
                </Text>
                <Switch
                  value={filters.availableOnly}
                  onValueChange={(value) =>
                    setFilters({ ...filters, availableOnly: value })
                  }
                  trackColor={{ false: '#E5E7EB', true: '#FFB380' }}
                  thumbColor={filters.availableOnly ? '#FF6100' : '#FFFFFF'}
                />
              </View>

              <View className="flex-row items-center justify-between">
                <Text className="text-base font-medium text-gray-900">
                  Verified Vendors Only
                </Text>
                <Switch
                  value={filters.verifiedOnly}
                  onValueChange={(value) =>
                    setFilters({ ...filters, verifiedOnly: value })
                  }
                  trackColor={{ false: '#E5E7EB', true: '#FFB380' }}
                  thumbColor={filters.verifiedOnly ? '#FF6100' : '#FFFFFF'}
                />
              </View>
            </View>
          </ScrollView>

          {/* Footer Buttons */}
          <View className="flex-row px-5 py-4 border-t border-gray-100">
            <TouchableOpacity
              className="flex-1 mr-2 py-3 rounded-lg border border-gray-300"
              onPress={handleReset}
            >
              <Text className="text-center text-base font-medium text-gray-700">
                Reset
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 ml-2 py-3 rounded-lg"
              style={{ backgroundColor: '#FF6100' }}
              onPress={handleApply}
            >
              <Text className="text-center text-base font-medium text-white">
                Apply Filters
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default FilterModal;
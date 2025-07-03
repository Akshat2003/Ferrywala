// src/components/category/SortOptions.tsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export type SortOption = 'distance' | 'rating' | 'price_low' | 'price_high' | 'popularity';

interface SortOptionsProps {
  visible: boolean;
  currentSort: SortOption;
  onSelectSort: (sort: SortOption) => void;
  onClose: () => void;
}

const sortOptions = [
  { id: 'distance', label: 'Nearest First', icon: 'near-me' },
  { id: 'rating', label: 'Highest Rated', icon: 'star' },
  { id: 'price_low', label: 'Price: Low to High', icon: 'arrow-upward' },
  { id: 'price_high', label: 'Price: High to Low', icon: 'arrow-downward' },
  { id: 'popularity', label: 'Most Popular', icon: 'trending-up' },
];

const SortOptions: React.FC<SortOptionsProps> = ({
  visible,
  currentSort,
  onSelectSort,
  onClose,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        className="flex-1 bg-black/50"
        activeOpacity={1}
        onPress={onClose}
      >
        <View className="flex-1" />
        
        <View className="bg-white rounded-t-3xl">
          <View className="items-center py-2">
            <View className="w-12 h-1 bg-gray-300 rounded-full" />
          </View>
          
          <View className="px-5 pb-2">
            <Text className="text-lg font-semibold text-gray-900">
              Sort by
            </Text>
          </View>

          <View className="px-5 pb-6">
            {sortOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                className="flex-row items-center py-4 border-b border-gray-100"
                onPress={() => {
                  onSelectSort(option.id as SortOption);
                  onClose();
                }}
                activeOpacity={0.7}
              >
                <Icon
                  name={option.icon}
                  size={24}
                  color={currentSort === option.id ? '#FF6100' : '#6B7280'}
                />
                <Text
                  className={`flex-1 ml-3 text-base ${
                    currentSort === option.id
                      ? 'font-semibold'
                      : 'font-normal'
                  }`}
                  style={{
                    color: currentSort === option.id ? '#FF6100' : '#374151',
                  }}
                >
                  {option.label}
                </Text>
                {currentSort === option.id && (
                  <Icon name="check" size={24} color="#FF6100" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default SortOptions;
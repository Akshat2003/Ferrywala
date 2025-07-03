// src/components/home/QuickFilters.tsx
import React from 'react';
import {
  ScrollView,
  TouchableOpacity,
  Text,
  View,
} from 'react-native';

interface QuickFiltersProps {
  selectedFilter: string | null;
  onFilterSelect: (filter: string | null) => void;
}

const FILTERS = [
  { id: 'nearby', label: 'Nearby', icon: '📍' },
  { id: 'top-rated', label: 'Top Rated', icon: '⭐' },
  { id: 'available', label: 'Available Now', icon: '🟢' },
  { id: 'verified', label: 'Verified', icon: '✓' },
];

const QuickFilters: React.FC<QuickFiltersProps> = ({
  selectedFilter,
  onFilterSelect,
}) => {
  const handleFilterPress = (filterId: string) => {
    onFilterSelect(selectedFilter === filterId ? null : filterId);
  };

  return (
    <View className="mb-5">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20 }}
      >
        {FILTERS.map((filter) => (
          <TouchableOpacity
            key={filter.id}
            className={`flex-row items-center px-4 py-2 mr-2 rounded-full border ${
              selectedFilter === filter.id
                ? 'border-transparent'
                : 'bg-white border-gray-200'
            }`}
            style={selectedFilter === filter.id ? { backgroundColor: '#FF6100' } : {}}
            onPress={() => handleFilterPress(filter.id)}
            activeOpacity={0.7}
          >
            <Text
              className={`mr-1 text-sm ${
                selectedFilter === filter.id ? 'text-white' : 'text-gray-600'
              }`}
            >
              {filter.icon}
            </Text>
            <Text
              className={`text-sm font-medium ${
                selectedFilter === filter.id ? 'text-white' : 'text-gray-600'
              }`}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default QuickFilters;
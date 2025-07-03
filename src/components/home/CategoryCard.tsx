// src/components/home/CategoryCard.tsx
import React from 'react';
import {
  TouchableOpacity,
  Text,
  View,
} from 'react-native';
import { Category } from '../../types/category.types';

interface CategoryCardProps {
  category: Category;
  onPress: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, onPress }) => {
  const bgColorClass = {
    fruitwala: 'bg-red-50',
    sabjiwala: 'bg-green-50',
    atalewala: 'bg-emerald-50',
    sugarcane: 'bg-lime-50',
    mochi: 'bg-amber-50',
    chainrepair: 'bg-orange-50',
    gasrepair: 'bg-red-50',
    welding: 'bg-yellow-50',
    paan: 'bg-green-50',
    gardener: 'bg-lime-50',
    watchman: 'bg-blue-50',
    driver: 'bg-amber-50',
  }[category.id] || 'bg-gray-50';

  return (
    <TouchableOpacity
      className="items-center mb-5 w-[23%]"
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View className={`w-16 h-16 rounded-2xl justify-center items-center mb-2 ${bgColorClass} shadow-sm`}>
        <Text className="text-3xl">{category.icon}</Text>
      </View>
      <Text className="text-xs font-medium text-gray-900 text-center" numberOfLines={2}>
        {category.name}
      </Text>
    </TouchableOpacity>
  );
};

export default CategoryCard;
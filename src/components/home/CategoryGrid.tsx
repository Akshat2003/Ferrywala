// src/components/home/CategoryGrid.tsx
import React from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
} from 'react-native';
import CategoryCard from './CategoryCard';
import { CATEGORIES } from '../../constants/categories';

interface CategoryGridProps {
  onCategoryPress: (categoryId: string) => void;
}

const CategoryGrid: React.FC<CategoryGridProps> = ({ onCategoryPress }) => {
  // Show only featured categories on home screen
  const featuredCategories = CATEGORIES.filter(cat => 
    ['fruitwala', 'sabjiwala', 'mochi', 'gasrepair', 'sugarcane', 'chainrepair', 'atalewala', 'paan'].includes(cat.id)
  );
  
  const renderCategory = ({ item }: { item: typeof CATEGORIES[0] }) => (
    <CategoryCard
      category={item}
      onPress={() => onCategoryPress(item.id)}
    />
  );

  return (
    <View>
      <FlatList
        data={featuredCategories}
        renderItem={renderCategory}
        keyExtractor={(item) => item.id}
        numColumns={4}
        scrollEnabled={false}
        contentContainerStyle={{ paddingHorizontal: 20 }}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
      />
      <TouchableOpacity 
        className="mt-2 mb-4 mx-5"
        onPress={() => onCategoryPress('all')}
      >
        <Text className="text-center text-sm font-medium" style={{ color: '#FF6100' }}>
          View All Categories →
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default CategoryGrid;
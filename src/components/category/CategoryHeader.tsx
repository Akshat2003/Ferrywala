// src/components/category/CategoryHeader.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { CATEGORIES } from '../../constants/categories';
import { Category } from '../../types/category.types';

interface CategoryHeaderProps {
  categoryId: string;
  categoryName: string;
  categoryIcon: string;
  vendorCount: number;
  onFilterPress: () => void;
  onSortPress: () => void;
  onCategoryChange: (categoryId: string, categoryName: string) => void;
  hasActiveFilters: boolean;
}

const CategoryHeader: React.FC<CategoryHeaderProps> = ({
  categoryId,
  categoryName,
  categoryIcon,
  vendorCount,
  onFilterPress,
  onSortPress,
  onCategoryChange,
  hasActiveFilters,
}) => {
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [loadedCategories, setLoadedCategories] = useState<Category[]>([]);

  useEffect(() => {
    // Load categories from the constants file
    console.log('Loading categories from constants:', CATEGORIES);
    setLoadedCategories(CATEGORIES || []);
  }, []);

  // Define "All Categories" option
  const allCategoriesOption: Category = {
    id: 'all',
    name: 'All Categories',
    icon: '📦',
    type: 'product',
  };

  // Combine all categories with the "All" option
  const categoryOptions = [allCategoriesOption, ...loadedCategories];

  console.log('Final category options:', categoryOptions);

  const handleCategorySelect = (category: Category) => {
    setShowCategoryDropdown(false);
    onCategoryChange(category.id, category.name);
  };

  const renderCategoryOption = ({ item, index }: { item: Category; index: number }) => {
    console.log(`Rendering category ${index}:`, item);
    
    // Get vendor count for this category (mock data for demo)
    const getVendorCountForCategory = (catId: string): number => {
      const mockCounts: { [key: string]: number } = {
        'all': 20,
        'fruitwala': 5,
        'sabjiwala': 4,
        'gardener': 3,
        'watchman': 2,
        'driver': 2,
        'gasrepair': 1,
        'chainrepair': 2,
        'paan': 1,
        'atalewala': 0,
        'sugarcane': 0,
        'mochi': 0,
        'welding': 0,
      };
      return mockCounts[catId] || 0;
    };

    const vendorCount = getVendorCountForCategory(item.id);
    const isSelected = item.id === categoryId;

    return (
      <TouchableOpacity
        className={`flex-row items-center px-5 py-4 ${
          isSelected ? 'bg-orange-50' : 'bg-white'
        }`}
        onPress={() => handleCategorySelect(item)}
        activeOpacity={0.7}
        style={{
          borderBottomWidth: index < categoryOptions.length - 1 ? 1 : 0,
          borderBottomColor: '#F3F4F6',
        }}
      >
        <View 
          className={`w-12 h-12 rounded-xl justify-center items-center mr-4 ${
            isSelected ? 'bg-orange-100' : 'bg-gray-50'
          }`}
        >
          <Text className="text-2xl">{item.icon}</Text>
        </View>
        <View className="flex-1">
          <Text 
            className={`text-lg font-semibold ${
              isSelected ? 'text-orange-600' : 'text-gray-900'
            }`}
            numberOfLines={1}
          >
            {item.name}
          </Text>
          <Text className="text-sm text-gray-500 mt-0.5">
            {vendorCount} {vendorCount === 1 ? 'vendor' : 'vendors'} • {item.type}
          </Text>
        </View>
        {isSelected && (
          <View className="ml-2">
            <Icon name="check-circle" size={24} color="#FF6100" />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View className="bg-white border-b border-gray-100">
      <View className="px-5 py-4">
        {/* Category Dropdown Header */}
        <TouchableOpacity
          className="flex-row items-center justify-between mb-3"
          onPress={() => setShowCategoryDropdown(true)}
          activeOpacity={0.7}
        >
          <View className="flex-row items-center flex-1">
            <View className="w-12 h-12 rounded-xl bg-orange-50 justify-center items-center mr-3">
              <Text className="text-2xl">{categoryIcon}</Text>
            </View>
            <View className="flex-1">
              <Text className="text-lg font-semibold text-gray-900">
                {categoryName}
              </Text>
              <Text className="text-sm text-gray-600">
                {vendorCount} {vendorCount === 1 ? 'vendor' : 'vendors'} available
              </Text>
            </View>
          </View>
          <Icon name="keyboard-arrow-down" size={24} color="#6B7280" />
        </TouchableOpacity>

        {/* Filter and Sort Buttons */}
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            className="flex-row items-center flex-1 mr-2 bg-gray-50 rounded-lg px-4 py-2.5"
            onPress={onFilterPress}
            activeOpacity={0.7}
          >
            <Icon name="filter-list" size={20} color="#6B7280" />
            <Text className="ml-2 text-sm font-medium text-gray-700">
              Filter
            </Text>
            {hasActiveFilters && (
              <View className="ml-2 bg-orange-500 w-2 h-2 rounded-full" />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center flex-1 ml-2 bg-gray-50 rounded-lg px-4 py-2.5"
            onPress={onSortPress}
            activeOpacity={0.7}
          >
            <Icon name="sort" size={20} color="#6B7280" />
            <Text className="ml-2 text-sm font-medium text-gray-700">
              Sort
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Category Dropdown Modal */}
      <Modal
        visible={showCategoryDropdown}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCategoryDropdown(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl" style={{ maxHeight: '80%' }}>
            {/* Modal Header */}
            <View className="flex-row items-center justify-between px-5 py-4 border-b border-gray-100">
              <Text className="text-xl font-semibold text-gray-900">
                Select Category
              </Text>
              <TouchableOpacity onPress={() => setShowCategoryDropdown(false)}>
                <Icon name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {/* Debug info */}
            <View className="px-5 py-2 bg-gray-50">
              <Text className="text-xs text-gray-600">
                Found {categoryOptions.length} categories
              </Text>
            </View>

            {/* Categories List */}
            {categoryOptions.length > 0 ? (
              <FlatList
                data={categoryOptions}
                renderItem={renderCategoryOption}
                keyExtractor={(item, index) => `${item.id}-${index}`}
                showsVerticalScrollIndicator={true}
                style={{ maxHeight: 400 }}
                contentContainerStyle={{ paddingBottom: 20 }}
                ItemSeparatorComponent={null}
                nestedScrollEnabled={true}
                initialNumToRender={10}
                maxToRenderPerBatch={10}
                windowSize={10}
              />
            ) : (
              <View className="px-5 py-8 items-center">
                <Text className="text-gray-500">No categories available</Text>
                <Text className="text-xs text-gray-400 mt-2">
                  CATEGORIES length: {CATEGORIES?.length || 0}
                </Text>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CategoryHeader;
// src/components/common/SearchBar.tsx
import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Platform,
} from 'react-native';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: (text: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  onSubmit,
  placeholder = 'Search...',
}) => {
  return (
    <View className="flex-row items-center bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-100">
      <Text className="text-gray-500 mr-2">🔍</Text>
      <TextInput
        className="flex-1 text-base text-gray-900"
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={() => onSubmit(value)}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        returnKeyType="search"
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={() => onChangeText('')}>
          <Text className="text-gray-500 text-lg">✕</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SearchBar;
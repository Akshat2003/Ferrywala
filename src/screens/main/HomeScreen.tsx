// src/screens/main/HomeScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  Image,
  View,
  ScrollView,
  RefreshControl,
  Text,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Import components
import SearchBar from '../../components/common/SearchBar';
import CategoryGrid from '../../components/home/CategoryGrid';
import NearbyVendors from '../../components/home/NearbyVendors';
import LocationPermissionCard from '../../components/home/LocationPermissionCard';
import QuickFilters from '../../components/home/QuickFilters';
import LoadingSpinner from '../../components/common/LoadingSpinner';

// Import hooks and utilities
import { useLocation } from '../../hooks/useLocation';
import { useNearbyVendors } from '../../hooks/useNearbyVendors';
import { reverseGeocode } from '../../utils/location.utils';

// Import types and constants
import { RootStackParamList } from '../../navigation/types';
import { CATEGORIES } from '../../constants/categories';
import { Category } from '../../types/category.types';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen: React.FC = () => {
  const [showSearchBar, setShowSearchBar] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [userName, setUserName] = useState(''); // Will be fetched from user profile
  const [currentAddress, setCurrentAddress] = useState('');
  const [isGeocodingLoading, setIsGeocodingLoading] = useState(false);

  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { location, hasPermission, requestPermission, loading: locationLoading } = useLocation();
  const { vendors, loading: vendorsLoading, refetch } = useNearbyVendors(location, selectedFilter);

  // Reverse geocode when location changes
  useEffect(() => {
    const getAddressFromLocation = async () => {
      if (location && !isGeocodingLoading) {
        setIsGeocodingLoading(true);
        try {
          console.log('Getting address for:', location.latitude, location.longitude);
          const address = await reverseGeocode(location.latitude, location.longitude);
          console.log('Received address:', address);
          
          if (address && address.length > 10) { // Ensure we got a meaningful address
            setCurrentAddress(address);
          } else {
            // Enhanced fallback - try to get a more descriptive location
            const lat = location.latitude.toFixed(4);
            const lng = location.longitude.toFixed(4);
            
            // For Indore area, provide some context
            if (location.latitude >= 22.6 && location.latitude <= 22.8 && 
                location.longitude >= 75.8 && location.longitude <= 76.0) {
              setCurrentAddress(`${lat}, ${lng} • Near Indore City, MP`);
            } else {
              setCurrentAddress(`${lat}, ${lng} • Madhya Pradesh, India`);
            }
          }
        } catch (error) {
          console.error('Geocoding error:', error);
          // Fallback to coordinates with context
          const lat = location.latitude.toFixed(4);
          const lng = location.longitude.toFixed(4);
          setCurrentAddress(`${lat}, ${lng} • Current Location`);
        } finally {
          setIsGeocodingLoading(false);
        }
      }
    };

    // Add a small delay to avoid rapid API calls
    const timer = setTimeout(getAddressFromLocation, 500);
    return () => clearTimeout(timer);
  }, [location]);

  const getLocationDisplay = () => {
    if (!location) return 'Getting your location...';
    if (isGeocodingLoading) return 'Finding your address...';
    return currentAddress || 'Location detected';
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Navigate to search screen when implemented
    navigation.navigate('Search', { query });
  };

  const handleCategoryPress = (categoryId: string) => {
    if (categoryId === 'all') {
      // Navigate to all categories view - for now, we'll use the first category as a placeholder
      navigation.navigate('CategoryListing', {
        categoryId: 'all',
        categoryName: 'All Categories',
      });
      return;
    }

    const category = CATEGORIES.find((cat: Category) => cat.id === categoryId);
    if (category) {
      navigation.navigate('CategoryListing', {
        categoryId: categoryId,
        categoryName: category.name,
      });
    }
  };

  const handleVendorPress = (vendorId: string) => {
    navigation.navigate('VendorDetail', { vendorId });
  };

  const handleFilterSelect = (filter: string | null) => {
    setSelectedFilter(filter);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#FF6100']}
            tintColor="#FF6100"
          />
        }
      >
        {/* Header Section */}
        <View className="px-5 pt-5 pb-4">
          <View className="flex-row justify-between items-center mb-3">
            <View className="flex-1">
              <Text className="text-2xl font-bold text-gray-900">
                Hi {userName || 'there'}! 👋
              </Text>
              <Text className="text-base text-gray-600 mt-1">
                How your locals can help you today?
              </Text>
            </View>
            <View className="flex-row">
              <TouchableOpacity 
                className="w-12 h-12 rounded-full bg-gray-100 items-center justify-center mr-2"
                onPress={() => setShowSearchBar(!showSearchBar)}
              >
                <Text className="text-xl">🔍</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                className="w-12 h-12 rounded-full bg-orange-100 items-center justify-center"
                onPress={() => navigation.navigate('Profile')}
              >
                <Text className="text-2xl">👤</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Location Bar - Show only when we have permission */}
          {hasPermission && (
            <TouchableOpacity className="flex-row items-center bg-white rounded-lg p-3 shadow-sm">
              <Text className="text-blue-500 text-lg mr-2">📍</Text>
              <View className="flex-1">
                <Text className="text-xs text-gray-500">Current Location</Text>
                <Text className="text-sm text-gray-900 font-medium" numberOfLines={1}>
                  {getLocationDisplay()}
                </Text>
              </View>
              {isGeocodingLoading ? (
                <View className="w-4 h-4">
                  <Text className="text-xs text-gray-400 animate-pulse">⟳</Text>
                </View>
              ) : (
                <Text className="text-gray-400">▼</Text>
              )}
            </TouchableOpacity>
          )}

          {/* Location Permission Card - Show when no permission */}
          {!hasPermission && !locationLoading && (
            <View className="mt-3">
              <LocationPermissionCard onRequestPermission={requestPermission} />
            </View>
          )}
        </View>

        {/* Search Bar - Conditionally Rendered */}
        {showSearchBar && (
          <View className="px-5 mb-4">
            <SearchBar
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmit={handleSearch}
              placeholder="Search for vendors, services..."
            />
          </View>
        )}

        {/* Hero Banner */}
        <View className="px-5 mb-4">
          <View style={{ borderRadius: 16, overflow: 'hidden' }}>
            <Image
              source={{
                uri:
                  'https://res.cloudinary.com/dwroh4zkk/image/upload/v1751108490/ferrywala_banner_cx58qh.png',
              }}
              resizeMode="contain"
              style={{ width: '100%', height: 160 }}
            />
          </View>
        </View>

        {/* Quick Filters */}
        <QuickFilters
          selectedFilter={selectedFilter}
          onFilterSelect={handleFilterSelect}
        />

        {/* Categories Grid */}
        <View className="pb-6">
          <Text className="text-lg font-semibold text-gray-900 px-5 mb-4">
            Categories
          </Text>
          <CategoryGrid onCategoryPress={handleCategoryPress} />
        </View>

        {/* Nearby Vendors */}
        <View className="pb-6">
          <View className="flex-row justify-between items-center px-5 mb-4">
            <Text className="text-lg font-semibold text-gray-900">
              Nearby Vendors
            </Text>
            {location && (
              <Text className="text-sm text-gray-600">
                {vendors.length} vendors found
              </Text>
            )}
          </View>

          {locationLoading || vendorsLoading ? (
            <LoadingSpinner />
          ) : (
            <NearbyVendors
              vendors={vendors}
              onVendorPress={handleVendorPress}
              hasLocation={hasPermission}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
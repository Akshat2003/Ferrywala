// src/screens/main/CategoryListingScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  RefreshControl,
  StatusBar,
  Linking,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  RouteProp,
  useRoute,
  useNavigation,
} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';

// Components
import BackHeader from '../../components/layout/BackHeader';
import CategoryHeader from '../../components/category/CategoryHeader';
import VendorListItem from '../../components/category/VendorListItem';
import FilterModal, { FilterOptions } from '../../components/category/FilterModal';
import SortOptions, { SortOption } from '../../components/category/SortOptions';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import EmptyState from '../../components/common/EmptyState';

// Hooks & Services
import { useLocation } from '../../hooks/useLocation';
import vendorService from '../../services/vendor.service';
import { Vendor } from '../../types/vendor.types';
import { CATEGORIES } from '../../constants/categories';

type CategoryListingRouteProp = RouteProp<RootStackParamList, 'CategoryListing'>;
type CategoryListingNavProp = NativeStackNavigationProp<RootStackParamList, 'CategoryListing'>;

const CategoryListingScreen: React.FC = () => {
  const route = useRoute<CategoryListingRouteProp>();
  const navigation = useNavigation<CategoryListingNavProp>();
  const initialCategoryId = route.params.categoryId;
  const initialCategoryName = route.params.categoryName;

  // States
  const [currentCategoryId, setCurrentCategoryId] = useState(initialCategoryId);
  const [currentCategoryName, setCurrentCategoryName] = useState(initialCategoryName);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);
  const [currentSort, setCurrentSort] = useState<SortOption>('distance');
  const [filters, setFilters] = useState<FilterOptions>({
    maxDistance: 5,
    minRating: 0,
    availableOnly: false,
    verifiedOnly: false,
    priceRange: {
      min: 0,
      max: 5000,
    },
  });

  // Hooks
  const { location } = useLocation();

  // Get current category meta
  const getCurrentCategory = () => {
    if (currentCategoryId === 'all') {
      return {
        icon: '📦',
        type: 'product' as const,
      };
    }
    const category = CATEGORIES.find(cat => cat.id === currentCategoryId);
    return {
      icon: category?.icon || '📦',
      type: category?.type || 'product' as const,
    };
  };

  const { icon: categoryIcon, type: categoryType } = getCurrentCategory();

  const hasActiveFilters =
    filters.maxDistance !== 5 ||
    filters.minRating !== 0 ||
    filters.availableOnly ||
    filters.verifiedOnly ||
    filters.priceRange.min !== 0 ||
    filters.priceRange.max !== 5000;

  // Fetch vendors
  const fetchVendors = async (showLoader = true) => {
    if (showLoader) setLoading(true);
    setError(null);
    try {
      const result = await vendorService.getVendorsByCategory({
        category: currentCategoryId,
        filters,
        sort: currentSort,
        userLocation: location || undefined,
      });
      setVendors(result);
    } catch (err) {
      console.error('Error fetching vendors:', err);
      setError('Failed to load vendors. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, [currentCategoryId, filters, currentSort, location]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchVendors(false);
  };

  const handleCategoryChange = (categoryId: string, categoryName: string) => {
    setCurrentCategoryId(categoryId);
    setCurrentCategoryName(categoryName);
    
    // Reset filters when changing category to avoid confusion
    setFilters({
      maxDistance: 5,
      minRating: 0,
      availableOnly: false,
      verifiedOnly: false,
      priceRange: {
        min: 0,
        max: 5000,
      },
    });
    
    // Reset sort to default
    setCurrentSort('distance');
  };

  const handleVendorPress = (vendor: Vendor) => {
    navigation.navigate('VendorDetail', { vendorId: vendor.id });
  };

  const handleCallPress = (vendor: Vendor) => {
    if (!vendor.contactNumber) return;
    Alert.alert(
      `Call ${vendor.name}`,
      `Do you want to call ${vendor.contactNumber}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call', onPress: () => Linking.openURL(`tel:${vendor.contactNumber}`) },
      ]
    );
  };

  const handleCartPress = (vendor: Vendor) => {
    Alert.alert('Added to Cart', `${vendor.name} has been added to your cart.`);
  };

  const handleApplyFilters = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    setShowFilterModal(false);
  };

  const handleSortSelect = (sort: SortOption) => {
    setCurrentSort(sort);
    setShowSortModal(false);
  };

  const renderVendor = ({ item }: { item: Vendor }) => (
    <VendorListItem
      vendor={item}
      onPress={() => handleVendorPress(item)}
      onCallPress={() => handleCallPress(item)}
      onCartPress={() => handleCartPress(item)}
    />
  );

  const renderEmptyState = () => {
    if (hasActiveFilters) {
      return (
        <EmptyState
          icon="🔍"
          title="No vendors found"
          message="Try adjusting your filters to see more results"
          actionLabel="Clear Filters"
          onAction={() =>
            setFilters({
              maxDistance: 5,
              minRating: 0,
              availableOnly: false,
              verifiedOnly: false,
              priceRange: { min: 0, max: 5000 },
            })
          }
        />
      );
    }

    return (
      <EmptyState
        icon="📦"
        title={`No ${currentCategoryName} vendors nearby`}
        message="We couldn't find any vendors in your area. Try expanding your search radius or selecting a different category."
        actionLabel="Try All Categories"
        onAction={() => handleCategoryChange('all', 'All Categories')}
      />
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <BackHeader
        title={currentCategoryName}
        subtitle={location ? 'Near you' : 'All locations'}
        onBack={() => navigation.goBack()}
        rightIcon="search"
        onRightPress={() => navigation.navigate('Search', {})}
      />

      {!loading && !error && (
        <CategoryHeader
          categoryId={currentCategoryId}
          categoryName={currentCategoryName}
          categoryIcon={categoryIcon}
          vendorCount={vendors.length}
          onFilterPress={() => setShowFilterModal(true)}
          onSortPress={() => setShowSortModal(true)}
          onCategoryChange={handleCategoryChange}
          hasActiveFilters={hasActiveFilters}
        />
      )}

      {loading ? (
        <LoadingSpinner message="Loading vendors..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={() => fetchVendors()} />
      ) : (
        <FlatList
          data={vendors}
          renderItem={renderVendor}
          keyExtractor={item => item.id}
          contentContainerStyle={vendors.length === 0 ? { flex: 1 } : { paddingVertical: 8 }}
          ListEmptyComponent={renderEmptyState}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={['#FF6100']}
              tintColor="#FF6100"
            />
          }
        />
      )}

      <FilterModal
        visible={showFilterModal}
        currentFilters={filters}
        onApplyFilters={handleApplyFilters}
        onClose={() => setShowFilterModal(false)}
        vendorType={categoryType}
      />

      <SortOptions
        visible={showSortModal}
        currentSort={currentSort}
        onSelectSort={handleSortSelect}
        onClose={() => setShowSortModal(false)}
      />
    </SafeAreaView>
  );
};

export default CategoryListingScreen;
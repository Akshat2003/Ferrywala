// src/services/vendor.service.ts
import { Vendor } from '../types/vendor.types';
import { mockVendors } from '../data/mockVendors';
import { FilterOptions } from '../components/category/FilterModal';
import { SortOption } from '../components/category/SortOptions';
import { calculateDistance } from '../utils/location.utils';

interface GetVendorsParams {
  category?: string;
  filters?: FilterOptions;
  sort?: SortOption;
  userLocation?: { latitude: number; longitude: number };
}

// Mapping from actual vendor categories to our category system
const categoryMapping: { [key: string]: string } = {
  'fruits': 'fruitwala',
  'vegetables': 'sabjiwala',
  'gardener': 'gardener',
  'watchman': 'watchman',
  'driver': 'driver',
  'cleaning': 'gasrepair', // Mapping cleaning to gas repair for now
  'repairs': 'chainrepair',
  'snacks': 'paan',
};

// Reverse mapping for filtering
const reverseCategoryMapping: { [key: string]: string[] } = {
  'fruitwala': ['fruits'],
  'sabjiwala': ['vegetables'],
  'gardener': ['gardener'],
  'watchman': ['watchman'],
  'driver': ['driver'],
  'gasrepair': ['cleaning'],
  'chainrepair': ['repairs'],
  'paan': ['snacks'],
  'atalewala': [], // No direct mapping in mock data
  'sugarcane': [], // No direct mapping in mock data
  'mochi': [], // No direct mapping in mock data
  'welding': [], // No direct mapping in mock data
};

class VendorService {
  async getVendorsByCategory(params: GetVendorsParams): Promise<Vendor[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    let vendors = [...mockVendors];

    // Filter by category
    if (params.category && params.category !== 'all') {
      // Get the actual vendor categories that match our selected category
      const vendorCategories = reverseCategoryMapping[params.category] || [params.category];
      
      if (vendorCategories.length > 0) {
        vendors = vendors.filter(vendor => 
          vendorCategories.includes(vendor.category)
        );
      } else {
        // If no mapping exists, try direct match
        vendors = vendors.filter(vendor => vendor.category === params.category);
      }
    }

    // Calculate distances if user location is available
    if (params.userLocation) {
      vendors = vendors.map(vendor => ({
        ...vendor,
        distance: calculateDistance(
          params.userLocation!.latitude,
          params.userLocation!.longitude,
          vendor.location.latitude,
          vendor.location.longitude
        ),
      }));
    }

    // Apply filters
    if (params.filters) {
      const { maxDistance, minRating, availableOnly, verifiedOnly, priceRange } = params.filters;

      vendors = vendors.filter(vendor => {
        // Distance filter
        if (vendor.distance && vendor.distance > maxDistance) {
          return false;
        }

        // Rating filter
        if (vendor.rating < minRating) {
          return false;
        }

        // Availability filter
        if (availableOnly && !vendor.isAvailable) {
          return false;
        }

        // Verified filter
        if (verifiedOnly && !vendor.isVerified) {
          return false;
        }

        // Price range filter (check if any service is within range)
        if (priceRange && vendor.type === 'product') {
          const hasServiceInRange = vendor.services.some(
            service => service.price >= priceRange.min && service.price <= priceRange.max
          );
          if (!hasServiceInRange) {
            return false;
          }
        }

        return true;
      });
    }

    // Apply sorting
    if (params.sort) {
      switch (params.sort) {
        case 'distance':
          vendors.sort((a, b) => (a.distance || 0) - (b.distance || 0));
          break;
        case 'rating':
          vendors.sort((a, b) => b.rating - a.rating);
          break;
        case 'price_low':
          vendors.sort((a, b) => {
            const aMinPrice = Math.min(...a.services.map(s => s.price));
            const bMinPrice = Math.min(...b.services.map(s => s.price));
            return aMinPrice - bMinPrice;
          });
          break;
        case 'price_high':
          vendors.sort((a, b) => {
            const aMaxPrice = Math.max(...a.services.map(s => s.price));
            const bMaxPrice = Math.max(...b.services.map(s => s.price));
            return bMaxPrice - aMaxPrice;
          });
          break;
        case 'popularity':
          vendors.sort((a, b) => b.totalRatings - a.totalRatings);
          break;
      }
    }

    console.log(`Found ${vendors.length} vendors for category: ${params.category}`);
    return vendors;
  }

  async getVendorById(vendorId: string): Promise<Vendor | null> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    const vendor = mockVendors.find(v => v.id === vendorId);
    return vendor || null;
  }

  async searchVendors(query: string, userLocation?: { latitude: number; longitude: number }): Promise<Vendor[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));

    const searchTerm = query.toLowerCase();
    let vendors = mockVendors.filter(vendor => {
      // Search in vendor name
      if (vendor.name.toLowerCase().includes(searchTerm)) {
        return true;
      }

      // Search in category
      if (vendor.category.toLowerCase().includes(searchTerm)) {
        return true;
      }

      // Search in services
      if (vendor.services.some(service => service.name.toLowerCase().includes(searchTerm))) {
        return true;
      }

      // Search in description
      if (vendor.description?.toLowerCase().includes(searchTerm)) {
        return true;
      }

      return false;
    });

    // Calculate distances if user location is available
    if (userLocation) {
      vendors = vendors.map(vendor => ({
        ...vendor,
        distance: calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          vendor.location.latitude,
          vendor.location.longitude
        ),
      }));

      // Sort by distance by default
      vendors.sort((a, b) => (a.distance || 0) - (b.distance || 0));
    }

    return vendors;
  }

  // Helper method to get available categories with vendor counts
  async getCategoriesWithCounts(userLocation?: { latitude: number; longitude: number }): Promise<Array<{id: string, name: string, icon: string, count: number}>> {
    const allVendors = [...mockVendors];
    
    // Calculate distances if user location is available
    let vendors = allVendors;
    if (userLocation) {
      vendors = allVendors.map(vendor => ({
        ...vendor,
        distance: calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          vendor.location.latitude,
          vendor.location.longitude
        ),
      })).filter(vendor => vendor.distance! <= 10); // Within 10km
    }

    // Count vendors by category
    const categoryCounts: { [key: string]: number } = {};
    
    vendors.forEach(vendor => {
      const mappedCategory = categoryMapping[vendor.category] || vendor.category;
      categoryCounts[mappedCategory] = (categoryCounts[mappedCategory] || 0) + 1;
    });

    // Import categories to get names and icons
    const { CATEGORIES } = require('../constants/categories');
    
    return CATEGORIES.map((category: any) => ({
      id: category.id,
      name: category.name,
      icon: category.icon,
      count: categoryCounts[category.id] || 0,
    }));
  }
}

export default new VendorService();
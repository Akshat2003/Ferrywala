// src/hooks/useNearbyVendors.ts
import { useState, useEffect } from 'react';
import { Vendor, Location } from '../types/vendor.types';
import { mockVendors } from '../data/mockVendors';
import { calculateDistance } from '../utils/location.utils';

interface UseNearbyVendorsReturn {
  vendors: Vendor[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useNearbyVendors = (
  userLocation: Location | null,
  filter: string | null,
  radius: number = 5 // km
): UseNearbyVendorsReturn => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));

      let filteredVendors = [...mockVendors];

      // Calculate distances if user location is available
      if (userLocation) {
        filteredVendors = filteredVendors.map(vendor => ({
          ...vendor,
          distance: calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            vendor.location.latitude,
            vendor.location.longitude
          ),
        }));

        // Filter by radius
        filteredVendors = filteredVendors.filter(
          vendor => vendor.distance! <= radius
        );
      }

      // Apply filters
      if (filter) {
        switch (filter) {
          case 'nearby':
            filteredVendors.sort((a, b) => (a.distance || 0) - (b.distance || 0));
            break;
          case 'top-rated':
            filteredVendors = filteredVendors.filter(v => v.rating >= 4.0);
            filteredVendors.sort((a, b) => b.rating - a.rating);
            break;
          case 'available':
            filteredVendors = filteredVendors.filter(v => v.isAvailable);
            break;
          case 'verified':
            filteredVendors = filteredVendors.filter(v => v.isVerified);
            break;
        }
      } else {
        // Default: sort by distance
        filteredVendors.sort((a, b) => (a.distance || 0) - (b.distance || 0));
      }

      setVendors(filteredVendors);
    } catch (err) {
      console.error('Error fetching vendors:', err);
      setError('Failed to load vendors. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, [userLocation, filter]);

  return {
    vendors,
    loading,
    error,
    refetch: fetchVendors,
  };
};
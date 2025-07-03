// src/types/vendor.types.ts
export interface Location {
  latitude: number;
  longitude: number;
}

export interface Service {
  id: string;
  name: string;
  price: number;
  unit?: string;
  available: boolean;
}

export interface Vendor {
  id: string;
  name: string;
  type: VendorType;
  category: string;
  location: Location;
  distance?: number;
  rating: number;
  totalRatings: number;
  isAvailable: boolean;
  isVerified: boolean;
  services: Service[];
  profileImage: string;
  contactNumber: string;
  description?: string;
  workingHours?: {
    start: string;
    end: string;
  };
}

export type VendorType = 'product' | 'service';

export type ProductCategory = 'fruits' | 'vegetables' | 'snacks' | 'beverages';
export type ServiceCategory = 'gardener' | 'watchman' | 'driver' | 'cleaning' | 'repairs';

export interface VendorFilter {
  category?: string;
  type?: VendorType;
  minRating?: number;
  maxDistance?: number;
  isAvailable?: boolean;
}
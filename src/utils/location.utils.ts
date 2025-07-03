// src/utils/location.utils.ts

/**
 * Calculate distance between two points using Haversine formula
 * Returns distance in kilometers
 */
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
    Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance;
};

const toRad = (value: number): number => {
  return (value * Math.PI) / 180;
};

/**
 * Format distance for display
 */
export const formatDistance = (distance: number): string => {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`;
  }
  return `${distance.toFixed(1)}km`;
};

/**
 * Check if a location is within a geofence
 */
export const isWithinGeofence = (
  userLat: number,
  userLon: number,
  targetLat: number,
  targetLon: number,
  radiusKm: number
): boolean => {
  const distance = calculateDistance(userLat, userLon, targetLat, targetLon);
  return distance <= radiusKm;
};

/**
 * Reverse geocoding using free Nominatim API (OpenStreetMap)
 * Returns a formatted address string with street-level details
 */
export const reverseGeocode = async (
  latitude: number,
  longitude: number
): Promise<string | null> => {
  try {
    // Use zoom=18 for maximum detail and extratags for more address info
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1&zoom=18&extratags=1&accept-language=en`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'FerrywalaApp/1.0'
      }
    });
    
    if (!response.ok) {
      throw new Error('Geocoding API request failed');
    }
    
    const data = await response.json();
    console.log('Geocoding response:', JSON.stringify(data, null, 2)); // Debug log
    
    if (data && data.address) {
      const address = data.address;
      const components = [];
      
      // Prioritize street-level information
      let streetInfo = '';
      
      // Build street address with house number
      if (address.house_number && address.road) {
        streetInfo = `${address.house_number} ${address.road}`;
      } else if (address.road) {
        streetInfo = address.road;
      } else if (address.footway) {
        streetInfo = address.footway;
      } else if (address.path) {
        streetInfo = address.path;
      }
      
      if (streetInfo) {
        components.push(streetInfo);
      }
      
      // Add more specific locality information
      if (address.shop) {
        components.push(`near ${address.shop}`);
      } else if (address.building) {
        components.push(address.building);
      } else if (address.amenity) {
        components.push(`near ${address.amenity}`);
      }
      
      // Add neighbourhood/area (prioritize most specific)
      if (address.neighbourhood) {
        components.push(address.neighbourhood);
      } else if (address.quarter) {
        components.push(address.quarter);
      } else if (address.suburb) {
        components.push(address.suburb);
      } else if (address.residential) {
        components.push(address.residential);
      } else if (address.hamlet) {
        components.push(address.hamlet);
      }
      
      // Add city (use most specific available)
      if (address.city) {
        components.push(address.city);
      } else if (address.town) {
        components.push(address.town);
      } else if (address.municipality) {
        components.push(address.municipality);
      } else if (address.village) {
        components.push(address.village);
      }
      
      // If we have very few components, add the display_name's first part
      if (components.length <= 1 && data.display_name) {
        const displayParts = data.display_name.split(',');
        if (displayParts.length > 0) {
          const firstPart = displayParts[0].trim();
          if (firstPart && !components.includes(firstPart)) {
            components.unshift(firstPart);
          }
        }
      }
      
      if (components.length === 0) {
        // Fallback to any available address component
        const fallbackComponents = [
          address.road,
          address.neighbourhood,
          address.suburb,
          address.city,
          address.town,
          address.village
        ].filter(Boolean);
        
        if (fallbackComponents.length > 0) {
          components.push(...fallbackComponents.slice(0, 2));
        }
      }
      
      // Join components and format
      if (components.length > 0) {
        const formattedAddress = components.join(', ');
        return formattedAddress.length > 60 
          ? formattedAddress.substring(0, 57) + '...'
          : formattedAddress;
      }
    }
    
    // If all else fails, return null to trigger fallback
    return null;
  } catch (error) {
    console.error('Reverse geocoding failed:', error);
    return null;
  }
};

/**
 * Alternative geocoding using LocationIQ (free tier: 5000 requests/day)
 * More reliable for Indian addresses
 */
export const reverseGeocodeLocationIQ = async (
  latitude: number,
  longitude: number,
  apiKey: string = 'your_locationiq_api_key'
): Promise<string | null> => {
  try {
    const url = `https://us1.locationiq.com/v1/reverse.php?key=${apiKey}&lat=${latitude}&lon=${longitude}&format=json&addressdetails=1&normalizeaddress=1`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data && data.address) {
      const address = data.address;
      const components = [];
      
      // Build detailed street address
      if (address.house_number && address.road) {
        components.push(`${address.house_number} ${address.road}`);
      } else if (address.road) {
        components.push(address.road);
      }
      
      if (address.neighbourhood) {
        components.push(address.neighbourhood);
      } else if (address.suburb) {
        components.push(address.suburb);
      }
      
      if (address.city) {
        components.push(address.city);
      }
      
      if (components.length > 0) {
        return components.join(', ');
      }
    }
    
    return null;
  } catch (error) {
    console.error('LocationIQ geocoding failed:', error);
    return null;
  }
};

/**
 * Alternative: Google Geocoding API (requires API key)
 * Uncomment and use if you have Google Maps API key
 */
/*
export const reverseGeocodeGoogle = async (
  latitude: number,
  longitude: number,
  apiKey: string
): Promise<string | null> => {
  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.status === 'OK' && data.results && data.results.length > 0) {
      return data.results[0].formatted_address;
    }
    
    return null;
  } catch (error) {
    console.error('Google reverse geocoding failed:', error);
    return null;
  }
};
*/
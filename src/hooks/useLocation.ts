// src/hooks/useLocation.ts
import { useState, useEffect } from 'react';
import {
  PermissionsAndroid,
  Platform,
  Alert,
  Linking,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { Location } from '../types/vendor.types';

interface UseLocationReturn {
  location: Location | null;
  hasPermission: boolean;
  loading: boolean;
  error: string | null;
  requestPermission: () => Promise<void>;
  refreshLocation: () => Promise<void>;
}

export const useLocation = (): UseLocationReturn => {
  const [location, setLocation] = useState<Location | null>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const hasLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      const status = await Geolocation.requestAuthorization('whenInUse');
      return status === 'granted';
    }

    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      return granted;
    }

    return false;
  };

  const requestLocationPermission = async () => {
    try {
      if (Platform.OS === 'ios') {
        const status = await Geolocation.requestAuthorization('whenInUse');
        return status === 'granted';
      }

      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Ferrywala Location Permission',
            message: 'Ferrywala needs access to your location to show nearby vendors and services.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        
        console.log('Permission result:', granted);
        
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          return true;
        } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
          Alert.alert(
            'Location Permission Required',
            'Please enable location permission from app settings to see nearby vendors.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Open Settings', onPress: () => Linking.openSettings() }
            ]
          );
          return false;
        }
        return false;
      }

      return false;
    } catch (err) {
      console.error('Error requesting location permission:', err);
      return false;
    }
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        console.log('Location obtained:', position.coords);
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setError(null);
      },
      (error) => {
        console.error('Error getting location:', error);
        setError('Unable to get your location');
        
        if (error.code === 1) {
          console.log('Location permission denied');
        } else if (error.code === 2) {
          console.log('Position unavailable');
        } else if (error.code === 3) {
          console.log('Location request timed out');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
        distanceFilter: 0,
        forceRequestLocation: true,
        showLocationDialog: true,
      }
    );
  };

  const requestPermission = async () => {
    const granted = await requestLocationPermission();
    setHasPermission(granted);
    
    if (granted) {
      getCurrentLocation();
    }
  };

  const refreshLocation = async () => {
    const hasPermission = await hasLocationPermission();
    if (hasPermission) {
      getCurrentLocation();
    } else {
      await requestPermission();
    }
  };

  useEffect(() => {
    const initLocation = async () => {
      setLoading(true);
      
      try {
        const hasPermission = await hasLocationPermission();
        console.log('Initial permission check:', hasPermission);
        
        if (!hasPermission) {
          // No permission, request it
          const granted = await requestLocationPermission();
          setHasPermission(granted);
          
          if (granted) {
            getCurrentLocation();
          }
        } else {
          // Already has permission
          setHasPermission(true);
          getCurrentLocation();
        }
      } catch (error) {
        console.error('Error in initLocation:', error);
      } finally {
        setLoading(false);
      }
    };

    initLocation();
  }, []);

  return {
    location,
    hasPermission,
    loading,
    error,
    requestPermission,
    refreshLocation,
  };
};
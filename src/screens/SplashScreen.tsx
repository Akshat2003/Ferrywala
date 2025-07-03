// src/screens/SplashScreen.tsx
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';

const { width } = Dimensions.get('window');

interface SplashScreenProps {
  onAnimationComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onAnimationComplete }) => {
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const slideAnim = useRef(new Animated.Value(-50)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start animations
    Animated.parallel([
      // Fade in animation
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      // Scale animation
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }),
      // Slide animation for text
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        delay: 300,
        useNativeDriver: true,
      }),
      // Rotate animation for icon
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
    ]).start();

    // Complete animation after delay
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        onAnimationComplete();
      });
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View className="flex-1 justify-center items-center" style={{ backgroundColor: '#FF6100' }}>
      <StatusBar barStyle="light-content" backgroundColor="#FF6100" />
      
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        }}
        className="items-center"
      >
        {/* Logo/Icon Container */}
        <Animated.View
          className="w-32 h-32 rounded-full bg-white justify-center items-center mb-8 shadow-lg"
          style={{
            transform: [{ rotate: spin }],
          }}
        >
          <Text className="text-5xl">🛒</Text>
        </Animated.View>

        {/* App Name */}
        <Animated.View
          style={{
            transform: [{ translateY: slideAnim }],
            opacity: fadeAnim,
          }}
        >
          <Text className="text-4xl font-bold text-white mb-2" style={{ fontFamily: 'System' }}>
            Ferrywala
          </Text>
          <Text className="text-lg text-white text-center opacity-90" style={{ fontFamily: 'System' }}>
            ...connecting dots...
          </Text>
        </Animated.View>
      </Animated.View>

      {/* Bottom tagline */}
      <Animated.View
        className="absolute bottom-20"
        style={{
          opacity: fadeAnim,
        }}
      >
        <Text className="text-sm text-white opacity-80" style={{ fontFamily: 'System' }}>
          Your Local Marketplace
        </Text>
      </Animated.View>

      {/* Loading dots animation */}
      <Animated.View
        className="absolute bottom-10 flex-row"
        style={{
          opacity: fadeAnim,
        }}
      >
        {[0, 1, 2].map((index) => (
          <LoadingDot key={index} delay={index * 200} />
        ))}
      </Animated.View>
    </View>
  );
};

// Loading dot component
const LoadingDot: React.FC<{ delay: number }> = ({ delay }) => {
  const scaleAnim = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 400,
          delay,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.5,
          duration: 400,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();

    return () => animation.stop();
  }, []);

  return (
    <Animated.View
      className="w-2 h-2 rounded-full bg-white mx-1"
      style={{
        transform: [{ scale: scaleAnim }],
      }}
    />
  );
};

export default SplashScreen;
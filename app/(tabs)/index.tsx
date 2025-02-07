import { Image, StyleSheet, Platform } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { SafeAreaView } from "react-native";
import { AsteroidMonitor } from '@/components/asteroidMonitor';

export default function HomeScreen() {
  return (
    <SafeAreaView>
      <AsteroidMonitor />
    </SafeAreaView>
  );
}

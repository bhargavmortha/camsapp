import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Loader as Loader2 } from 'lucide-react-native';

interface LoadingSpinnerProps {
  size?: number;
  color?: string;
}

export function LoadingSpinner({ size = 24, color = '#2563EB' }: LoadingSpinnerProps) {
  return (
    <View style={styles.container}>
      <Loader2 size={size} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
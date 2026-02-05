import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors, Shadows } from '../constants/theme';

export default function Card({ children, style, borderColor }) {
  return (
    <View
      style={[
        styles.card,
        borderColor && { borderWidth: 2, borderColor },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    ...Shadows.card,
  },
});

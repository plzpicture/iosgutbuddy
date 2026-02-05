import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

export default function CircularProgress({
  size = 80,
  strokeWidth = 8,
  progress,
  color,
  label,
  sublabel,
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <View style={styles.container}>
      <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
        <Svg width={size} height={size} style={{ position: 'absolute' }}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#E8E0D5"
            strokeWidth={strokeWidth}
            fill="none"
          />
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </Svg>
        <Text style={[styles.valueText, { color, fontSize: size * 0.275 }]}>
          {typeof progress === 'number' ? `${progress}%` : progress}
        </Text>
      </View>
      {label && <Text style={styles.label}>{label}</Text>}
      {sublabel && <Text style={styles.sublabel}>{sublabel}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  valueText: {
    fontWeight: '700',
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 8,
  },
  sublabel: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },
});

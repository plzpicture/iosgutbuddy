import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppProvider, useApp } from '../src/context/AppContext';
import OnboardingScreen from '../src/screens/OnboardingScreen';
import { Colors } from '../src/constants/theme';

function RootLayoutInner() {
  const { showOnboarding, showStravaModal } = useApp();

  if (showOnboarding) {
    return (
      <>
        <StatusBar style="dark" />
        <OnboardingScreen />
      </>
    );
  }

  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
      {showStravaModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.stravaIcon}>
              <Text style={styles.stravaIconText}>S</Text>
            </View>
            <Text style={styles.modalTitle}>Connecting to Strava...</Text>
            <Text style={styles.modalSubtitle}>Syncing your exercise data</Text>
          </View>
        </View>
      )}
    </>
  );
}

export default function RootLayout() {
  return (
    <AppProvider>
      <RootLayoutInner />
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 32,
    width: '80%',
    alignItems: 'center',
  },
  stravaIcon: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#FC4C02',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  stravaIconText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 24,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 13,
    color: '#999',
  },
});

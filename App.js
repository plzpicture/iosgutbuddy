// This file is kept as a fallback for non-Expo-Router environments.
// The primary entry point is now expo-router/entry via app/_layout.js
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { AppProvider } from './src/context/AppContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <AppProvider>
      <StatusBar style="light" />
      <AppNavigator />
    </AppProvider>
  );
}

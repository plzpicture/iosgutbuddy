import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../context/AppContext';
import { Colors } from '../constants/theme';

import OnboardingScreen from '../screens/OnboardingScreen';
import HomeScreen from '../screens/HomeScreen';
import LogScreen from '../screens/LogScreen';
import HistoryScreen from '../screens/HistoryScreen';
import InsightsScreen from '../screens/InsightsScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

function StravaModal() {
  return (
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <View style={styles.stravaIcon}>
          <Text style={styles.stravaIconText}>S</Text>
        </View>
        <Text style={styles.modalTitle}>Connecting to Strava...</Text>
        <Text style={styles.modalSubtitle}>Syncing your exercise data</Text>
      </View>
    </View>
  );
}

function HeaderTitle() {
  return (
    <LinearGradient
      colors={[Colors.primary, Colors.primaryDark]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.header}
    >
      <Text style={styles.headerText}>{'\u{1F33F}'} GutBuddy</Text>
    </LinearGradient>
  );
}

const tabConfig = [
  { name: 'Home', icon: '\u{1F3E0}', label: 'Home', component: HomeScreen },
  { name: 'Log', icon: '\u{1F37D}\uFE0F', label: 'Log', component: LogScreen },
  { name: 'History', icon: '\u{1F4C5}', label: 'History', component: HistoryScreen },
  { name: 'Insights', icon: '\u{1F4CA}', label: 'Insights', component: InsightsScreen },
  { name: 'Profile', icon: '\u{1F464}', label: 'Profile', component: ProfileScreen },
];

export default function AppNavigator() {
  const { showOnboarding, showStravaModal } = useApp();

  if (showOnboarding) {
    return <OnboardingScreen />;
  }

  return (
    <View style={styles.container}>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            header: () => <HeaderTitle />,
            tabBarStyle: styles.tabBar,
            tabBarActiveTintColor: Colors.primary,
            tabBarInactiveTintColor: '#999',
            tabBarLabelStyle: styles.tabBarLabel,
          }}
        >
          {tabConfig.map((tab) => (
            <Tab.Screen
              key={tab.name}
              name={tab.name}
              component={tab.component}
              options={{
                tabBarLabel: tab.label,
                tabBarIcon: ({ focused }) => (
                  <Text style={[styles.tabIcon, focused && styles.tabIconActive]}>
                    {tab.icon}
                  </Text>
                ),
              }}
            />
          ))}
        </Tab.Navigator>
      </NavigationContainer>
      {showStravaModal && <StravaModal />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 18,
  },
  tabBar: {
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 6,
    paddingBottom: 20,
    height: 70,
  },
  tabBarLabel: {
    fontSize: 10,
    fontWeight: '500',
  },
  tabIcon: {
    fontSize: 22,
  },
  tabIconActive: {
    // Active state handled by tint
  },
  // Modal
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

import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { Tabs } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../src/constants/theme';

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

const tabs = [
  { name: 'index', icon: '\u{1F3E0}', label: 'Home' },
  { name: 'log', icon: '\u{1F37D}\uFE0F', label: 'Log' },
  { name: 'history', icon: '\u{1F4C5}', label: 'History' },
  { name: 'insights', icon: '\u{1F4CA}', label: 'Insights' },
  { name: 'profile', icon: '\u{1F464}', label: 'Profile' },
];

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        header: () => <HeaderTitle />,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: '#999',
        tabBarLabelStyle: styles.tabBarLabel,
      }}
    >
      {tabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.label,
            tabBarIcon: ({ focused }) => (
              <Text style={{ fontSize: 22 }}>{tab.icon}</Text>
            ),
          }}
        />
      ))}
    </Tabs>
  );
}

const styles = StyleSheet.create({
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
});

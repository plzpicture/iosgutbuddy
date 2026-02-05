import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../context/AppContext';
import { levels } from '../constants/data';
import { Colors, Shadows } from '../constants/theme';
import Card from '../components/Card';
import analytics from '../utils/analytics';

export default function ProfileScreen() {
  const {
    userProfile,
    userLevel,
    userExp,
    streak,
    totalDays,
    monthlyAvg,
    currentLevelInfo,
    nextLevelInfo,
    getExpProgress,
    stravaConnected,
    setStravaConnected,
    handleStravaConnect,
    currentPlan,
    setCurrentPlan,
    showAnalyticsPanel,
    setShowAnalyticsPanel,
  } = useApp();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* User Profile Card */}
      <Card>
        <View style={styles.profileHeader}>
          <LinearGradient
            colors={[Colors.green, Colors.greenDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.avatar}
          >
            <Text style={styles.avatarEmoji}>{currentLevelInfo.icon}</Text>
          </LinearGradient>
          <View>
            <Text style={styles.nickname}>{userProfile.nickname || 'User'}</Text>
            <Text style={styles.levelText}>
              Lv.{userLevel} {currentLevelInfo.name}
            </Text>
          </View>
        </View>

        {/* EXP Bar */}
        <View style={styles.expContainer}>
          <View style={styles.expLabels}>
            <Text style={styles.expLabel}>EXP {userExp}</Text>
            <Text style={styles.expLabel}>
              {nextLevelInfo ? `Next: ${nextLevelInfo.exp - userExp}` : 'MAX!'}
            </Text>
          </View>
          <View style={styles.expTrack}>
            <LinearGradient
              colors={[Colors.green, Colors.success]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.expBar, { width: `${getExpProgress()}%` }]}
            />
          </View>
        </View>

        {/* Level Icons */}
        <View style={styles.levelIconsRow}>
          {levels.map((l, i) => (
            <View
              key={i}
              style={[styles.levelIconItem, { opacity: l.level <= userLevel ? 1 : 0.3 }]}
            >
              <Text style={styles.levelIcon}>{l.icon}</Text>
              <Text style={styles.levelNumber}>Lv.{l.level}</Text>
            </View>
          ))}
        </View>
      </Card>

      {/* Fitness Connections */}
      <Card
        borderColor={Colors.orange}
        style={!stravaConnected && { borderStyle: 'dashed' }}
      >
        <Text style={styles.sectionTitle}>{'\u{1F517}'} Fitness Connections</Text>
        {[
          {
            name: 'Strava',
            icon: 'S',
            bg: '#FC4C02',
            connected: stravaConnected,
            hasAction: true,
          },
          {
            name: 'Apple Health',
            icon: '\u2665',
            bg: '#000',
            connected: false,
            note: 'Requires native app',
          },
          {
            name: 'Nike Run Club',
            icon: '\u2713',
            bg: '#111',
            connected: false,
            note: stravaConnected ? 'Via Strava \u2713' : 'Connect Strava first',
          },
        ].map((app, i) => (
          <View
            key={i}
            style={[
              styles.connectionRow,
              { backgroundColor: app.connected ? Colors.orangeBg : '#f8f8f8' },
            ]}
          >
            <View style={styles.connectionLeft}>
              <View style={[styles.connectionIcon, { backgroundColor: app.bg }]}>
                <Text style={styles.connectionIconText}>{app.icon}</Text>
              </View>
              <View>
                <Text style={styles.connectionName}>{app.name}</Text>
                <Text
                  style={[
                    styles.connectionStatus,
                    { color: app.connected ? Colors.success : '#999' },
                  ]}
                >
                  {app.connected ? '\u2705 Connected' : app.note || 'Not connected'}
                </Text>
              </View>
            </View>
            {app.hasAction ? (
              <TouchableOpacity
                onPress={
                  app.connected
                    ? () => {
                        setStravaConnected(false);
                        analytics.track('Strava Disconnected');
                      }
                    : handleStravaConnect
                }
                style={[
                  styles.connectionButton,
                  { backgroundColor: app.connected ? '#f0f0f0' : app.bg },
                ]}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.connectionButtonText,
                    { color: app.connected ? '#666' : Colors.white },
                  ]}
                >
                  {app.connected ? 'Disconnect' : 'Connect'}
                </Text>
              </TouchableOpacity>
            ) : (
              <Text style={styles.comingSoon}>Coming Soon</Text>
            )}
          </View>
        ))}
      </Card>

      {/* Stats */}
      <Card>
        <View style={styles.statsRow}>
          {[
            { v: streak, label: '\u{1F525} Streak', c: Colors.red, bg: Colors.redBg },
            { v: totalDays, label: '\u{1F4C5} Total', c: Colors.blue, bg: Colors.blueBg },
            { v: monthlyAvg, label: '\u{1F49A} Avg', c: Colors.successDark, bg: Colors.greenBg },
          ].map((item, i) => (
            <View key={i} style={[styles.statItem, { backgroundColor: item.bg }]}>
              <Text style={[styles.statValue, { color: item.c }]}>{item.v}</Text>
              <Text style={[styles.statLabel, { color: item.c }]}>{item.label}</Text>
            </View>
          ))}
        </View>
      </Card>

      {/* Badges */}
      <Card>
        <Text style={styles.sectionTitle}>{'\u{1F3C5}'} Badges</Text>
        <View style={styles.badgesGrid}>
          {[
            { icon: '\u{1F331}', earned: true },
            { icon: '\u{1F525}', earned: true },
            { icon: '\u26A1', earned: true },
            { icon: '\u{1F3C3}', earned: true },
            { icon: '\u{1F4CA}', earned: true },
            { icon: '\u{1F9D8}', earned: false },
            { icon: '\u{1F3C6}', earned: false },
            { icon: '\u{1F451}', earned: false },
          ].map((b, i) => (
            <View
              key={i}
              style={[
                styles.badge,
                { opacity: b.earned ? 1 : 0.3, backgroundColor: b.earned ? Colors.warmBg : '#f5f5f5' },
              ]}
            >
              <Text style={styles.badgeIcon}>{b.icon}</Text>
            </View>
          ))}
        </View>
      </Card>

      {/* Plans */}
      <Card>
        <Text style={styles.sectionTitle}>{'\u2B50'} Plans</Text>
        {[
          { id: 'Basic', price: 'Free', color: '#999', desc: '1 analysis/day' },
          {
            id: 'Pro',
            price: '$9.99/mo',
            color: Colors.primary,
            badge: 'Popular',
            desc: 'Unlimited + AI correlation',
          },
          {
            id: 'Family',
            price: '$19.99/mo',
            color: Colors.purple,
            badge: 'Best',
            desc: 'Up to 5 members',
          },
        ].map((plan) => (
          <TouchableOpacity
            key={plan.id}
            onPress={() => setCurrentPlan(plan.id)}
            style={[
              styles.planRow,
              {
                borderWidth: currentPlan === plan.id ? 2 : 1,
                borderColor: currentPlan === plan.id ? plan.color : '#eee',
              },
            ]}
            activeOpacity={0.7}
          >
            {plan.badge && (
              <View style={[styles.planBadge, { backgroundColor: plan.color }]}>
                <Text style={styles.planBadgeText}>{plan.badge}</Text>
              </View>
            )}
            <View style={styles.planInfo}>
              <Text style={[styles.planName, { color: plan.color }]}>{plan.id}</Text>
              <Text style={styles.planDesc}>{plan.desc}</Text>
            </View>
            <Text style={styles.planPrice}>{plan.price}</Text>
          </TouchableOpacity>
        ))}
      </Card>

      {/* Analytics Button */}
      <TouchableOpacity
        onPress={() => setShowAnalyticsPanel(!showAnalyticsPanel)}
        style={styles.analyticsButton}
        activeOpacity={0.7}
      >
        <Text style={styles.analyticsButtonText}>
          {'\u{1F4CA}'} Analytics ({analytics.events.length})
        </Text>
      </TouchableOpacity>

      {showAnalyticsPanel && (
        <View style={styles.analyticsPanel}>
          {[...analytics.events].reverse().map((e, i) => (
            <View key={i} style={styles.analyticsRow}>
              <Text style={styles.analyticsEvent}>{e.event}</Text>
              <Text style={styles.analyticsProps}>
                {JSON.stringify(
                  Object.fromEntries(
                    Object.entries(e).filter(
                      ([k]) => !['event', 'timestamp'].includes(k)
                    )
                  )
                )}
              </Text>
            </View>
          ))}
        </View>
      )}
      <View style={{ height: 20 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 12,
  },
  // Profile header
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: {
    fontSize: 28,
  },
  nickname: {
    fontSize: 18,
    fontWeight: '600',
  },
  levelText: {
    fontSize: 14,
    color: Colors.primary,
  },
  // EXP
  expContainer: {
    marginBottom: 12,
  },
  expLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  expLabel: {
    fontSize: 11,
    color: '#888',
  },
  expTrack: {
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  expBar: {
    height: '100%',
    borderRadius: 4,
  },
  // Level icons
  levelIconsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  levelIconItem: {
    alignItems: 'center',
  },
  levelIcon: {
    fontSize: 18,
  },
  levelNumber: {
    fontSize: 8,
    color: '#999',
  },
  // Connections
  connectionRow: {
    padding: 14,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  connectionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  connectionIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  connectionIconText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 14,
  },
  connectionName: {
    fontSize: 14,
    fontWeight: '600',
  },
  connectionStatus: {
    fontSize: 11,
  },
  connectionButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  connectionButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  comingSoon: {
    fontSize: 11,
    color: '#bbb',
  },
  // Stats
  statsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statItem: {
    flex: 1,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
  // Badges
  badgesGrid: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  badge: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeIcon: {
    fontSize: 20,
  },
  // Plans
  planRow: {
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
  },
  planBadge: {
    position: 'absolute',
    top: -6,
    right: 12,
    paddingVertical: 1,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  planBadgeText: {
    color: Colors.white,
    fontSize: 9,
    fontWeight: '600',
  },
  planInfo: {
    flex: 1,
  },
  planName: {
    fontSize: 14,
    fontWeight: '600',
  },
  planDesc: {
    fontSize: 10,
    color: '#999',
    marginTop: 2,
  },
  planPrice: {
    fontSize: 16,
    fontWeight: '700',
  },
  // Analytics
  analyticsButton: {
    backgroundColor: Colors.blueBg,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 4,
  },
  analyticsButtonText: {
    color: Colors.blue,
    fontSize: 16,
    fontWeight: '600',
  },
  analyticsPanel: {
    marginTop: 10,
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 16,
    maxHeight: 180,
  },
  analyticsRow: {
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  analyticsEvent: {
    color: Colors.primary,
    fontSize: 10,
    fontFamily: 'monospace',
  },
  analyticsProps: {
    color: '#888',
    fontSize: 10,
    fontFamily: 'monospace',
  },
});

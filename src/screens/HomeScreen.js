import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../context/AppContext';
import { getExerciseIcon, getExerciseLabel } from '../constants/data';
import { Colors, Shadows } from '../constants/theme';
import Card from '../components/Card';
import CircularProgress from '../components/CircularProgress';
import GradientButton from '../components/GradientButton';
import analytics from '../utils/analytics';

export default function HomeScreen({ navigation }) {
  const {
    userProfile,
    gutHealth,
    correlationScore,
    todayExercise,
    stravaConnected,
    avgExerciseGut,
    avgNoExerciseGut,
    totalExerciseDays,
    handleTabChange,
  } = useApp();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Greeting */}
      <LinearGradient
        colors={[Colors.green, Colors.greenDark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.greeting}
      >
        <Text style={styles.greetingTitle}>
          {'\u{1F44B}'} Hey {userProfile.nickname || 'there'}!
        </Text>
        <Text style={styles.greetingSubtitle}>
          Your gut & fitness overview for today
        </Text>
      </LinearGradient>

      {/* Score Cards Row */}
      <View style={styles.scoreRow}>
        <Card style={styles.scoreCard}>
          <CircularProgress
            size={80}
            strokeWidth={8}
            progress={gutHealth}
            color={Colors.primary}
          />
          <Text style={styles.scoreLabel}>{'\u{1FAC3}'} Gut Score</Text>
          <Text style={styles.scoreSubLabel}>{'\u{1F60A}'} Good</Text>
        </Card>
        <Card style={styles.scoreCard}>
          <CircularProgress
            size={80}
            strokeWidth={8}
            progress={correlationScore}
            color={Colors.orange}
          />
          <Text style={styles.scoreLabel}>{'\u{1F3C3}'} Correlation</Text>
          <Text style={styles.scoreSubLabel}>Exercise{'\u2194'}Gut</Text>
        </Card>
      </View>

      {/* Today's Exercise */}
      <Card borderColor={Colors.orange}>
        <View style={styles.exerciseHeader}>
          <Text style={styles.sectionTitle}>{'\u{1F3C3}'} Today's Exercise</Text>
          {stravaConnected && (
            <View style={styles.stravaBadge}>
              <Text style={styles.stravaBadgeText}>Strava {'\u2713'}</Text>
            </View>
          )}
        </View>
        {todayExercise ? (
          <View style={styles.exerciseStats}>
            {[
              {
                v: `${getExerciseIcon(todayExercise.type)} ${getExerciseLabel(todayExercise.type)}`,
                sub: 'Activity',
                fs: 14,
              },
              { v: `${todayExercise.duration}min`, sub: 'Duration', fs: 20 },
              { v: `${todayExercise.calories}`, sub: 'kcal', fs: 20 },
            ].map((item, i) => (
              <View key={i} style={styles.exerciseStatItem}>
                <Text style={[styles.exerciseStatValue, { fontSize: item.fs }]}>
                  {item.v}
                </Text>
                <Text style={styles.exerciseStatLabel}>{item.sub}</Text>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.noExercise}>
            <Text style={styles.noExerciseEmoji}>{'\u{1F3C3}\u200D\u2642\uFE0F'}</Text>
            <Text style={styles.noExerciseText}>
              No exercise logged.{' '}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Log')}>
              <Text style={styles.logNowLink}>Log now {'\u2192'}</Text>
            </TouchableOpacity>
          </View>
        )}
      </Card>

      {/* AI Insight */}
      <Card>
        <Text style={styles.sectionTitle}>{'\u{1F916}'} AI Insight</Text>
        <View style={styles.insightBox}>
          <Text style={styles.insightText}>
            {avgExerciseGut > avgNoExerciseGut
              ? `Exercise days show ${avgExerciseGut - avgNoExerciseGut} point higher gut scores! Your gut loves when you move. Keep your ${totalExerciseDays}-day exercise month going! \u{1F389}`
              : 'Start tracking exercise to discover gut-exercise patterns! Even 20-min walks improve digestion. \u{1F6B6}'}
          </Text>
        </View>
      </Card>

      {/* Nutrition */}
      <Card>
        <Text style={[styles.sectionTitle, { marginBottom: 16 }]}>
          {'\u{1F37D}\uFE0F'} Today's Nutrition
        </Text>
        <View style={styles.nutritionGrid}>
          {[
            { label: 'Carbs', value: 180, max: 300, color: '#FF9500' },
            { label: 'Protein', value: 65, max: 100, color: '#FF3B30' },
            { label: 'Fat', value: 45, max: 70, color: '#FFCC00' },
            { label: 'Fiber', value: 18, max: 30, color: '#4CAF50' },
          ].map((item, i) => (
            <View key={i} style={styles.nutritionItem}>
              <Text style={styles.nutritionValue}>{item.value}g</Text>
              <Text style={styles.nutritionLabel}>{item.label}</Text>
              <View style={styles.nutritionBarTrack}>
                <View
                  style={[
                    styles.nutritionBar,
                    {
                      width: `${Math.min(100, (item.value / item.max) * 100)}%`,
                      backgroundColor: item.color,
                    },
                  ]}
                />
              </View>
            </View>
          ))}
        </View>
      </Card>

      {/* Quick Analysis Button */}
      <GradientButton
        title={'\u{1F6BD} Quick Stool Analysis'}
        onPress={() => analytics.track('Stool Analysis Clicked')}
      />
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
  greeting: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  greetingTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textDark,
  },
  greetingSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  scoreRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 0,
  },
  scoreCard: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
  },
  scoreLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 8,
  },
  scoreSubLabel: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 12,
  },
  stravaBadge: {
    backgroundColor: Colors.orange,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  stravaBadgeText: {
    fontSize: 10,
    color: Colors.white,
    fontWeight: '600',
  },
  exerciseStats: {
    flexDirection: 'row',
    gap: 10,
  },
  exerciseStatItem: {
    flex: 1,
    backgroundColor: Colors.orangeBg,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  exerciseStatValue: {
    fontWeight: '700',
    color: Colors.orange,
  },
  exerciseStatLabel: {
    fontSize: 10,
    color: '#999',
    marginTop: 4,
  },
  noExercise: {
    alignItems: 'center',
    padding: 16,
  },
  noExerciseEmoji: {
    fontSize: 28,
    marginBottom: 4,
  },
  noExerciseText: {
    color: '#999',
    fontSize: 13,
  },
  logNowLink: {
    color: Colors.orange,
    fontWeight: '600',
    fontSize: 13,
  },
  insightBox: {
    padding: 14,
    borderRadius: 12,
    backgroundColor: Colors.warmBg,
  },
  insightText: {
    fontSize: 13,
    color: '#555',
    lineHeight: 21,
  },
  nutritionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  nutritionItem: {
    flex: 1,
    alignItems: 'center',
  },
  nutritionValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  nutritionLabel: {
    fontSize: 10,
    color: '#999',
    marginBottom: 6,
  },
  nutritionBarTrack: {
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: 3,
    width: '100%',
  },
  nutritionBar: {
    height: '100%',
    borderRadius: 3,
  },
});

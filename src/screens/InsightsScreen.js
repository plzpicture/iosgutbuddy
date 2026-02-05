import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../context/AppContext';
import { Colors } from '../constants/theme';
import Card from '../components/Card';

export default function InsightsScreen() {
  const {
    correlationScore,
    avgExerciseGut,
    avgNoExerciseGut,
    chatMessages,
    chatInput,
    setChatInput,
    handleSendChat,
  } = useApp();

  const patterns = [
    { icon: '\u{1F3C3}', pattern: 'Morning runs improve next-day gut score by 12%', confidence: 85, color: Colors.success },
    { icon: '\u{1F4AA}', pattern: 'High-intensity days show 40% more bloating', confidence: 72, color: '#FF9800' },
    { icon: '\u{1F6CB}\uFE0F', pattern: 'No-exercise days: 65% more irregular bowel', confidence: 80, color: Colors.errorDark },
    { icon: '\u{1F9D8}', pattern: 'Yoga correlates with lowest bloating', confidence: 78, color: Colors.success },
    { icon: '\u{1F634}', pattern: '7h+ sleep + exercise = highest gut scores', confidence: 88, color: Colors.blueLight },
  ];

  const weeklyPlan = [
    { day: 'Mon', ex: '\u{1F3C3} Jog 30min', int: 'moderate', gut: 'Oats + yogurt' },
    { day: 'Tue', ex: '\u{1F9D8} Yoga 40min', int: 'light', gut: 'High-fiber salad' },
    { day: 'Wed', ex: '\u{1F3C3} Intervals 25min', int: 'hard', gut: 'Light, easy meals' },
    { day: 'Thu', ex: '\u{1F6B6} Walk 45min', int: 'light', gut: 'Fermented foods' },
    { day: 'Fri', ex: '\u{1F3C3} Jog 30min', int: 'moderate', gut: 'Whole grains' },
    { day: 'Sat', ex: '\u{1F6B4} Cycle 60min', int: 'moderate', gut: 'Balanced meal' },
    { day: 'Sun', ex: '\u{1F9D8} Stretch 20min', int: 'light', gut: 'Probiotics + rest' },
  ];

  const getIntensityStyle = (int) => {
    if (int === 'light') return { bg: Colors.greenBg, color: Colors.success };
    if (int === 'moderate') return { bg: Colors.yellowBg, color: Colors.warningDark };
    return { bg: Colors.orangeBgLight, color: '#E65100' };
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Correlation Header */}
      <LinearGradient
        colors={[Colors.orange, Colors.orangeDark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.correlationCard}
      >
        <Text style={styles.correlationTitle}>
          {'\u{1F3C3}\u2194\u{1FAC3}'} Exercise & Gut Correlation
        </Text>
        <View style={styles.correlationContent}>
          <View style={styles.correlationCircle}>
            <Text style={styles.correlationScore}>{correlationScore}</Text>
          </View>
          <View style={styles.correlationStats}>
            <Text style={styles.correlationStat}>
              {'\u{1F3C3}'} Exercise days: avg <Text style={styles.bold}>{avgExerciseGut}</Text>
            </Text>
            <Text style={styles.correlationStat}>
              {'\u{1F6CB}\uFE0F'} Rest days: avg <Text style={styles.bold}>{avgNoExerciseGut}</Text>
            </Text>
            <Text style={styles.correlationStat}>
              {'\u{1F4C8}'} Difference:{' '}
              <Text style={styles.bold}>+{avgExerciseGut - avgNoExerciseGut}</Text> pts
            </Text>
          </View>
        </View>
      </LinearGradient>

      {/* AI Pattern Detection */}
      <Card>
        <Text style={styles.sectionTitle}>{'\u{1F916}'} AI Pattern Detection</Text>
        {patterns.map((item, i) => (
          <View key={i} style={styles.patternRow}>
            <Text style={styles.patternIcon}>{item.icon}</Text>
            <View style={styles.patternContent}>
              <Text style={styles.patternText}>{item.pattern}</Text>
              <View style={styles.confidenceRow}>
                <View style={styles.confidenceTrack}>
                  <View
                    style={[
                      styles.confidenceBar,
                      { width: `${item.confidence}%`, backgroundColor: item.color },
                    ]}
                  />
                </View>
                <Text style={[styles.confidenceLabel, { color: item.color }]}>
                  {item.confidence}%
                </Text>
              </View>
            </View>
          </View>
        ))}
      </Card>

      {/* AI Weekly Plan */}
      <Card>
        <Text style={styles.sectionTitle}>{'\u{1F4C5}'} AI Weekly Plan</Text>
        {weeklyPlan.map((d, i) => {
          const intStyle = getIntensityStyle(d.int);
          return (
            <View
              key={i}
              style={[
                styles.planRow,
                i < weeklyPlan.length - 1 && styles.planRowBorder,
              ]}
            >
              <View style={styles.planDayBadge}>
                <Text style={styles.planDayText}>{d.day}</Text>
              </View>
              <View style={styles.planContent}>
                <Text style={styles.planExercise}>{d.ex}</Text>
                <Text style={styles.planGut}>{'\u{1F37D}\uFE0F'} {d.gut}</Text>
              </View>
              <View style={[styles.planIntBadge, { backgroundColor: intStyle.bg }]}>
                <Text style={[styles.planIntText, { color: intStyle.color }]}>
                  {d.int}
                </Text>
              </View>
            </View>
          );
        })}
      </Card>

      {/* Bristol Stool Scale */}
      <Card>
        <Text style={styles.sectionTitle}>{'\u{1F52C}'} Bristol Stool Scale</Text>
        <View style={styles.bristolRow}>
          {[1, 2, 3, 4, 5, 6, 7].map((t) => (
            <View
              key={t}
              style={[
                styles.bristolItem,
                t === 4 && styles.bristolItemIdeal,
              ]}
            >
              <Text
                style={[
                  styles.bristolNumber,
                  { color: t === 4 ? Colors.success : '#ccc' },
                ]}
              >
                {t}
              </Text>
            </View>
          ))}
        </View>
        <Text style={styles.bristolAvg}>
          Average: <Text style={styles.bristolAvgValue}>Type 4</Text> (Ideal)
        </Text>
      </Card>

      {/* AI Chat */}
      <Card>
        <Text style={styles.sectionTitle}>{'\u{1F4AC}'} AI Health Chat</Text>
        <View style={styles.chatContainer}>
          <ScrollView style={styles.chatScroll} nestedScrollEnabled>
            {chatMessages.map((m, i) => (
              <View
                key={i}
                style={[
                  styles.chatBubbleContainer,
                  m.role === 'user'
                    ? styles.chatBubbleRight
                    : styles.chatBubbleLeft,
                ]}
              >
                {m.role === 'user' ? (
                  <LinearGradient
                    colors={[Colors.primary, Colors.primaryDark]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.chatBubbleUser}
                  >
                    <Text style={styles.chatTextUser}>{m.content}</Text>
                  </LinearGradient>
                ) : (
                  <View style={styles.chatBubbleAssistant}>
                    <Text style={styles.chatTextAssistant}>{m.content}</Text>
                  </View>
                )}
              </View>
            ))}
          </ScrollView>
        </View>
        <View style={styles.chatInputRow}>
          <TextInput
            value={chatInput}
            onChangeText={setChatInput}
            onSubmitEditing={handleSendChat}
            placeholder="Ask about exercise & gut health..."
            placeholderTextColor="#bbb"
            style={styles.chatInput}
            returnKeyType="send"
          />
          <TouchableOpacity onPress={handleSendChat} activeOpacity={0.8}>
            <LinearGradient
              colors={[Colors.primary, Colors.primaryDark]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.chatSendButton}
            >
              <Text style={styles.chatSendIcon}>{'\u27A4'}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </Card>
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
    marginBottom: 14,
  },
  bold: {
    fontWeight: '700',
  },
  // Correlation
  correlationCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  correlationTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.white,
    marginBottom: 12,
  },
  correlationContent: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  correlationCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  correlationScore: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.white,
  },
  correlationStats: {
    flex: 1,
    gap: 6,
  },
  correlationStat: {
    fontSize: 13,
    color: Colors.white,
    lineHeight: 23,
  },
  // Patterns
  patternRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: Colors.warmBg,
    marginBottom: 8,
  },
  patternIcon: {
    fontSize: 24,
  },
  patternContent: {
    flex: 1,
  },
  patternText: {
    fontSize: 12,
    color: '#333',
    lineHeight: 17,
  },
  confidenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  confidenceTrack: {
    flex: 1,
    height: 4,
    backgroundColor: '#eee',
    borderRadius: 2,
  },
  confidenceBar: {
    height: '100%',
    borderRadius: 2,
  },
  confidenceLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
  // Weekly Plan
  planRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
  },
  planRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  planDayBadge: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: Colors.orangeBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  planDayText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.orange,
  },
  planContent: {
    flex: 1,
  },
  planExercise: {
    fontSize: 13,
    fontWeight: '500',
  },
  planGut: {
    fontSize: 11,
    color: '#999',
  },
  planIntBadge: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  planIntText: {
    fontSize: 9,
  },
  // Bristol
  bristolRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  bristolItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 8,
    backgroundColor: '#f8f8f8',
    marginHorizontal: 1,
  },
  bristolItemIdeal: {
    backgroundColor: Colors.greenBg,
    borderWidth: 2,
    borderColor: Colors.success,
  },
  bristolNumber: {
    fontSize: 14,
    fontWeight: '700',
  },
  bristolAvg: {
    textAlign: 'center',
    fontSize: 12,
    color: '#666',
  },
  bristolAvgValue: {
    color: Colors.success,
    fontWeight: '700',
  },
  // Chat
  chatContainer: {
    height: 180,
    marginBottom: 12,
  },
  chatScroll: {
    flex: 1,
  },
  chatBubbleContainer: {
    marginBottom: 8,
    maxWidth: '82%',
  },
  chatBubbleRight: {
    alignSelf: 'flex-end',
  },
  chatBubbleLeft: {
    alignSelf: 'flex-start',
  },
  chatBubbleUser: {
    padding: 10,
    borderRadius: 14,
  },
  chatBubbleAssistant: {
    padding: 10,
    borderRadius: 14,
    backgroundColor: '#F5F0E8',
  },
  chatTextUser: {
    color: Colors.white,
    fontSize: 12,
    lineHeight: 18,
  },
  chatTextAssistant: {
    color: '#333',
    fontSize: 12,
    lineHeight: 18,
  },
  chatInputRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  chatInput: {
    flex: 1,
    padding: 10,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.border,
    fontSize: 12,
  },
  chatSendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatSendIcon: {
    color: Colors.white,
    fontSize: 14,
  },
});

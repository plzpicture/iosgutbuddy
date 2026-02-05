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
import { exerciseTypes, intensityLevels, feelings } from '../constants/data';
import { Colors, Shadows } from '../constants/theme';
import Card from '../components/Card';
import GradientButton from '../components/GradientButton';

export default function LogScreen() {
  const {
    stravaConnected,
    exerciseType,
    setExerciseType,
    exerciseDuration,
    setExerciseDuration,
    exerciseIntensity,
    setExerciseIntensity,
    showExerciseSaved,
    saveExercise,
    activeMeal,
    setActiveMeal,
    todayFeeling,
    setTodayFeeling,
    todayMemo,
    setTodayMemo,
    todayStoolCount,
    setTodayStoolCount,
    showSaved,
    saveTodayRecord,
  } = useApp();

  const canSaveExercise = exerciseType && exerciseIntensity;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Exercise Logger */}
      <Card borderColor={Colors.orange}>
        <Text style={styles.sectionTitle}>{'\u{1F3CB}\uFE0F'} Log Exercise</Text>
        {stravaConnected && (
          <View style={styles.stravaNote}>
            <Text style={styles.stravaNoteText}>
              {'\u26A1'} Strava auto-syncs workouts. Use manual for non-Strava activities.
            </Text>
          </View>
        )}

        {/* Activity Type */}
        <Text style={styles.fieldLabel}>Activity type</Text>
        <View style={styles.exerciseTypeGrid}>
          {exerciseTypes.map((e) => (
            <TouchableOpacity
              key={e.value}
              onPress={() => setExerciseType(e.value)}
              style={[
                styles.exerciseTypeButton,
                exerciseType === e.value && styles.exerciseTypeButtonSelected,
              ]}
              activeOpacity={0.7}
            >
              <Text style={styles.exerciseTypeIcon}>{e.icon}</Text>
              <Text style={styles.exerciseTypeLabel}>{e.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Duration */}
        <Text style={styles.fieldLabel}>Duration</Text>
        <View style={styles.durationRow}>
          <TouchableOpacity
            onPress={() => setExerciseDuration(Math.max(5, exerciseDuration - 5))}
            style={styles.roundButton}
          >
            <Text style={styles.roundButtonText}>-</Text>
          </TouchableOpacity>
          <View style={styles.durationDisplay}>
            <Text style={styles.durationValue}>{exerciseDuration}</Text>
            <Text style={styles.durationUnit}>min</Text>
          </View>
          <TouchableOpacity
            onPress={() => setExerciseDuration(exerciseDuration + 5)}
            style={styles.roundButton}
          >
            <Text style={styles.roundButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        {/* Intensity */}
        <Text style={styles.fieldLabel}>Intensity</Text>
        <View style={styles.intensityRow}>
          {intensityLevels.map((lv) => {
            const selected = exerciseIntensity === lv.value;
            return (
              <TouchableOpacity
                key={lv.value}
                onPress={() => setExerciseIntensity(lv.value)}
                style={[
                  styles.intensityButton,
                  selected && { borderColor: lv.color, borderWidth: 2, backgroundColor: `${lv.color}15` },
                ]}
                activeOpacity={0.7}
              >
                <Text style={styles.intensityEmoji}>{lv.emoji}</Text>
                <Text
                  style={[
                    styles.intensityLabel,
                    selected && { fontWeight: '600' },
                  ]}
                >
                  {lv.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <GradientButton
          title={'\u{1F3C3} Save Exercise'}
          colors={canSaveExercise ? [Colors.orange, Colors.orangeDark] : ['#E8E0D5', '#E8E0D5']}
          disabled={!canSaveExercise}
          onPress={saveExercise}
        />
        {showExerciseSaved && (
          <Text style={styles.savedText}>{'\u2705'} Exercise saved!</Text>
        )}
      </Card>

      {/* Meal Tabs */}
      <View style={styles.mealTabs}>
        {['breakfast', 'lunch', 'dinner'].map((m) => {
          const active = activeMeal === m;
          const icon = m === 'breakfast' ? '\u{1F305}' : m === 'lunch' ? '\u2600\uFE0F' : '\u{1F319}';
          return (
            <TouchableOpacity
              key={m}
              onPress={() => setActiveMeal(m)}
              style={styles.mealTabButton}
              activeOpacity={0.7}
            >
              {active ? (
                <LinearGradient
                  colors={[Colors.primary, Colors.primaryDark]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.mealTabGradient}
                >
                  <Text style={[styles.mealTabText, { color: Colors.white }]}>
                    {icon} {m.charAt(0).toUpperCase() + m.slice(1)}
                  </Text>
                </LinearGradient>
              ) : (
                <View style={styles.mealTabInactive}>
                  <Text style={styles.mealTabText}>
                    {icon} {m.charAt(0).toUpperCase() + m.slice(1)}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Photo Section */}
      <Card>
        <Text style={styles.fieldLabel}>{'\u{1F4F8}'} Stool / Meal Photos</Text>
        <View style={styles.photoRow}>
          {[0, 1, 2, 3].map((i) => (
            <TouchableOpacity key={i} style={[styles.photoPlaceholder, i < 2 && styles.photoCircle]}>
              <Text style={styles.photoPlus}>+</Text>
            </TouchableOpacity>
          ))}
        </View>
        <GradientButton title={'\u{1F50D} Analyze with AI'} onPress={() => {}} />
      </Card>

      {/* Gut Feeling */}
      <Card borderColor={Colors.green}>
        <Text style={[styles.sectionTitle, { marginBottom: 12 }]}>
          {'\u{1F4AD}'} How's your gut?
        </Text>
        <View style={styles.feelingsGrid}>
          {feelings.map((f, i) => {
            const feelingKey = `${f.emoji} ${f.label}`;
            const selected = todayFeeling === feelingKey;
            return (
              <TouchableOpacity
                key={i}
                onPress={() => setTodayFeeling(feelingKey)}
                style={[
                  styles.feelingChip,
                  selected && styles.feelingChipSelected,
                ]}
                activeOpacity={0.7}
              >
                <Text style={styles.feelingEmoji}>{f.emoji}</Text>
                <Text style={styles.feelingLabel}>{f.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Stool Count */}
        <View style={styles.stoolCountRow}>
          <Text style={styles.stoolIcon}>{'\u{1F6BD}'}</Text>
          <TouchableOpacity
            onPress={() => setTodayStoolCount(Math.max(0, todayStoolCount - 1))}
            style={styles.roundButton}
          >
            <Text style={styles.roundButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.stoolCountValue}>{todayStoolCount}</Text>
          <TouchableOpacity
            onPress={() => setTodayStoolCount(todayStoolCount + 1)}
            style={styles.roundButton}
          >
            <Text style={styles.roundButtonText}>+</Text>
          </TouchableOpacity>
          <Text style={styles.stoolCountLabel}>times</Text>
        </View>

        {/* Memo */}
        <TextInput
          value={todayMemo}
          onChangeText={setTodayMemo}
          placeholder="Notes..."
          placeholderTextColor="#bbb"
          style={styles.memoInput}
          multiline
        />

        <GradientButton
          title={'\u2705 Save Gut Log'}
          colors={[Colors.success, '#45a049']}
          onPress={saveTodayRecord}
        />
        {showSaved && (
          <Text style={[styles.savedText, { color: Colors.success }]}>
            {'\u2705'} Saved!
          </Text>
        )}
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
  fieldLabel: {
    fontSize: 13,
    color: '#8B7355',
    marginBottom: 10,
  },
  stravaNote: {
    backgroundColor: '#FFF3EC',
    padding: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  stravaNoteText: {
    fontSize: 11,
    color: Colors.strava,
  },
  exerciseTypeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  exerciseTypeButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  exerciseTypeButtonSelected: {
    borderWidth: 2,
    borderColor: Colors.orange,
    backgroundColor: Colors.orangeBg,
  },
  exerciseTypeIcon: {
    fontSize: 18,
  },
  exerciseTypeLabel: {
    fontSize: 13,
  },
  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  roundButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roundButtonText: {
    fontSize: 18,
  },
  durationDisplay: {
    flexDirection: 'row',
    alignItems: 'baseline',
    minWidth: 60,
    justifyContent: 'center',
  },
  durationValue: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.orange,
  },
  durationUnit: {
    fontSize: 14,
    color: Colors.orange,
  },
  intensityRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 16,
  },
  intensityButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    alignItems: 'center',
  },
  intensityEmoji: {
    fontSize: 16,
  },
  intensityLabel: {
    fontSize: 11,
    marginTop: 2,
  },
  savedText: {
    textAlign: 'center',
    marginTop: 8,
    color: Colors.orange,
    fontWeight: '600',
    fontSize: 14,
  },
  mealTabs: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 16,
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 6,
  },
  mealTabButton: {
    flex: 1,
  },
  mealTabGradient: {
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  mealTabInactive: {
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  mealTabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
  },
  photoRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  photoPlaceholder: {
    width: 52,
    height: 52,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
    backgroundColor: '#FAF5EC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoCircle: {
    borderRadius: 26,
  },
  photoPlus: {
    fontSize: 16,
    color: Colors.primary,
  },
  feelingsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  feelingChip: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  feelingChipSelected: {
    borderWidth: 2,
    borderColor: Colors.success,
    backgroundColor: Colors.greenBg,
  },
  feelingEmoji: {
    fontSize: 18,
  },
  feelingLabel: {
    fontSize: 13,
  },
  stoolCountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  stoolIcon: {
    fontSize: 13,
    color: '#8B7355',
  },
  stoolCountValue: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.primary,
    minWidth: 30,
    textAlign: 'center',
  },
  stoolCountLabel: {
    fontSize: 12,
    color: '#999',
  },
  memoInput: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    fontSize: 14,
    height: 50,
    marginBottom: 12,
  },
});

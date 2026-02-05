import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Platform,
  ActionSheetIOS,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { useApp } from '../context/AppContext';
import { exerciseTypes, intensityLevels, feelings } from '../constants/data';
import { Colors } from '../constants/theme';
import Card from '../components/Card';
import GradientButton from '../components/GradientButton';

export default function LogScreen() {
  const {
    stravaConnected,
    selectedExercises,
    toggleExerciseType,
    updateExerciseDuration,
    updateExerciseIntensity,
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
    photos,
    addPhoto,
    removePhoto,
  } = useApp();

  const pickImage = async (source) => {
    let result;
    if (source === 'camera') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Camera permission is required to take photos.');
        return;
      }
      result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.8,
      });
    } else {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Photo library permission is required.');
        return;
      }
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.8,
      });
    }
    if (!result.canceled && result.assets?.[0]?.uri) {
      addPhoto(result.assets[0].uri);
    }
  };

  const showPhotoOptions = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Take Photo', 'Choose from Library'],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) pickImage('camera');
          else if (buttonIndex === 2) pickImage('library');
        }
      );
    } else {
      Alert.alert('Add Photo', 'Choose an option', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Take Photo', onPress: () => pickImage('camera') },
        { text: 'Choose from Library', onPress: () => pickImage('library') },
      ]);
    }
  };

  const canSaveExercise = selectedExercises.length > 0;
  const totalDuration = selectedExercises.reduce((a, e) => a + e.duration, 0);

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

        {/* Activity Type - Multi-select */}
        <Text style={styles.fieldLabel}>Activity type (select multiple)</Text>
        <View style={styles.exerciseTypeGrid}>
          {exerciseTypes.map((e) => {
            const isSelected = selectedExercises.some((se) => se.type === e.value);
            return (
              <TouchableOpacity
                key={e.value}
                onPress={() => toggleExerciseType(e.value)}
                style={[
                  styles.exerciseTypeButton,
                  isSelected && styles.exerciseTypeButtonSelected,
                ]}
                activeOpacity={0.7}
              >
                <Text style={styles.exerciseTypeIcon}>{e.icon}</Text>
                <Text style={styles.exerciseTypeLabel}>{e.label}</Text>
                {isSelected && <Text style={styles.checkMark}>{'\u2713'}</Text>}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Per-exercise settings */}
        {selectedExercises.map((ex) => {
          const info = exerciseTypes.find((e) => e.value === ex.type);
          return (
            <View key={ex.type} style={styles.exerciseCard}>
              <View style={styles.exerciseCardHeader}>
                <Text style={styles.exerciseCardTitle}>
                  {info?.icon} {info?.label}
                </Text>
                <TouchableOpacity onPress={() => toggleExerciseType(ex.type)}>
                  <Text style={styles.exerciseCardRemove}>{'\u2715'}</Text>
                </TouchableOpacity>
              </View>

              {/* Duration */}
              <Text style={styles.subLabel}>Duration</Text>
              <View style={styles.durationRow}>
                <TouchableOpacity
                  onPress={() => updateExerciseDuration(ex.type, Math.max(5, ex.duration - 5))}
                  style={styles.roundButton}
                >
                  <Text style={styles.roundButtonText}>-</Text>
                </TouchableOpacity>
                <View style={styles.durationDisplay}>
                  <Text style={styles.durationValue}>{ex.duration}</Text>
                  <Text style={styles.durationUnit}>min</Text>
                </View>
                <TouchableOpacity
                  onPress={() => updateExerciseDuration(ex.type, ex.duration + 5)}
                  style={styles.roundButton}
                >
                  <Text style={styles.roundButtonText}>+</Text>
                </TouchableOpacity>
              </View>

              {/* Intensity */}
              <Text style={styles.subLabel}>Intensity</Text>
              <View style={styles.intensityRow}>
                {intensityLevels.map((lv) => {
                  const selected = ex.intensity === lv.value;
                  return (
                    <TouchableOpacity
                      key={lv.value}
                      onPress={() => updateExerciseIntensity(ex.type, lv.value)}
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
            </View>
          );
        })}

        {/* Total summary */}
        {selectedExercises.length > 1 && (
          <View style={styles.totalSummary}>
            <Text style={styles.totalSummaryText}>
              {'\u{1F4CA}'} {selectedExercises.length} exercises selected {'\u2022'} Total: {totalDuration} min
            </Text>
          </View>
        )}

        <GradientButton
          title={`\u{1F3C3} Save Exercise${selectedExercises.length > 1 ? `s (${selectedExercises.length})` : ''}`}
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
          {photos.map((uri, i) => (
            <View key={i} style={styles.photoContainer}>
              <Image source={{ uri }} style={styles.photoImage} />
              <TouchableOpacity
                style={styles.photoRemoveButton}
                onPress={() => removePhoto(i)}
              >
                <Text style={styles.photoRemoveText}>{'\u2715'}</Text>
              </TouchableOpacity>
            </View>
          ))}
          {photos.length < 4 && (
            <TouchableOpacity style={styles.photoPlaceholder} onPress={showPhotoOptions}>
              <Text style={styles.photoPlus}>+</Text>
              <Text style={styles.photoAddLabel}>Add</Text>
            </TouchableOpacity>
          )}
        </View>
        <GradientButton
          title={'\u{1F50D} Analyze with AI'}
          onPress={showPhotoOptions}
        />
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
  subLabel: {
    fontSize: 12,
    color: '#8B7355',
    marginBottom: 6,
    marginTop: 8,
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
  checkMark: {
    fontSize: 14,
    color: Colors.orange,
    fontWeight: '700',
    marginLeft: 2,
  },
  // Per-exercise card
  exerciseCard: {
    backgroundColor: Colors.orangeBg,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.orange + '40',
  },
  exerciseCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  exerciseCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.orange,
  },
  exerciseCardRemove: {
    fontSize: 16,
    color: '#999',
    padding: 4,
  },
  // Duration
  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 4,
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
    marginBottom: 4,
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
  // Total summary
  totalSummary: {
    backgroundColor: '#FFF3EC',
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
    alignItems: 'center',
  },
  totalSummaryText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.orange,
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
  // Photos
  photoRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  photoContainer: {
    width: 72,
    height: 72,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  photoImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  photoRemoveButton: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoRemoveText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  photoPlaceholder: {
    width: 72,
    height: 72,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
    backgroundColor: '#FAF5EC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoPlus: {
    fontSize: 20,
    color: Colors.primary,
  },
  photoAddLabel: {
    fontSize: 9,
    color: Colors.primary,
    marginTop: 2,
  },
  // Feelings
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

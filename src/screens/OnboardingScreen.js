import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../context/AppContext';
import { onboardingQuestions } from '../constants/data';
import { Colors } from '../constants/theme';
import analytics from '../utils/analytics';

export default function OnboardingScreen() {
  const {
    onboardingStep,
    setOnboardingStep,
    userProfile,
    updateProfile,
    toggleIssue,
    completeOnboarding,
  } = useApp();

  const q = onboardingQuestions[onboardingStep];
  const progress = ((onboardingStep + 1) / onboardingQuestions.length) * 100;

  const isCurrentStepValid = () => {
    if (['welcome', 'complete', 'time'].includes(q.type)) return true;
    if (q.type === 'input') return userProfile[q.field]?.trim().length > 0;
    return userProfile[q.field]?.length > 0;
  };

  const nextStep = () => {
    analytics.track('Onboarding Step', { step: onboardingStep + 1 });
    if (onboardingStep < onboardingQuestions.length - 1) {
      setOnboardingStep((prev) => prev + 1);
    } else {
      analytics.track('Onboarding Completed');
      completeOnboarding();
    }
  };

  const prevStep = () => {
    if (onboardingStep > 0) setOnboardingStep((prev) => prev - 1);
  };

  const renderWelcome = () => (
    <View style={styles.centerContent}>
      <Text style={styles.welcomeEmoji}>{'\u{1F33F}'}</Text>
      <Text style={styles.welcomeTitle}>Welcome to GutBuddy!</Text>
      <Text style={styles.welcomeSubtitle}>
        AI-powered gut health + fitness companion
      </Text>
    </View>
  );

  const renderComplete = () => (
    <View style={styles.centerContent}>
      <Text style={styles.welcomeEmoji}>{'\u{1F389}'}</Text>
      <Text style={styles.welcomeTitle}>You're all set!</Text>
      <Text style={styles.welcomeSubtitle}>
        Let's start your gut + fitness journey!
      </Text>
    </View>
  );

  const renderInput = () => (
    <View>
      <Text style={styles.questionTitle}>{q.title}</Text>
      <TextInput
        value={userProfile[q.field] || ''}
        onChangeText={(text) => updateProfile(q.field, text)}
        placeholder={q.placeholder}
        placeholderTextColor="#bbb"
        style={styles.textInput}
      />
    </View>
  );

  const renderChoice = () => (
    <View>
      <Text style={styles.questionTitle}>{q.title}</Text>
      <View style={styles.optionsList}>
        {q.options.map((opt) => {
          const selected = userProfile[q.field] === opt.value;
          return (
            <TouchableOpacity
              key={opt.value}
              onPress={() => updateProfile(q.field, opt.value)}
              style={[
                styles.optionButton,
                selected && styles.optionButtonSelected,
              ]}
              activeOpacity={0.7}
            >
              <Text style={styles.optionIcon}>{opt.icon}</Text>
              <Text style={styles.optionLabel}>{opt.label}</Text>
              {selected && (
                <Text style={styles.checkMark}>{'\u2713'}</Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  const renderMultiChoice = () => (
    <View>
      <Text style={styles.questionTitle}>{q.title}</Text>
      <View style={styles.multiChoiceContainer}>
        {q.options.map((opt) => {
          const selected = userProfile.issues.includes(opt.value);
          return (
            <TouchableOpacity
              key={opt.value}
              onPress={() => toggleIssue(opt.value)}
              style={[
                styles.chipButton,
                selected && styles.chipButtonSelected,
              ]}
              activeOpacity={0.7}
            >
              <Text style={styles.chipIcon}>{opt.icon}</Text>
              <Text style={styles.chipLabel}>{opt.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  const renderTime = () => (
    <View>
      <Text style={styles.questionTitle}>{q.title}</Text>
      <View style={styles.timeContainer}>
        <Text style={styles.timeDisplay}>{userProfile.notificationTime}</Text>
        <View style={styles.timeButtons}>
          {['07:00', '08:00', '09:00', '10:00', '20:00', '21:00'].map((t) => (
            <TouchableOpacity
              key={t}
              onPress={() => updateProfile('notificationTime', t)}
              style={[
                styles.timeChip,
                userProfile.notificationTime === t && styles.timeChipSelected,
              ]}
            >
              <Text
                style={[
                  styles.timeChipText,
                  userProfile.notificationTime === t && styles.timeChipTextSelected,
                ]}
              >
                {t}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );

  const valid = isCurrentStepValid();
  const isLast = onboardingStep === onboardingQuestions.length - 1;

  return (
    <LinearGradient
      colors={[Colors.green, Colors.background]}
      style={styles.container}
    >
      <View style={styles.progressContainer}>
        <View style={styles.progressTrack}>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>
          {onboardingStep + 1} / {onboardingQuestions.length}
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {q.type === 'welcome' && renderWelcome()}
        {q.type === 'input' && renderInput()}
        {q.type === 'choice' && renderChoice()}
        {q.type === 'multiChoice' && renderMultiChoice()}
        {q.type === 'time' && renderTime()}
        {q.type === 'complete' && renderComplete()}
      </ScrollView>

      <View style={styles.footer}>
        {onboardingStep > 0 && (
          <TouchableOpacity
            onPress={prevStep}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={nextStep}
          disabled={!valid}
          activeOpacity={0.8}
          style={[styles.nextButtonWrapper, { flex: onboardingStep > 0 ? 2 : 1 }]}
        >
          <LinearGradient
            colors={valid ? [Colors.primary, Colors.primaryDark] : ['#E8E0D5', '#E8E0D5']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.nextButton}
          >
            <Text style={[styles.nextButtonText, !valid && styles.nextButtonTextDisabled]}>
              {isLast ? "Let's Go! \u{1F680}" : 'Continue'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  progressContainer: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 8,
  },
  progressTrack: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 3,
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 3,
  },
  progressText: {
    textAlign: 'right',
    fontSize: 12,
    color: '#888',
    marginTop: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  centerContent: {
    alignItems: 'center',
  },
  welcomeEmoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.textDark,
    marginBottom: 12,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  questionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.textDark,
    marginBottom: 24,
  },
  textInput: {
    padding: 16,
    fontSize: 18,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: 12,
    textAlign: 'center',
    backgroundColor: Colors.white,
  },
  optionsList: {
    gap: 10,
  },
  optionButton: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  optionButtonSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.warmBg,
  },
  optionIcon: {
    fontSize: 24,
  },
  optionLabel: {
    fontSize: 16,
    flex: 1,
  },
  checkMark: {
    color: Colors.primary,
    fontWeight: '700',
    fontSize: 18,
  },
  multiChoiceContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chipButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  chipButtonSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.warmBg,
  },
  chipIcon: {
    fontSize: 16,
  },
  chipLabel: {
    fontSize: 14,
  },
  timeContainer: {
    alignItems: 'center',
  },
  timeDisplay: {
    fontSize: 36,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 20,
  },
  timeButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  timeChip: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  timeChipSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.warmBg,
  },
  timeChipText: {
    fontSize: 16,
    color: Colors.textMuted,
  },
  timeChipTextSelected: {
    color: Colors.primary,
    fontWeight: '600',
  },
  footer: {
    paddingHorizontal: 28,
    paddingBottom: 40,
    paddingTop: 16,
    flexDirection: 'row',
    gap: 12,
  },
  backButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    color: Colors.textDark,
  },
  nextButtonWrapper: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  nextButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
  },
  nextButtonTextDisabled: {
    color: '#999',
  },
});

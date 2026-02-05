import React, { createContext, useState, useContext, useEffect } from 'react';
import analytics from '../utils/analytics';
import {
  levels,
  feelings,
  initialExerciseRecords,
  initialDailyRecords,
} from '../constants/data';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [userProfile, setUserProfile] = useState({
    nickname: '',
    gender: '',
    goal: '',
    issues: [],
    stoolFrequency: '',
    notificationTime: '09:00',
  });

  const [activeTab, setActiveTab] = useState('home');
  const [activeMeal, setActiveMeal] = useState('lunch');
  const [currentPlan, setCurrentPlan] = useState('Basic');
  const [chatMessages, setChatMessages] = useState([
    {
      role: 'assistant',
      content:
        "Hi! I'm your gut health AI assistant. Ask me anything about digestive wellness or how exercise affects your gut! \u{1F33F}",
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().getDate());
  const [todayFeeling, setTodayFeeling] = useState('');
  const [todayMemo, setTodayMemo] = useState('');
  const [todayStoolCount, setTodayStoolCount] = useState(0);
  const [showSaved, setShowSaved] = useState(false);
  const [showAnalyticsPanel, setShowAnalyticsPanel] = useState(false);

  const [userLevel, setUserLevel] = useState(3);
  const [userExp, setUserExp] = useState(65);
  const [streak] = useState(7);
  const [totalDays] = useState(23);

  // Fitness state
  const [stravaConnected, setStravaConnected] = useState(false);
  const [showStravaModal, setShowStravaModal] = useState(false);
  const [exerciseType, setExerciseType] = useState('');
  const [exerciseDuration, setExerciseDuration] = useState(30);
  const [exerciseIntensity, setExerciseIntensity] = useState('');
  const [showExerciseSaved, setShowExerciseSaved] = useState(false);

  const [exerciseRecords, setExerciseRecords] = useState(initialExerciseRecords);
  const [dailyRecords, setDailyRecords] = useState(initialDailyRecords);

  useEffect(() => {
    analytics.track('App Opened');
  }, []);

  // Handlers
  const updateProfile = (field, value) =>
    setUserProfile((prev) => ({ ...prev, [field]: value }));

  const toggleIssue = (value) =>
    setUserProfile((prev) => ({
      ...prev,
      issues: prev.issues.includes(value)
        ? prev.issues.filter((i) => i !== value)
        : [...prev.issues, value],
    }));

  const getCurrentLevel = () => levels.find((l) => l.level === userLevel) || levels[0];
  const getNextLevel = () => levels.find((l) => l.level === userLevel + 1);
  const getExpProgress = () => {
    const c = getCurrentLevel();
    const n = getNextLevel();
    return n ? Math.min(100, Math.round(((userExp - c.exp) / (n.exp - c.exp)) * 100)) : 100;
  };

  const saveTodayRecord = () => {
    if (!todayFeeling) return;
    const today = new Date().getDate();
    const fd = feelings.find((f) => `${f.emoji} ${f.label}` === todayFeeling);
    setDailyRecords((prev) => ({
      ...prev,
      [today]: {
        feeling: todayFeeling,
        score: fd?.score || 70,
        memo: todayMemo,
        stoolCount: todayStoolCount,
      },
    }));
    setUserExp((prev) => Math.min(prev + 5, 500));
    analytics.track('Daily Log Saved', { feeling: todayFeeling, stoolCount: todayStoolCount });
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2000);
  };

  const saveExercise = () => {
    if (!exerciseType || !exerciseIntensity) return;
    const today = new Date().getDate();
    const calMap = { run: 9, walk: 4, cycle: 7, swim: 8, yoga: 3, strength: 6 };
    const intMult = { light: 0.7, moderate: 1, hard: 1.3, extreme: 1.6 };
    const cal = Math.round(
      (calMap[exerciseType] || 5) * exerciseDuration * (intMult[exerciseIntensity] || 1)
    );
    setExerciseRecords((prev) => ({
      ...prev,
      [today]: {
        type: exerciseType,
        duration: exerciseDuration,
        intensity: exerciseIntensity,
        calories: cal,
        source: 'manual',
      },
    }));
    setUserExp((prev) => Math.min(prev + 3, 500));
    analytics.track('Exercise Logged', {
      type: exerciseType,
      duration: exerciseDuration,
      intensity: exerciseIntensity,
      calories: cal,
    });
    setShowExerciseSaved(true);
    setTimeout(() => setShowExerciseSaved(false), 2000);
    setExerciseType('');
    setExerciseIntensity('');
  };

  const handleStravaConnect = () => {
    analytics.track('Strava Connect Clicked');
    setShowStravaModal(true);
    setTimeout(() => {
      setStravaConnected(true);
      setShowStravaModal(false);
      analytics.track('Strava Connected');
    }, 2000);
  };

  const handleTabChange = (tab) => {
    analytics.track('Tab Viewed', { tab });
    setActiveTab(tab);
  };

  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    setChatMessages((prev) => [...prev, { role: 'user', content: chatInput }]);
    const q = chatInput;
    setChatInput('');
    analytics.track('Chat Sent', { len: q.length });
    setTimeout(() => {
      const responses = [
        'Based on your data, morning runs correlate with 12% better gut scores the next day! Try maintaining your 7AM routine. \u{1F3C3}',
        'I notice your gut score drops after high-intensity workouts. Try eating easily digestible foods on those days. \u{1F963}',
        'Your best gut days happen when you combine moderate exercise (30min) with 7+ hours of sleep. Keep it up! \u{1F634}',
        'Yoga days show the lowest bloating reports. Consider adding 2-3 yoga sessions per week for gut comfort. \u{1F9D8}',
      ];
      setChatMessages((prev) => [
        ...prev,
        { role: 'assistant', content: responses[Math.floor(Math.random() * responses.length)] },
      ]);
    }, 1000);
  };

  // Computed values
  const gutHealth = 72;
  const totalRecords = Object.keys(dailyRecords).length;
  const monthlyAvg = Math.round(
    Object.values(dailyRecords).reduce((a, r) => a + r.score, 0) / totalRecords
  );
  const goodDays = Object.values(dailyRecords).filter((r) => r.score >= 75).length;
  const okayDays = Object.values(dailyRecords).filter(
    (r) => r.score >= 60 && r.score < 75
  ).length;
  const badDays = Object.values(dailyRecords).filter((r) => r.score < 60).length;
  const goodPct = Math.round((goodDays / totalRecords) * 100);
  const okayPct = Math.round((okayDays / totalRecords) * 100);
  const badPct = Math.round((badDays / totalRecords) * 100);
  const totalBowel = Object.values(dailyRecords).reduce((a, r) => a + r.stoolCount, 0);
  const totalExerciseDays = Object.keys(exerciseRecords).length;
  const totalCalories = Object.values(exerciseRecords).reduce((a, r) => a + r.calories, 0);
  const avgDuration = Math.round(
    Object.values(exerciseRecords).reduce((a, r) => a + r.duration, 0) / totalExerciseDays
  );

  const exerciseDayScores = Object.keys(exerciseRecords)
    .filter((d) => dailyRecords[d])
    .map((d) => dailyRecords[d].score);
  const noExerciseDayScores = Object.keys(dailyRecords)
    .filter((d) => !exerciseRecords[d])
    .map((d) => dailyRecords[d].score);
  const avgExerciseGut = exerciseDayScores.length
    ? Math.round(exerciseDayScores.reduce((a, b) => a + b, 0) / exerciseDayScores.length)
    : 0;
  const avgNoExerciseGut = noExerciseDayScores.length
    ? Math.round(noExerciseDayScores.reduce((a, b) => a + b, 0) / noExerciseDayScores.length)
    : 0;
  const correlationScore = Math.min(
    95,
    Math.max(30, Math.round(50 + (avgExerciseGut - avgNoExerciseGut) * 1.5))
  );

  const currentLevelInfo = getCurrentLevel();
  const nextLevelInfo = getNextLevel();
  const todayExercise = exerciseRecords[new Date().getDate()];

  const value = {
    // Onboarding
    showOnboarding,
    setShowOnboarding,
    onboardingStep,
    setOnboardingStep,
    userProfile,
    updateProfile,
    toggleIssue,
    // Navigation
    activeTab,
    handleTabChange,
    // Meal
    activeMeal,
    setActiveMeal,
    // Plan
    currentPlan,
    setCurrentPlan,
    // Chat
    chatMessages,
    chatInput,
    setChatInput,
    handleSendChat,
    // Calendar
    selectedDate,
    setSelectedDate,
    // Daily log
    todayFeeling,
    setTodayFeeling,
    todayMemo,
    setTodayMemo,
    todayStoolCount,
    setTodayStoolCount,
    showSaved,
    saveTodayRecord,
    // Analytics panel
    showAnalyticsPanel,
    setShowAnalyticsPanel,
    // Level
    userLevel,
    userExp,
    streak,
    totalDays,
    currentLevelInfo,
    nextLevelInfo,
    getExpProgress,
    // Fitness
    stravaConnected,
    setStravaConnected,
    showStravaModal,
    exerciseType,
    setExerciseType,
    exerciseDuration,
    setExerciseDuration,
    exerciseIntensity,
    setExerciseIntensity,
    showExerciseSaved,
    saveExercise,
    handleStravaConnect,
    // Records
    exerciseRecords,
    dailyRecords,
    // Computed
    gutHealth,
    totalRecords,
    monthlyAvg,
    goodDays,
    okayDays,
    badDays,
    goodPct,
    okayPct,
    badPct,
    totalBowel,
    totalExerciseDays,
    totalCalories,
    avgDuration,
    avgExerciseGut,
    avgNoExerciseGut,
    correlationScore,
    todayExercise,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

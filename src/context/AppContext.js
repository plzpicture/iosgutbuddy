import React, { createContext, useState, useContext, useEffect } from 'react';
import analytics from '../utils/analytics';
import {
  levels,
  feelings,
  exerciseTypes,
  initialExerciseRecords,
  initialDailyRecords,
} from '../constants/data';

const CLAUDE_API_KEY = ''; // Set your Anthropic Claude API key here

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
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [chatMessages, setChatMessages] = useState([
    {
      role: 'assistant',
      content:
        "Hi! I'm your gut health AI assistant. Ask me anything about digestive wellness or how exercise affects your gut! \u{1F33F}",
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().getDate());
  const [todayFeeling, setTodayFeeling] = useState('');
  const [todayMemo, setTodayMemo] = useState('');
  const [todayStoolCount, setTodayStoolCount] = useState(0);
  const [showSaved, setShowSaved] = useState(false);
  const [showAnalyticsPanel, setShowAnalyticsPanel] = useState(false);
  const [photos, setPhotos] = useState([]);

  const [userLevel, setUserLevel] = useState(3);
  const [userExp, setUserExp] = useState(65);
  const [streak] = useState(7);
  const [totalDays] = useState(23);

  // Multi-exercise: array of { type, duration, intensity }
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [showExerciseSaved, setShowExerciseSaved] = useState(false);

  // Fitness
  const [stravaConnected, setStravaConnected] = useState(false);
  const [showStravaModal, setShowStravaModal] = useState(false);

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

  // Multi-exercise handlers
  const toggleExerciseType = (type) => {
    setSelectedExercises((prev) => {
      const exists = prev.find((e) => e.type === type);
      if (exists) {
        return prev.filter((e) => e.type !== type);
      }
      return [...prev, { type, duration: 30, intensity: 'moderate' }];
    });
  };

  const updateExerciseDuration = (type, duration) => {
    setSelectedExercises((prev) =>
      prev.map((e) => (e.type === type ? { ...e, duration } : e))
    );
  };

  const updateExerciseIntensity = (type, intensity) => {
    setSelectedExercises((prev) =>
      prev.map((e) => (e.type === type ? { ...e, intensity } : e))
    );
  };

  const saveExercise = () => {
    if (selectedExercises.length === 0) return;
    const today = new Date().getDate();
    const calMap = { run: 9, walk: 4, cycle: 7, swim: 8, yoga: 3, strength: 6 };
    const intMult = { light: 0.7, moderate: 1, hard: 1.3, extreme: 1.6 };

    const totalDuration = selectedExercises.reduce((a, e) => a + e.duration, 0);
    const totalCal = selectedExercises.reduce((a, e) => {
      return a + Math.round((calMap[e.type] || 5) * e.duration * (intMult[e.intensity] || 1));
    }, 0);

    setExerciseRecords((prev) => ({
      ...prev,
      [today]: {
        exercises: selectedExercises,
        type: selectedExercises[0].type,
        duration: totalDuration,
        intensity: selectedExercises[0].intensity,
        calories: totalCal,
        source: 'manual',
      },
    }));
    setUserExp((prev) => Math.min(prev + 3, 500));
    analytics.track('Exercise Logged', {
      count: selectedExercises.length,
      totalDuration,
      calories: totalCal,
    });
    setShowExerciseSaved(true);
    setTimeout(() => setShowExerciseSaved(false), 2000);
    setSelectedExercises([]);
  };

  // Photo handlers
  const addPhoto = (uri) => {
    setPhotos((prev) => [...prev, uri]);
  };

  const removePhoto = (index) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
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

  // Chat with Claude API or fallback
  const handleSendChat = async () => {
    if (!chatInput.trim()) return;
    const userMessage = chatInput.trim();
    setChatMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setChatInput('');
    setChatLoading(true);
    analytics.track('Chat Sent', { len: userMessage.length });

    if (CLAUDE_API_KEY) {
      try {
        const recentMessages = chatMessages
          .filter((m) => m.role === 'user' || m.role === 'assistant')
          .slice(-6)
          .map((m) => ({ role: m.role, content: m.content }));
        recentMessages.push({ role: 'user', content: userMessage });

        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': CLAUDE_API_KEY,
            'anthropic-version': '2023-06-01',
            'anthropic-dangerous-direct-browser-access': 'true',
          },
          body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 300,
            system: 'You are GutBuddy AI, a friendly gut health and fitness assistant. Give concise, helpful advice about digestive wellness, exercise-gut correlations, and healthy habits. Keep responses under 100 words. Use occasional emojis.',
            messages: recentMessages,
          }),
        });

        const data = await response.json();
        if (data.content?.[0]?.text) {
          setChatMessages((prev) => [
            ...prev,
            { role: 'assistant', content: data.content[0].text },
          ]);
        } else {
          throw new Error(data.error?.message || 'No response');
        }
      } catch (error) {
        setChatMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content:
              'Sorry, I had trouble connecting. Please check your API key or try again later.',
          },
        ]);
      }
    } else {
      // Fallback mock responses when no API key
      setTimeout(() => {
        const responses = [
          'Based on your data, morning runs correlate with 12% better gut scores the next day! Try maintaining your 7AM routine. \u{1F3C3}',
          'I notice your gut score drops after high-intensity workouts. Try eating easily digestible foods on those days. \u{1F963}',
          'Your best gut days happen when you combine moderate exercise (30min) with 7+ hours of sleep. Keep it up! \u{1F634}',
          'Yoga days show the lowest bloating reports. Consider adding 2-3 yoga sessions per week for gut comfort. \u{1F9D8}',
        ];
        setChatMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content:
              responses[Math.floor(Math.random() * responses.length)] +
              '\n\n(Offline mode \u2014 connect Claude API key for real AI responses)',
          },
        ]);
      }, 800);
    }
    setChatLoading(false);
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

  const isClaudeConnected = !!CLAUDE_API_KEY;

  const value = {
    showOnboarding, setShowOnboarding,
    onboardingStep, setOnboardingStep,
    userProfile, updateProfile, toggleIssue,
    activeTab, handleTabChange,
    activeMeal, setActiveMeal,
    currentPlan, setCurrentPlan,
    billingCycle, setBillingCycle,
    chatMessages, chatInput, setChatInput, handleSendChat, chatLoading, isClaudeConnected,
    selectedDate, setSelectedDate,
    todayFeeling, setTodayFeeling,
    todayMemo, setTodayMemo,
    todayStoolCount, setTodayStoolCount,
    showSaved, saveTodayRecord,
    showAnalyticsPanel, setShowAnalyticsPanel,
    photos, addPhoto, removePhoto,
    userLevel, userExp, streak, totalDays,
    currentLevelInfo, nextLevelInfo, getExpProgress,
    stravaConnected, setStravaConnected, showStravaModal, handleStravaConnect,
    selectedExercises, toggleExerciseType, updateExerciseDuration, updateExerciseIntensity,
    showExerciseSaved, saveExercise,
    exerciseRecords, dailyRecords,
    gutHealth, totalRecords, monthlyAvg,
    goodDays, okayDays, badDays, goodPct, okayPct, badPct,
    totalBowel, totalExerciseDays, totalCalories, avgDuration,
    avgExerciseGut, avgNoExerciseGut, correlationScore, todayExercise,
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

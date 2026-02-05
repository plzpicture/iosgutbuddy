import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import analytics from '../utils/analytics';
import { supabase } from '../lib/supabase';
import {
  getProfile,
  updateProfile as updateProfileDB,
  getDailyRecords,
  upsertDailyRecord,
  getExerciseRecords,
  upsertExerciseRecord,
  getChatMessages,
  saveChatMessage,
} from '../lib/database';
import {
  levels,
  feelings,
  exerciseTypes,
  initialExerciseRecords,
  initialDailyRecords,
} from '../constants/data';

const CLAUDE_API_KEY = process.env.EXPO_PUBLIC_CLAUDE_API_KEY || '';

const AppContext = createContext();

export function AppProvider({ children }) {
  // Auth state
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [showOnboarding, setShowOnboarding] = useState(false);
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

  const [userLevel, setUserLevel] = useState(1);
  const [userExp, setUserExp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [totalDays, setTotalDays] = useState(0);

  // Multi-exercise: array of { type, duration, intensity }
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [showExerciseSaved, setShowExerciseSaved] = useState(false);

  // Fitness
  const [stravaConnected, setStravaConnected] = useState(false);
  const [showStravaModal, setShowStravaModal] = useState(false);

  const [exerciseRecords, setExerciseRecords] = useState({});
  const [dailyRecords, setDailyRecords] = useState({});

  // ── Auth listener ──────────────────────────────────────
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });

    return () => subscription.unsubscribe();
  }, []);

  // ── Load user data from Supabase when session changes ──
  const loadUserData = useCallback(async (userId) => {
    try {
      // Load profile
      const profile = await getProfile(userId);
      if (profile) {
        setUserProfile({
          nickname: profile.nickname || '',
          gender: profile.gender || '',
          goal: profile.goal || '',
          issues: profile.issues || [],
          stoolFrequency: profile.stool_frequency || '',
          notificationTime: profile.notification_time || '09:00',
        });
        setUserLevel(profile.level || 1);
        setUserExp(profile.exp || 0);
        setStreak(profile.streak || 0);
        setCurrentPlan(profile.current_plan || 'Basic');
        setBillingCycle(profile.billing_cycle || 'monthly');
        setStravaConnected(profile.strava_connected || false);
        setShowOnboarding(!profile.onboarding_completed);
      }

      // Load daily records → convert to { day: { feeling, score, memo, stoolCount } }
      const dailyData = await getDailyRecords(userId);
      const dailyMap = {};
      dailyData.forEach((r) => {
        const day = new Date(r.date).getDate();
        dailyMap[day] = {
          feeling: r.feeling,
          score: r.score,
          memo: r.memo,
          stoolCount: r.stool_count,
        };
      });
      setDailyRecords(Object.keys(dailyMap).length > 0 ? dailyMap : initialDailyRecords);
      setTotalDays(Object.keys(dailyMap).length || Object.keys(initialDailyRecords).length);

      // Load exercise records
      const exerciseData = await getExerciseRecords(userId);
      const exerciseMap = {};
      exerciseData.forEach((r) => {
        const day = new Date(r.date).getDate();
        exerciseMap[day] = {
          exercises: r.exercises || [],
          type: r.exercises?.[0]?.type || 'run',
          duration: r.total_duration,
          intensity: r.exercises?.[0]?.intensity || 'moderate',
          calories: r.total_calories,
          source: r.source,
        };
      });
      setExerciseRecords(
        Object.keys(exerciseMap).length > 0 ? exerciseMap : initialExerciseRecords
      );

      // Load chat messages
      const msgs = await getChatMessages(userId);
      if (msgs.length > 0) {
        setChatMessages(msgs.map((m) => ({ role: m.role, content: m.content })));
      }
    } catch (error) {
      console.log('Error loading user data:', error.message);
      // Use initial data as fallback
      setDailyRecords(initialDailyRecords);
      setExerciseRecords(initialExerciseRecords);
      setShowOnboarding(true);
    }
  }, []);

  useEffect(() => {
    if (session?.user?.id) {
      loadUserData(session.user.id);
      analytics.track('App Opened', { userId: session.user.id });
    }
  }, [session, loadUserData]);

  // ── Sign out ───────────────────────────────────────────
  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setChatMessages([
      {
        role: 'assistant',
        content:
          "Hi! I'm your gut health AI assistant. Ask me anything about digestive wellness or how exercise affects your gut! \u{1F33F}",
      },
    ]);
  };

  // ── Handlers ───────────────────────────────────────────
  const updateProfile = (field, value) =>
    setUserProfile((prev) => ({ ...prev, [field]: value }));

  const toggleIssue = (value) =>
    setUserProfile((prev) => ({
      ...prev,
      issues: prev.issues.includes(value)
        ? prev.issues.filter((i) => i !== value)
        : [...prev.issues, value],
    }));

  const completeOnboarding = async () => {
    setShowOnboarding(false);
    if (session?.user?.id) {
      try {
        await updateProfileDB(session.user.id, {
          nickname: userProfile.nickname,
          gender: userProfile.gender,
          goal: userProfile.goal,
          issues: userProfile.issues,
          stool_frequency: userProfile.stoolFrequency,
          notification_time: userProfile.notificationTime,
          onboarding_completed: true,
        });
      } catch (error) {
        console.log('Error saving profile:', error.message);
      }
    }
  };

  const getCurrentLevel = () => levels.find((l) => l.level === userLevel) || levels[0];
  const getNextLevel = () => levels.find((l) => l.level === userLevel + 1);
  const getExpProgress = () => {
    const c = getCurrentLevel();
    const n = getNextLevel();
    return n ? Math.min(100, Math.round(((userExp - c.exp) / (n.exp - c.exp)) * 100)) : 100;
  };

  const saveTodayRecord = async () => {
    if (!todayFeeling) return;
    const today = new Date().getDate();
    const fd = feelings.find((f) => `${f.emoji} ${f.label}` === todayFeeling);
    const record = {
      feeling: todayFeeling,
      score: fd?.score || 70,
      memo: todayMemo,
      stoolCount: todayStoolCount,
    };
    setDailyRecords((prev) => ({ ...prev, [today]: record }));

    const newExp = Math.min(userExp + 5, 500);
    setUserExp(newExp);
    analytics.track('Daily Log Saved', { feeling: todayFeeling, stoolCount: todayStoolCount });
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2000);

    // Persist to Supabase
    if (session?.user?.id) {
      const dateStr = new Date().toISOString().split('T')[0];
      try {
        await upsertDailyRecord(session.user.id, {
          date: dateStr,
          feeling: todayFeeling,
          score: fd?.score || 70,
          memo: todayMemo,
          stool_count: todayStoolCount,
        });
        await updateProfileDB(session.user.id, { exp: newExp });
      } catch (error) {
        console.log('Error saving daily record:', error.message);
      }
    }
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

  const saveExercise = async () => {
    if (selectedExercises.length === 0) return;
    const today = new Date().getDate();
    const calMap = { run: 9, walk: 4, cycle: 7, swim: 8, yoga: 3, strength: 6 };
    const intMult = { light: 0.7, moderate: 1, hard: 1.3, extreme: 1.6 };

    const totalDurationVal = selectedExercises.reduce((a, e) => a + e.duration, 0);
    const totalCal = selectedExercises.reduce((a, e) => {
      return a + Math.round((calMap[e.type] || 5) * e.duration * (intMult[e.intensity] || 1));
    }, 0);

    setExerciseRecords((prev) => ({
      ...prev,
      [today]: {
        exercises: selectedExercises,
        type: selectedExercises[0].type,
        duration: totalDurationVal,
        intensity: selectedExercises[0].intensity,
        calories: totalCal,
        source: 'manual',
      },
    }));

    const newExp = Math.min(userExp + 3, 500);
    setUserExp(newExp);
    analytics.track('Exercise Logged', {
      count: selectedExercises.length,
      totalDuration: totalDurationVal,
      calories: totalCal,
    });
    setShowExerciseSaved(true);
    setTimeout(() => setShowExerciseSaved(false), 2000);

    // Persist to Supabase
    if (session?.user?.id) {
      const dateStr = new Date().toISOString().split('T')[0];
      try {
        await upsertExerciseRecord(session.user.id, {
          date: dateStr,
          exercises: selectedExercises,
          total_duration: totalDurationVal,
          total_calories: totalCal,
          source: 'manual',
        });
        await updateProfileDB(session.user.id, { exp: newExp });
      } catch (error) {
        console.log('Error saving exercise:', error.message);
      }
    }

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
    setTimeout(async () => {
      setStravaConnected(true);
      setShowStravaModal(false);
      analytics.track('Strava Connected');
      if (session?.user?.id) {
        try {
          await updateProfileDB(session.user.id, { strava_connected: true });
        } catch (error) {
          console.log('Error updating strava:', error.message);
        }
      }
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

    // Save user message to Supabase
    if (session?.user?.id) {
      saveChatMessage(session.user.id, 'user', userMessage).catch(() => {});
    }

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
            system:
              'You are GutBuddy AI, a friendly gut health and fitness assistant. Give concise, helpful advice about digestive wellness, exercise-gut correlations, and healthy habits. Keep responses under 100 words. Use occasional emojis.',
            messages: recentMessages,
          }),
        });

        const data = await response.json();
        if (data.content?.[0]?.text) {
          const assistantMsg = data.content[0].text;
          setChatMessages((prev) => [
            ...prev,
            { role: 'assistant', content: assistantMsg },
          ]);
          if (session?.user?.id) {
            saveChatMessage(session.user.id, 'assistant', assistantMsg).catch(() => {});
          }
        } else {
          throw new Error(data.error?.message || 'No response');
        }
      } catch (error) {
        const errMsg =
          'Sorry, I had trouble connecting. Please check your API key or try again later.';
        setChatMessages((prev) => [...prev, { role: 'assistant', content: errMsg }]);
      }
    } else {
      setTimeout(() => {
        const responses = [
          'Based on your data, morning runs correlate with 12% better gut scores the next day! Try maintaining your 7AM routine. \u{1F3C3}',
          'I notice your gut score drops after high-intensity workouts. Try eating easily digestible foods on those days. \u{1F963}',
          'Your best gut days happen when you combine moderate exercise (30min) with 7+ hours of sleep. Keep it up! \u{1F634}',
          'Yoga days show the lowest bloating reports. Consider adding 2-3 yoga sessions per week for gut comfort. \u{1F9D8}',
        ];
        const fallbackMsg =
          responses[Math.floor(Math.random() * responses.length)] +
          '\n\n(Offline mode \u2014 connect Claude API key for real AI responses)';
        setChatMessages((prev) => [...prev, { role: 'assistant', content: fallbackMsg }]);
      }, 800);
    }
    setChatLoading(false);
  };

  // Computed values
  const gutHealth = 72;
  const totalRecords = Math.max(1, Object.keys(dailyRecords).length);
  const monthlyAvg = Math.round(
    Object.values(dailyRecords).reduce((a, r) => a + (r.score || 0), 0) / totalRecords
  );
  const goodDays = Object.values(dailyRecords).filter((r) => r.score >= 75).length;
  const okayDays = Object.values(dailyRecords).filter(
    (r) => r.score >= 60 && r.score < 75
  ).length;
  const badDays = Object.values(dailyRecords).filter((r) => r.score < 60).length;
  const goodPct = Math.round((goodDays / totalRecords) * 100);
  const okayPct = Math.round((okayDays / totalRecords) * 100);
  const badPct = Math.round((badDays / totalRecords) * 100);
  const totalBowel = Object.values(dailyRecords).reduce((a, r) => a + (r.stoolCount || 0), 0);
  const totalExerciseDays = Math.max(1, Object.keys(exerciseRecords).length);
  const totalCalories = Object.values(exerciseRecords).reduce(
    (a, r) => a + (r.calories || 0),
    0
  );
  const avgDuration = Math.round(
    Object.values(exerciseRecords).reduce((a, r) => a + (r.duration || 0), 0) / totalExerciseDays
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
    // Auth
    session, authLoading, signOut,
    showOnboarding, setShowOnboarding, completeOnboarding,
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

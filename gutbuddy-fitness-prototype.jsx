import { useState, useEffect } from 'react';

// ===== Amplitude Analytics =====
const analytics = {
  events: [],
  track: (event, props = {}) => {
    analytics.events.push({ event, ...props, timestamp: new Date().toISOString() });
    console.log(`[Amplitude] 📊 ${event}`, props);
  },
};

export default function GutBuddyApp() {
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [userProfile, setUserProfile] = useState({
    nickname: '', gender: '', goal: '', issues: [],
    stoolFrequency: '', notificationTime: '09:00'
  });

  const [activeTab, setActiveTab] = useState('home');
  const [activeMeal, setActiveMeal] = useState('lunch');
  const [currentPlan, setCurrentPlan] = useState('Basic');
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', content: "Hi! I'm your gut health AI assistant. Ask me anything about digestive wellness or how exercise affects your gut! 🌿" }
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

  // ===== FITNESS STATE =====
  const [stravaConnected, setStravaConnected] = useState(false);
  const [showStravaModal, setShowStravaModal] = useState(false);
  const [exerciseType, setExerciseType] = useState('');
  const [exerciseDuration, setExerciseDuration] = useState(30);
  const [exerciseIntensity, setExerciseIntensity] = useState('');
  const [showExerciseSaved, setShowExerciseSaved] = useState(false);

  const [exerciseRecords, setExerciseRecords] = useState({
    1: { type: 'run', duration: 30, intensity: 'moderate', calories: 280, source: 'strava' },
    2: { type: 'yoga', duration: 45, intensity: 'light', calories: 120, source: 'strava' },
    5: { type: 'run', duration: 25, intensity: 'moderate', calories: 240, source: 'manual' },
    7: { type: 'cycle', duration: 60, intensity: 'hard', calories: 450, source: 'strava' },
    8: { type: 'walk', duration: 40, intensity: 'light', calories: 150, source: 'manual' },
    10: { type: 'run', duration: 35, intensity: 'moderate', calories: 310, source: 'strava' },
    12: { type: 'strength', duration: 50, intensity: 'hard', calories: 380, source: 'strava' },
    14: { type: 'run', duration: 30, intensity: 'moderate', calories: 275, source: 'strava' },
    15: { type: 'swim', duration: 40, intensity: 'moderate', calories: 320, source: 'manual' },
    17: { type: 'yoga', duration: 30, intensity: 'light', calories: 90, source: 'strava' },
    19: { type: 'run', duration: 20, intensity: 'light', calories: 180, source: 'strava' },
    20: { type: 'cycle', duration: 45, intensity: 'moderate', calories: 350, source: 'strava' },
  });

  const [dailyRecords, setDailyRecords] = useState({
    1: { feeling: '😄 Great', score: 85, memo: 'Had yogurt', stoolCount: 1 },
    2: { feeling: '😊 Good', score: 75, memo: '', stoolCount: 2 },
    3: { feeling: '😐 Okay', score: 65, memo: '', stoolCount: 1 },
    5: { feeling: '😄 Great', score: 88, memo: '', stoolCount: 1 },
    7: { feeling: '😊 Good', score: 72, memo: '', stoolCount: 2 },
    8: { feeling: '😄 Great', score: 82, memo: 'Ate more fiber', stoolCount: 1 },
    10: { feeling: '😄 Great', score: 90, memo: 'Feeling amazing', stoolCount: 1 },
    12: { feeling: '😣 Bad', score: 55, memo: 'Bloated after pizza', stoolCount: 0 },
    14: { feeling: '😊 Good', score: 76, memo: '', stoolCount: 1 },
    15: { feeling: '😊 Good', score: 78, memo: '', stoolCount: 1 },
    17: { feeling: '😄 Great', score: 85, memo: 'Probiotics helped', stoolCount: 2 },
    19: { feeling: '😐 Okay', score: 62, memo: '', stoolCount: 1 },
    20: { feeling: '😊 Good', score: 74, memo: '', stoolCount: 1 },
  });

  useEffect(() => { analytics.track('App Opened'); }, []);

  // ===== CONSTANTS =====
  const exerciseTypes = [
    { icon: '🏃', label: 'Run', value: 'run' },
    { icon: '🚶', label: 'Walk', value: 'walk' },
    { icon: '🚴', label: 'Cycle', value: 'cycle' },
    { icon: '🏊', label: 'Swim', value: 'swim' },
    { icon: '🧘', label: 'Yoga', value: 'yoga' },
    { icon: '💪', label: 'Strength', value: 'strength' },
  ];
  const intensityLevels = [
    { label: 'Light', emoji: '🟢', value: 'light', color: '#4CAF50' },
    { label: 'Moderate', emoji: '🟡', value: 'moderate', color: '#FFC107' },
    { label: 'Hard', emoji: '🟠', value: 'hard', color: '#FF9800' },
    { label: 'Extreme', emoji: '🔴', value: 'extreme', color: '#F44336' },
  ];
  const getExerciseIcon = (type) => exerciseTypes.find(e => e.value === type)?.icon || '🏃';
  const getExerciseLabel = (type) => exerciseTypes.find(e => e.value === type)?.label || type;

  const levels = [
    { level: 1, name: 'Seed', icon: '🌰', exp: 0 },
    { level: 2, name: 'Sprout', icon: '🌱', exp: 50 },
    { level: 3, name: 'Seedling', icon: '🌿', exp: 100 },
    { level: 4, name: 'Sapling', icon: '🪴', exp: 200 },
    { level: 5, name: 'Tree', icon: '🌳', exp: 350 },
    { level: 6, name: 'Bloom', icon: '🌸', exp: 500 },
  ];

  const feelings = [
    { emoji: '😄', label: 'Great', score: 90 },
    { emoji: '😊', label: 'Good', score: 75 },
    { emoji: '😐', label: 'Okay', score: 60 },
    { emoji: '😣', label: 'Bad', score: 45 },
    { emoji: '😫', label: 'Terrible', score: 30 }
  ];

  const onboardingQuestions = [
    { id: 'welcome', type: 'welcome' },
    { id: 'nickname', type: 'input', title: "What should we call you? 😊", placeholder: 'Enter your name', field: 'nickname' },
    { id: 'gender', type: 'choice', title: 'What is your gender? 👤', field: 'gender', options: [{ value: 'male', label: 'Male', icon: '👨' }, { value: 'female', label: 'Female', icon: '👩' }, { value: 'other', label: 'Other', icon: '🧑' }] },
    { id: 'goal', type: 'choice', title: "What's your main goal? 🎯", field: 'goal', options: [{ value: 'constipation', label: 'Relieve constipation', icon: '💪' }, { value: 'diarrhea', label: 'Manage diarrhea', icon: '🩹' }, { value: 'regular', label: 'Regular movements', icon: '⏰' }, { value: 'overall', label: 'Overall gut health', icon: '🌟' }, { value: 'bloating', label: 'Reduce bloating', icon: '🎈' }] },
    { id: 'issues', type: 'multiChoice', title: 'Any current symptoms? 🩺', field: 'issues', options: [{ value: 'bloating', label: 'Bloating', icon: '🎈' }, { value: 'gas', label: 'Gas', icon: '💨' }, { value: 'pain', label: 'Pain', icon: '😣' }, { value: 'irregular', label: 'Irregular', icon: '📊' }, { value: 'none', label: 'None', icon: '✅' }] },
    { id: 'stoolFrequency', type: 'choice', title: 'How often do you go? 🚽', field: 'stoolFrequency', options: [{ value: 'daily2', label: '2+ daily', icon: '🔥' }, { value: 'daily1', label: 'Once daily', icon: '👍' }, { value: 'every2days', label: 'Every 2 days', icon: '😐' }, { value: 'weekly', label: '1-2 weekly', icon: '😰' }] },
    { id: 'notification', type: 'time', title: 'Set reminder time ⏰', field: 'notificationTime' },
    { id: 'complete', type: 'complete' }
  ];

  // ===== HANDLERS =====
  const updateProfile = (field, value) => setUserProfile(prev => ({ ...prev, [field]: value }));
  const toggleIssue = (value) => setUserProfile(prev => ({
    ...prev, issues: prev.issues.includes(value) ? prev.issues.filter(i => i !== value) : [...prev.issues, value]
  }));
  const nextStep = () => {
    analytics.track('Onboarding Step', { step: onboardingStep + 1 });
    onboardingStep < onboardingQuestions.length - 1 ? setOnboardingStep(prev => prev + 1) : (() => { analytics.track('Onboarding Completed'); setShowOnboarding(false); })();
  };
  const prevStep = () => onboardingStep > 0 && setOnboardingStep(prev => prev - 1);
  const isCurrentStepValid = () => {
    const q = onboardingQuestions[onboardingStep];
    if (['welcome', 'complete', 'time'].includes(q.type)) return true;
    if (q.type === 'input') return userProfile[q.field]?.trim().length > 0;
    return userProfile[q.field]?.length > 0;
  };

  const getCurrentLevel = () => levels.find(l => l.level === userLevel) || levels[0];
  const getNextLevel = () => levels.find(l => l.level === userLevel + 1);
  const getExpProgress = () => { const c = getCurrentLevel(), n = getNextLevel(); return n ? Math.min(100, Math.round(((userExp - c.exp) / (n.exp - c.exp)) * 100)) : 100; };

  const saveTodayRecord = () => {
    if (!todayFeeling) return;
    const today = new Date().getDate();
    const fd = feelings.find(f => `${f.emoji} ${f.label}` === todayFeeling);
    setDailyRecords(prev => ({ ...prev, [today]: { feeling: todayFeeling, score: fd?.score || 70, memo: todayMemo, stoolCount: todayStoolCount } }));
    setUserExp(prev => Math.min(prev + 5, 500));
    analytics.track('Daily Log Saved', { feeling: todayFeeling, stoolCount: todayStoolCount });
    setShowSaved(true); setTimeout(() => setShowSaved(false), 2000);
  };

  const saveExercise = () => {
    if (!exerciseType || !exerciseIntensity) return;
    const today = new Date().getDate();
    const calMap = { run: 9, walk: 4, cycle: 7, swim: 8, yoga: 3, strength: 6 };
    const intMult = { light: 0.7, moderate: 1, hard: 1.3, extreme: 1.6 };
    const cal = Math.round((calMap[exerciseType] || 5) * exerciseDuration * (intMult[exerciseIntensity] || 1));
    setExerciseRecords(prev => ({ ...prev, [today]: { type: exerciseType, duration: exerciseDuration, intensity: exerciseIntensity, calories: cal, source: 'manual' } }));
    setUserExp(prev => Math.min(prev + 3, 500));
    analytics.track('Exercise Logged', { type: exerciseType, duration: exerciseDuration, intensity: exerciseIntensity, calories: cal });
    setShowExerciseSaved(true); setTimeout(() => setShowExerciseSaved(false), 2000);
    setExerciseType(''); setExerciseIntensity('');
  };

  const handleStravaConnect = () => {
    analytics.track('Strava Connect Clicked');
    setShowStravaModal(true);
    setTimeout(() => { setStravaConnected(true); setShowStravaModal(false); analytics.track('Strava Connected'); }, 2000);
  };

  const handleTabChange = (tab) => { analytics.track('Tab Viewed', { tab }); setActiveTab(tab); };

  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    setChatMessages(prev => [...prev, { role: 'user', content: chatInput }]);
    const q = chatInput; setChatInput('');
    analytics.track('Chat Sent', { len: q.length });
    setTimeout(() => {
      const responses = [
        "Based on your data, morning runs correlate with 12% better gut scores the next day! Try maintaining your 7AM routine. 🏃",
        "I notice your gut score drops after high-intensity workouts. Try eating easily digestible foods on those days. 🥣",
        "Your best gut days happen when you combine moderate exercise (30min) with 7+ hours of sleep. Keep it up! 😴",
        "Yoga days show the lowest bloating reports. Consider adding 2-3 yoga sessions per week for gut comfort. 🧘"
      ];
      setChatMessages(prev => [...prev, { role: 'assistant', content: responses[Math.floor(Math.random() * responses.length)] }]);
    }, 1000);
  };

  // ===== COMPUTED =====
  const gutHealth = 72;
  const totalRecords = Object.keys(dailyRecords).length;
  const monthlyAvg = Math.round(Object.values(dailyRecords).reduce((a, r) => a + r.score, 0) / totalRecords);
  const goodDays = Object.values(dailyRecords).filter(r => r.score >= 75).length;
  const okayDays = Object.values(dailyRecords).filter(r => r.score >= 60 && r.score < 75).length;
  const badDays = Object.values(dailyRecords).filter(r => r.score < 60).length;
  const goodPct = Math.round((goodDays / totalRecords) * 100);
  const okayPct = Math.round((okayDays / totalRecords) * 100);
  const badPct = Math.round((badDays / totalRecords) * 100);
  const totalBowel = Object.values(dailyRecords).reduce((a, r) => a + r.stoolCount, 0);
  const totalExerciseDays = Object.keys(exerciseRecords).length;
  const totalCalories = Object.values(exerciseRecords).reduce((a, r) => a + r.calories, 0);
  const avgDuration = Math.round(Object.values(exerciseRecords).reduce((a, r) => a + r.duration, 0) / totalExerciseDays);

  const exerciseDayScores = Object.keys(exerciseRecords).filter(d => dailyRecords[d]).map(d => dailyRecords[d].score);
  const noExerciseDayScores = Object.keys(dailyRecords).filter(d => !exerciseRecords[d]).map(d => dailyRecords[d].score);
  const avgExerciseGut = exerciseDayScores.length ? Math.round(exerciseDayScores.reduce((a, b) => a + b, 0) / exerciseDayScores.length) : 0;
  const avgNoExerciseGut = noExerciseDayScores.length ? Math.round(noExerciseDayScores.reduce((a, b) => a + b, 0) / noExerciseDayScores.length) : 0;
  const correlationScore = Math.min(95, Math.max(30, Math.round(50 + (avgExerciseGut - avgNoExerciseGut) * 1.5)));

  const currentLevelInfo = getCurrentLevel();
  const nextLevelInfo = getNextLevel();
  const todayExercise = exerciseRecords[new Date().getDate()];

  // ===== STYLES =====
  const s = {
    container: { width: '100%', height: '100vh', maxWidth: 430, margin: '0 auto', background: '#FFF9F0', display: 'flex', flexDirection: 'column', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', position: 'relative', overflow: 'hidden' },
    header: { padding: '14px 20px', background: 'linear-gradient(135deg, #D4AF37, #C49B30)', color: 'white', textAlign: 'center', fontWeight: 700, fontSize: 18, flexShrink: 0 },
    content: { flex: 1, overflow: 'auto', padding: '16px 20px 20px' },
    card: { background: 'white', borderRadius: 16, padding: 20, marginBottom: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' },
    btn: { width: '100%', padding: 16, background: 'linear-gradient(135deg, #D4AF37, #C49B30)', color: 'white', border: 'none', borderRadius: 12, fontSize: 16, fontWeight: 600, cursor: 'pointer' },
    navBar: { display: 'flex', justifyContent: 'space-around', padding: '10px 0 14px', background: 'white', borderTop: '1px solid #eee', flexShrink: 0 },
    navItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: 10, color: '#999', cursor: 'pointer', border: 'none', background: 'none', padding: '4px 12px' },
  };

  // ============ ONBOARDING ============
  if (showOnboarding) {
    const q = onboardingQuestions[onboardingStep];
    const progress = ((onboardingStep + 1) / onboardingQuestions.length) * 100;
    return (
      <div style={{ ...s.container, background: 'linear-gradient(180deg, #A8E6CF 0%, #FFF9F0 100%)' }}>
        <div style={{ padding: '20px 24px 8px' }}>
          <div style={{ height: 6, background: 'rgba(255,255,255,0.5)', borderRadius: 3 }}>
            <div style={{ height: '100%', width: `${progress}%`, background: '#D4AF37', borderRadius: 3, transition: 'width 0.4s' }}></div>
          </div>
          <div style={{ textAlign: 'right', fontSize: 12, color: '#888', marginTop: 8 }}>{onboardingStep + 1} / {onboardingQuestions.length}</div>
        </div>
        <div style={{ flex: 1, padding: '0 28px', display: 'flex', flexDirection: 'column', justifyContent: 'center', overflow: 'auto' }}>
          {q.type === 'welcome' && <div style={{ textAlign: 'center' }}><div style={{ fontSize: 80, marginBottom: 20 }}>🌿</div><h1 style={{ fontSize: 28, fontWeight: 700, color: '#2D2A26', margin: '0 0 12px' }}>Welcome to GutBuddy!</h1><p style={{ fontSize: 16, color: '#666', margin: 0 }}>AI-powered gut health + fitness companion</p></div>}
          {q.type === 'input' && <div><h2 style={{ fontSize: 24, fontWeight: 600, color: '#2D2A26', margin: '0 0 24px' }}>{q.title}</h2><input type="text" value={userProfile[q.field] || ''} onChange={e => updateProfile(q.field, e.target.value)} placeholder={q.placeholder} style={{ width: '100%', padding: 16, fontSize: 18, border: '2px solid #E8E0D5', borderRadius: 12, textAlign: 'center', boxSizing: 'border-box', outline: 'none' }} /></div>}
          {q.type === 'choice' && <div><h2 style={{ fontSize: 24, fontWeight: 600, color: '#2D2A26', margin: '0 0 24px' }}>{q.title}</h2><div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>{q.options.map(opt => <button key={opt.value} onClick={() => updateProfile(q.field, opt.value)} style={{ padding: 16, borderRadius: 12, border: userProfile[q.field] === opt.value ? '2px solid #D4AF37' : '2px solid #E8E0D5', background: userProfile[q.field] === opt.value ? '#FFF9F0' : 'white', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}><span style={{ fontSize: 24 }}>{opt.icon}</span><span style={{ fontSize: 16 }}>{opt.label}</span>{userProfile[q.field] === opt.value && <span style={{ marginLeft: 'auto', color: '#D4AF37', fontWeight: 700 }}>✓</span>}</button>)}</div></div>}
          {q.type === 'multiChoice' && <div><h2 style={{ fontSize: 24, fontWeight: 600, color: '#2D2A26', margin: '0 0 24px' }}>{q.title}</h2><div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>{q.options.map(opt => <button key={opt.value} onClick={() => toggleIssue(opt.value)} style={{ padding: '12px 16px', borderRadius: 24, border: userProfile.issues.includes(opt.value) ? '2px solid #D4AF37' : '2px solid #E8E0D5', background: userProfile.issues.includes(opt.value) ? '#FFF9F0' : 'white', display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}><span>{opt.icon}</span><span>{opt.label}</span></button>)}</div></div>}
          {q.type === 'time' && <div><h2 style={{ fontSize: 24, fontWeight: 600, color: '#2D2A26', margin: '0 0 24px' }}>{q.title}</h2><input type="time" value={userProfile.notificationTime} onChange={e => updateProfile('notificationTime', e.target.value)} style={{ width: '100%', padding: 16, fontSize: 24, border: '2px solid #E8E0D5', borderRadius: 12, textAlign: 'center', boxSizing: 'border-box' }} /></div>}
          {q.type === 'complete' && <div style={{ textAlign: 'center' }}><div style={{ fontSize: 80, marginBottom: 20 }}>🎉</div><h1 style={{ fontSize: 28, fontWeight: 700, color: '#2D2A26', margin: '0 0 12px' }}>You're all set!</h1><p style={{ fontSize: 16, color: '#666', margin: 0 }}>Let's start your gut + fitness journey!</p></div>}
        </div>
        <div style={{ padding: '16px 28px 28px', display: 'flex', gap: 12 }}>
          {onboardingStep > 0 && <button onClick={prevStep} style={{ flex: 1, padding: 16, borderRadius: 12, border: '1px solid #E8E0D5', background: 'white', fontSize: 16, cursor: 'pointer' }}>Back</button>}
          <button onClick={nextStep} disabled={!isCurrentStepValid()} style={{ flex: 2, padding: 16, borderRadius: 12, border: 'none', background: isCurrentStepValid() ? 'linear-gradient(135deg, #D4AF37, #C49B30)' : '#E8E0D5', color: isCurrentStepValid() ? 'white' : '#999', fontSize: 16, fontWeight: 600, cursor: isCurrentStepValid() ? 'pointer' : 'not-allowed' }}>{onboardingStep === onboardingQuestions.length - 1 ? "Let's Go! 🚀" : 'Continue'}</button>
        </div>
      </div>
    );
  }

  // ============ HOME ============
  const renderHome = () => (
    <div>
      <div style={{ marginBottom: 16, padding: 16, background: 'linear-gradient(135deg, #A8E6CF, #88D8B0)', borderRadius: 16 }}>
        <div style={{ fontSize: 18, fontWeight: 600, color: '#2D2A26' }}>👋 Hey {userProfile.nickname || 'there'}!</div>
        <div style={{ fontSize: 13, color: '#5D5A56', marginTop: 4 }}>Your gut & fitness overview for today</div>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <div style={{ ...s.card, flex: 1, marginBottom: 0, textAlign: 'center', padding: 16 }}>
          <div style={{ background: `conic-gradient(#D4AF37 ${gutHealth}%, #E8E0D5 0)`, borderRadius: '50%', width: 80, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#D4AF37' }}>{gutHealth}%</div>
            </div>
          </div>
          <div style={{ fontSize: 12, fontWeight: 600 }}>🫄 Gut Score</div>
          <div style={{ fontSize: 11, color: '#999', marginTop: 2 }}>😊 Good</div>
        </div>
        <div style={{ ...s.card, flex: 1, marginBottom: 0, textAlign: 'center', padding: 16 }}>
          <div style={{ background: `conic-gradient(#FF6B35 ${correlationScore}%, #E8E0D5 0)`, borderRadius: '50%', width: 80, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#FF6B35' }}>{correlationScore}</div>
            </div>
          </div>
          <div style={{ fontSize: 12, fontWeight: 600 }}>🏃 Correlation</div>
          <div style={{ fontSize: 11, color: '#999', marginTop: 2 }}>Exercise↔Gut</div>
        </div>
      </div>

      <div style={{ ...s.card, border: '2px solid #FF6B35' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ fontSize: 15, fontWeight: 600 }}>🏃 Today's Exercise</div>
          {stravaConnected && <span style={{ fontSize: 10, background: '#FF6B35', color: 'white', padding: '2px 8px', borderRadius: 8, fontWeight: 600 }}>Strava ✓</span>}
        </div>
        {todayExercise ? (
          <div style={{ display: 'flex', gap: 10 }}>
            {[{ v: `${getExerciseIcon(todayExercise.type)} ${getExerciseLabel(todayExercise.type)}`, sub: 'Activity', fs: 14 },
              { v: `${todayExercise.duration}min`, sub: 'Duration', fs: 20 },
              { v: `${todayExercise.calories}`, sub: 'kcal', fs: 20 }
            ].map((item, i) => (
              <div key={i} style={{ flex: 1, background: '#FFF5EE', borderRadius: 12, padding: 12, textAlign: 'center' }}>
                <div style={{ fontSize: item.fs, fontWeight: 700, color: '#FF6B35' }}>{item.v}</div>
                <div style={{ fontSize: 10, color: '#999', marginTop: 4 }}>{item.sub}</div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: 16, color: '#999', fontSize: 13 }}>
            <div style={{ fontSize: 28, marginBottom: 4 }}>🏃‍♂️</div>
            No exercise logged. <span style={{ color: '#FF6B35', cursor: 'pointer', fontWeight: 600 }} onClick={() => handleTabChange('diet')}>Log now →</span>
          </div>
        )}
      </div>

      <div style={s.card}>
        <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>🤖 AI Insight</div>
        <div style={{ padding: 14, borderRadius: 12, background: 'linear-gradient(135deg, #FFF9F0, #FFF5EE)', lineHeight: 1.6, fontSize: 13, color: '#555' }}>
          {avgExerciseGut > avgNoExerciseGut
            ? `Exercise days show ${avgExerciseGut - avgNoExerciseGut} point higher gut scores! Your gut loves when you move. Keep your ${totalExerciseDays}-day exercise month going! 🎉`
            : "Start tracking exercise to discover gut-exercise patterns! Even 20-min walks improve digestion. 🚶"}
        </div>
      </div>

      <div style={s.card}>
        <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>🍽️ Today's Nutrition</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
          {[{ label: 'Carbs', value: 180, max: 300, color: '#FF9500' }, { label: 'Protein', value: 65, max: 100, color: '#FF3B30' }, { label: 'Fat', value: 45, max: 70, color: '#FFCC00' }, { label: 'Fiber', value: 18, max: 30, color: '#4CAF50' }].map((item, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 18, fontWeight: 700 }}>{item.value}g</div>
              <div style={{ fontSize: 10, color: '#999', marginBottom: 6 }}>{item.label}</div>
              <div style={{ height: 6, background: '#E8E0D5', borderRadius: 3 }}><div style={{ height: '100%', width: `${Math.min(100, (item.value / item.max) * 100)}%`, background: item.color, borderRadius: 3 }}></div></div>
            </div>
          ))}
        </div>
      </div>
      <button onClick={() => analytics.track('Stool Analysis Clicked')} style={s.btn}>🚽 Quick Stool Analysis</button>
    </div>
  );

  // ============ LOG ============
  const renderDiet = () => (
    <div>
      <div style={{ ...s.card, border: '2px solid #FF6B35' }}>
        <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 14 }}>🏋️ Log Exercise</div>
        {stravaConnected && <div style={{ fontSize: 11, color: '#FC4C02', marginBottom: 12, background: '#FFF3EC', padding: '8px 12px', borderRadius: 10 }}>⚡ Strava auto-syncs workouts. Use manual for non-Strava activities.</div>}
        <div style={{ fontSize: 13, color: '#8B7355', marginBottom: 10 }}>Activity type</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
          {exerciseTypes.map(e => (
            <button key={e.value} onClick={() => setExerciseType(e.value)} style={{ padding: '10px 14px', borderRadius: 12, border: exerciseType === e.value ? '2px solid #FF6B35' : '1px solid #E8E0D5', background: exerciseType === e.value ? '#FFF5EE' : 'white', fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ fontSize: 18 }}>{e.icon}</span><span>{e.label}</span>
            </button>
          ))}
        </div>
        <div style={{ fontSize: 13, color: '#8B7355', marginBottom: 10 }}>Duration</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <button onClick={() => setExerciseDuration(Math.max(5, exerciseDuration - 5))} style={{ width: 36, height: 36, borderRadius: '50%', border: '1px solid #ddd', background: 'white', fontSize: 18, cursor: 'pointer' }}>-</button>
          <span style={{ fontSize: 28, fontWeight: 700, color: '#FF6B35', minWidth: 60, textAlign: 'center' }}>{exerciseDuration}<span style={{ fontSize: 14, fontWeight: 400 }}>min</span></span>
          <button onClick={() => setExerciseDuration(exerciseDuration + 5)} style={{ width: 36, height: 36, borderRadius: '50%', border: '1px solid #ddd', background: 'white', fontSize: 18, cursor: 'pointer' }}>+</button>
        </div>
        <div style={{ fontSize: 13, color: '#8B7355', marginBottom: 10 }}>Intensity</div>
        <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
          {intensityLevels.map(lv => (
            <button key={lv.value} onClick={() => setExerciseIntensity(lv.value)} style={{ flex: 1, padding: '10px 6px', borderRadius: 10, border: exerciseIntensity === lv.value ? `2px solid ${lv.color}` : '1px solid #E8E0D5', background: exerciseIntensity === lv.value ? `${lv.color}15` : 'white', fontSize: 11, cursor: 'pointer', textAlign: 'center' }}>
              <div style={{ fontSize: 16 }}>{lv.emoji}</div>
              <div style={{ marginTop: 2, fontWeight: exerciseIntensity === lv.value ? 600 : 400 }}>{lv.label}</div>
            </button>
          ))}
        </div>
        <button onClick={saveExercise} style={{ ...s.btn, background: exerciseType && exerciseIntensity ? 'linear-gradient(135deg, #FF6B35, #E85D26)' : '#E8E0D5', color: exerciseType && exerciseIntensity ? 'white' : '#999', cursor: exerciseType && exerciseIntensity ? 'pointer' : 'not-allowed' }}>🏃 Save Exercise</button>
        {showExerciseSaved && <div style={{ textAlign: 'center', marginTop: 8, color: '#FF6B35', fontWeight: 600, fontSize: 14 }}>✅ Exercise saved!</div>}
      </div>

      <div style={{ display: 'flex', gap: 6, marginBottom: 16, background: 'white', borderRadius: 12, padding: 6 }}>
        {['breakfast', 'lunch', 'dinner'].map(m => (
          <button key={m} onClick={() => setActiveMeal(m)} style={{ flex: 1, padding: 12, border: 'none', borderRadius: 10, background: activeMeal === m ? 'linear-gradient(135deg, #D4AF37, #C49B30)' : 'transparent', color: activeMeal === m ? 'white' : '#666', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            {m === 'breakfast' ? '🌅' : m === 'lunch' ? '☀️' : '🌙'} {m.charAt(0).toUpperCase() + m.slice(1)}
          </button>
        ))}
      </div>
      <div style={s.card}>
        <div style={{ fontSize: 13, color: '#8B7355', marginBottom: 10 }}>📸 Stool / Meal Photos</div>
        <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
          {[0, 1, 2, 3].map(i => (
            <div key={i} style={{ width: 52, height: 52, borderRadius: i < 2 ? '50%' : 10, border: '2px dashed #D4AF37', background: '#FAF5EC', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <span style={{ fontSize: 16, color: '#D4AF37' }}>+</span>
            </div>
          ))}
        </div>
        <button style={s.btn}>🔍 Analyze with AI</button>
      </div>

      <div style={{ ...s.card, border: '2px solid #A8E6CF' }}>
        <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>💭 How's your gut?</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
          {feelings.map((f, i) => (
            <button key={i} onClick={() => setTodayFeeling(`${f.emoji} ${f.label}`)} style={{ padding: '10px 14px', borderRadius: 24, border: todayFeeling === `${f.emoji} ${f.label}` ? '2px solid #4CAF50' : '1px solid #E8E0D5', background: todayFeeling === `${f.emoji} ${f.label}` ? '#E8F5E9' : 'white', fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ fontSize: 18 }}>{f.emoji}</span><span>{f.label}</span>
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <span style={{ fontSize: 13, color: '#8B7355' }}>🚽</span>
          <button onClick={() => setTodayStoolCount(Math.max(0, todayStoolCount - 1))} style={{ width: 36, height: 36, borderRadius: '50%', border: '1px solid #ddd', background: 'white', fontSize: 18, cursor: 'pointer' }}>-</button>
          <span style={{ fontSize: 24, fontWeight: 700, color: '#D4AF37', minWidth: 30, textAlign: 'center' }}>{todayStoolCount}</span>
          <button onClick={() => setTodayStoolCount(todayStoolCount + 1)} style={{ width: 36, height: 36, borderRadius: '50%', border: '1px solid #ddd', background: 'white', fontSize: 18, cursor: 'pointer' }}>+</button>
          <span style={{ fontSize: 12, color: '#999' }}>times</span>
        </div>
        <textarea value={todayMemo} onChange={e => setTodayMemo(e.target.value)} placeholder="Notes..." style={{ width: '100%', padding: 12, borderRadius: 12, border: '1px solid #E8E0D5', fontSize: 14, resize: 'none', height: 50, fontFamily: 'inherit', boxSizing: 'border-box', marginBottom: 12 }} />
        <button onClick={saveTodayRecord} style={{ ...s.btn, background: 'linear-gradient(135deg, #4CAF50, #45a049)' }}>✅ Save Gut Log</button>
        {showSaved && <div style={{ textAlign: 'center', marginTop: 8, color: '#4CAF50', fontWeight: 600, fontSize: 14 }}>✅ Saved!</div>}
      </div>
    </div>
  );

  // ============ HISTORY ============
  const renderCalendar = () => {
    const today = new Date();
    const year = today.getFullYear(), month = today.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();
    const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    const weeklyData = [{ day: 'M', gs: 75, ex: true }, { day: 'T', gs: 82, ex: true }, { day: 'W', gs: 68, ex: false }, { day: 'T', gs: 85, ex: true }, { day: 'F', gs: 78, ex: true }, { day: 'S', gs: 90, ex: false }, { day: 'S', gs: 72, ex: true }];

    return (
      <div>
        <div style={s.card}>
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>📈 Exercise ↔ Gut Score</div>
          <div style={{ fontSize: 11, color: '#999', marginBottom: 14 }}>Weekly comparison</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: 110, padding: '0 4px' }}>
            {weeklyData.map((d, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flex: 1 }}>
                <span style={{ fontSize: 10, fontWeight: 600, color: d.gs >= 75 ? '#4CAF50' : '#FFC107' }}>{d.gs}</span>
                <div style={{ display: 'flex', gap: 2, alignItems: 'flex-end' }}>
                  <div style={{ width: 14, borderRadius: '3px 3px 0 0', background: `linear-gradient(to top, ${d.gs >= 75 ? '#4CAF50' : d.gs >= 60 ? '#FFC107' : '#FF5722'}, ${d.gs >= 75 ? '#81C784' : d.gs >= 60 ? '#FFD54F' : '#FF8A65'})`, height: `${d.gs * 0.7}px` }}></div>
                  <div style={{ width: 14, borderRadius: '3px 3px 0 0', background: d.ex ? 'linear-gradient(to top, #FF6B35, #FF8F65)' : '#f0f0f0', height: d.ex ? '35px' : '8px' }}></div>
                </div>
                <span style={{ fontSize: 11, color: '#999' }}>{d.day}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 12, fontSize: 10 }}>
            <span><span style={{ color: '#4CAF50' }}>■</span> Gut Score</span>
            <span><span style={{ color: '#FF6B35' }}>■</span> Exercise</span>
          </div>
        </div>

        <div style={s.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <span style={{ color: '#bbb', cursor: 'pointer' }}>◀</span>
            <span style={{ fontSize: 17, fontWeight: 600 }}>{monthNames[month]} {year}</span>
            <span style={{ color: '#bbb', cursor: 'pointer' }}>▶</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, textAlign: 'center' }}>
            {['S','M','T','W','T','F','S'].map((d, i) => <div key={d+i} style={{ fontSize: 11, padding: 4, fontWeight: 600, color: i === 0 ? '#FF3B30' : i === 6 ? '#007AFF' : '#999' }}>{d}</div>)}
            {Array.from({ length: 42 }, (_, i) => {
              const day = i - firstDay + 1;
              const valid = day > 0 && day <= lastDate;
              const isToday = day === today.getDate();
              const isSel = day === selectedDate;
              const rec = dailyRecords[day];
              const exr = exerciseRecords[day];
              return (
                <div key={i} onClick={() => valid && setSelectedDate(day)} style={{ padding: 2, borderRadius: 10, background: isSel ? '#D4AF37' : isToday ? '#FFF9F0' : 'transparent', cursor: valid ? 'pointer' : 'default', border: isToday && !isSel ? '2px solid #D4AF37' : '2px solid transparent', minHeight: 46 }}>
                  {valid && (<>
                    <div style={{ fontSize: 10, color: isSel ? 'white' : '#333' }}>{day}</div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 1, flexWrap: 'wrap' }}>
                      {rec && <span style={{ fontSize: 12 }}>{rec.feeling.split(' ')[0]}</span>}
                      {exr && <span style={{ fontSize: 10 }}>{getExerciseIcon(exr.type)}</span>}
                    </div>
                  </>)}
                </div>
              );
            })}
          </div>
        </div>

        <div style={s.card}>
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>🩺 Gut Health This Month</div>
          {[{ emoji: '😄', label: 'Good Days', count: goodDays, pct: goodPct, color: '#4CAF50' },
            { emoji: '😐', label: 'Okay Days', count: okayDays, pct: okayPct, color: '#FFC107' },
            { emoji: '😣', label: 'Bad Days', count: badDays, pct: badPct, color: '#FF5722' }
          ].map((item, i) => (
            <div key={i} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                <span>{item.emoji} <span style={{ fontWeight: 600, color: item.color }}>{item.label}</span></span>
                <span style={{ fontWeight: 700, color: item.color }}>{item.count} ({item.pct}%)</span>
              </div>
              <div style={{ height: 8, background: '#f0f0f0', borderRadius: 4 }}>
                <div style={{ height: '100%', width: `${item.pct}%`, background: item.color, borderRadius: 4 }}></div>
              </div>
            </div>
          ))}
        </div>

        <div style={s.card}>
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>📋 {monthNames[month]} {selectedDate}</div>
          {(dailyRecords[selectedDate] || exerciseRecords[selectedDate]) ? (
            <div>
              {dailyRecords[selectedDate] && (
                <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                  <div style={{ flex: 1, background: '#FFF9F0', borderRadius: 10, padding: 10, textAlign: 'center' }}>
                    <div style={{ fontSize: 28 }}>{dailyRecords[selectedDate].feeling.split(' ')[0]}</div>
                    <div style={{ fontSize: 10, color: '#999' }}>{dailyRecords[selectedDate].feeling.split(' ')[1]}</div>
                  </div>
                  <div style={{ flex: 1, background: '#FFF9F0', borderRadius: 10, padding: 10, textAlign: 'center' }}>
                    <div style={{ fontSize: 22, fontWeight: 700, color: dailyRecords[selectedDate].score >= 75 ? '#4CAF50' : '#FFC107' }}>{dailyRecords[selectedDate].score}</div>
                    <div style={{ fontSize: 10, color: '#999' }}>Score</div>
                  </div>
                  <div style={{ flex: 1, background: '#FFF9F0', borderRadius: 10, padding: 10, textAlign: 'center' }}>
                    <div style={{ fontSize: 22, fontWeight: 700, color: '#D4AF37' }}>{dailyRecords[selectedDate].stoolCount}</div>
                    <div style={{ fontSize: 10, color: '#999' }}>Bowel</div>
                  </div>
                </div>
              )}
              {exerciseRecords[selectedDate] && (
                <div style={{ padding: 12, borderRadius: 10, background: '#FFF5EE', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 28 }}>{getExerciseIcon(exerciseRecords[selectedDate].type)}</span>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#FF6B35' }}>{getExerciseLabel(exerciseRecords[selectedDate].type)}</div>
                    <div style={{ fontSize: 12, color: '#999' }}>{exerciseRecords[selectedDate].duration}min · {exerciseRecords[selectedDate].calories}kcal · {exerciseRecords[selectedDate].intensity}</div>
                    <div style={{ fontSize: 10, color: '#bbb', marginTop: 2 }}>via {exerciseRecords[selectedDate].source}</div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: 20, color: '#999', fontSize: 13 }}>📭 No records</div>
          )}
        </div>

        <div style={s.card}>
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 14 }}>📊 Monthly Stats</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
            {[{ v: totalRecords, label: 'Gut Logs', bg: '#E8F5E9', c: '#388E3C' }, { v: totalExerciseDays, label: 'Exercise', bg: '#FFF3E0', c: '#FF6B35' }, { v: monthlyAvg, label: 'Avg Score', bg: '#E3F2FD', c: '#1976D2' },
              { v: totalBowel, label: 'Bowel', bg: '#FCE4EC', c: '#C2185B' }, { v: totalCalories, label: 'Total kcal', bg: '#FFF5EE', c: '#FF6B35' }, { v: `${avgDuration}m`, label: 'Avg Duration', bg: '#F3E5F5', c: '#7B1FA2' }
            ].map((item, i) => (
              <div key={i} style={{ padding: 12, borderRadius: 10, textAlign: 'center', background: item.bg }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: item.c }}>{item.v}</div>
                <div style={{ fontSize: 10, fontWeight: 600, color: item.c, marginTop: 2 }}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // ============ INSIGHTS ============
  const renderAnalysis = () => (
    <div>
      <div style={{ ...s.card, background: 'linear-gradient(135deg, #FF6B35, #E85D26)', color: 'white' }}>
        <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>🏃↔🫄 Exercise & Gut Correlation</div>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <div style={{ width: 90, height: 90, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <div style={{ fontSize: 32, fontWeight: 700 }}>{correlationScore}</div>
          </div>
          <div style={{ fontSize: 13, lineHeight: 1.8 }}>
            <div>🏃 Exercise days: avg <b>{avgExerciseGut}</b></div>
            <div>🛋️ Rest days: avg <b>{avgNoExerciseGut}</b></div>
            <div>📈 Difference: <b>+{avgExerciseGut - avgNoExerciseGut}</b> pts</div>
          </div>
        </div>
      </div>

      <div style={s.card}>
        <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 14 }}>🤖 AI Pattern Detection</div>
        {[
          { icon: '🏃', pattern: 'Morning runs improve next-day gut score by 12%', confidence: 85, color: '#4CAF50' },
          { icon: '💪', pattern: 'High-intensity days show 40% more bloating', confidence: 72, color: '#FF9800' },
          { icon: '🛋️', pattern: 'No-exercise days: 65% more irregular bowel', confidence: 80, color: '#F44336' },
          { icon: '🧘', pattern: 'Yoga correlates with lowest bloating', confidence: 78, color: '#4CAF50' },
          { icon: '😴', pattern: '7h+ sleep + exercise = highest gut scores', confidence: 88, color: '#2196F3' },
        ].map((item, i) => (
          <div key={i} style={{ padding: 12, borderRadius: 12, background: '#FFF9F0', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 24 }}>{item.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, color: '#333', lineHeight: 1.4 }}>{item.pattern}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
                <div style={{ flex: 1, height: 4, background: '#eee', borderRadius: 2 }}>
                  <div style={{ height: '100%', width: `${item.confidence}%`, background: item.color, borderRadius: 2 }}></div>
                </div>
                <span style={{ fontSize: 10, color: item.color, fontWeight: 600 }}>{item.confidence}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={s.card}>
        <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 14 }}>📅 AI Weekly Plan</div>
        {[
          { day: 'Mon', ex: '🏃 Jog 30min', int: 'moderate', gut: 'Oats + yogurt' },
          { day: 'Tue', ex: '🧘 Yoga 40min', int: 'light', gut: 'High-fiber salad' },
          { day: 'Wed', ex: '🏃 Intervals 25min', int: 'hard', gut: 'Light, easy meals' },
          { day: 'Thu', ex: '🚶 Walk 45min', int: 'light', gut: 'Fermented foods' },
          { day: 'Fri', ex: '🏃 Jog 30min', int: 'moderate', gut: 'Whole grains' },
          { day: 'Sat', ex: '🚴 Cycle 60min', int: 'moderate', gut: 'Balanced meal' },
          { day: 'Sun', ex: '🧘 Stretch 20min', int: 'light', gut: 'Probiotics + rest' },
        ].map((d, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: i < 6 ? '1px solid #f0f0f0' : 'none' }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: '#FFF5EE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#FF6B35' }}>{d.day}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{d.ex}</div>
              <div style={{ fontSize: 11, color: '#999' }}>🍽️ {d.gut}</div>
            </div>
            <span style={{ fontSize: 9, padding: '2px 8px', borderRadius: 8, background: d.int === 'light' ? '#E8F5E9' : d.int === 'moderate' ? '#FFF8E1' : '#FFF3E0', color: d.int === 'light' ? '#4CAF50' : d.int === 'moderate' ? '#F57F17' : '#E65100' }}>{d.int}</span>
          </div>
        ))}
      </div>

      <div style={s.card}>
        <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>🔬 Bristol Stool Scale</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          {[1,2,3,4,5,6,7].map(t => (
            <div key={t} style={{ textAlign: 'center', padding: '8px 4px', borderRadius: 8, background: t === 4 ? '#E8F5E9' : '#f8f8f8', border: t === 4 ? '2px solid #4CAF50' : 'none', flex: 1, margin: '0 1px' }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: t === 4 ? '#4CAF50' : '#ccc' }}>{t}</div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', fontSize: 12, color: '#666' }}>Average: <b style={{ color: '#4CAF50' }}>Type 4</b> (Ideal)</div>
      </div>

      <div style={s.card}>
        <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>💬 AI Health Chat</div>
        <div style={{ height: 180, overflowY: 'auto', marginBottom: 12 }}>
          {chatMessages.map((m, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: 8 }}>
              <div style={{ maxWidth: '82%', padding: 10, borderRadius: 14, background: m.role === 'user' ? 'linear-gradient(135deg, #D4AF37, #C49B30)' : '#F5F0E8', color: m.role === 'user' ? 'white' : '#333', fontSize: 12, lineHeight: 1.5 }}>{m.content}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSendChat()} placeholder="Ask about exercise & gut health..." style={{ flex: 1, padding: 10, borderRadius: 24, border: '1px solid #E8E0D5', fontSize: 12, outline: 'none' }} />
          <button onClick={handleSendChat} style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #D4AF37, #C49B30)', border: 'none', color: 'white', cursor: 'pointer', fontSize: 14 }}>➤</button>
        </div>
      </div>
    </div>
  );

  // ============ PROFILE ============
  const renderProfile = () => (
    <div>
      <div style={s.card}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
          <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'linear-gradient(135deg, #A8E6CF, #88D8B0)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, flexShrink: 0 }}>{currentLevelInfo.icon}</div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 600 }}>{userProfile.nickname || 'User'}</div>
            <div style={{ fontSize: 14, color: '#D4AF37' }}>Lv.{userLevel} {currentLevelInfo.name}</div>
          </div>
        </div>
        <div style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#888', marginBottom: 4 }}>
            <span>EXP {userExp}</span><span>{nextLevelInfo ? `Next: ${nextLevelInfo.exp - userExp}` : 'MAX!'}</span>
          </div>
          <div style={{ height: 8, background: '#E8E0D5', borderRadius: 4 }}>
            <div style={{ height: '100%', width: `${getExpProgress()}%`, background: 'linear-gradient(90deg, #A8E6CF, #4CAF50)', borderRadius: 4 }}></div>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {levels.map((l, i) => <div key={i} style={{ textAlign: 'center', opacity: l.level <= userLevel ? 1 : 0.3 }}><div style={{ fontSize: 18 }}>{l.icon}</div><div style={{ fontSize: 8, color: '#999' }}>Lv.{l.level}</div></div>)}
        </div>
      </div>

      <div style={{ ...s.card, border: stravaConnected ? '2px solid #FF6B35' : '2px dashed #FF6B35' }}>
        <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>🔗 Fitness Connections</div>
        {[{ name: 'Strava', icon: 'S', bg: '#FC4C02', connected: stravaConnected, action: handleStravaConnect },
          { name: 'Apple Health', icon: '♥', bg: '#000', connected: false, note: 'Requires native app' },
          { name: 'Nike Run Club', icon: '✓', bg: '#111', connected: false, note: stravaConnected ? 'Via Strava ✓' : 'Connect Strava first' },
        ].map((app, i) => (
          <div key={i} style={{ padding: 14, borderRadius: 12, background: app.connected ? '#FFF5EE' : '#f8f8f8', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: app.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: app.icon.length > 1 ? 16 : 14 }}>{app.icon}</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{app.name}</div>
                <div style={{ fontSize: 11, color: app.connected ? '#4CAF50' : '#999' }}>{app.connected ? '✅ Connected' : (app.note || 'Not connected')}</div>
              </div>
            </div>
            {app.action ? (
              <button onClick={app.connected ? () => { setStravaConnected(false); analytics.track('Strava Disconnected'); } : app.action} style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: app.connected ? '#f0f0f0' : app.bg, color: app.connected ? '#666' : 'white', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                {app.connected ? 'Disconnect' : 'Connect'}
              </button>
            ) : <span style={{ fontSize: 11, color: '#bbb' }}>Coming Soon</span>}
          </div>
        ))}
      </div>

      <div style={s.card}>
        <div style={{ display: 'flex', gap: 8 }}>
          {[{ v: streak, label: '🔥 Streak', c: '#E53935', bg: '#FFEBEE' }, { v: totalDays, label: '📅 Total', c: '#1976D2', bg: '#E3F2FD' }, { v: monthlyAvg, label: '💚 Avg', c: '#388E3C', bg: '#E8F5E9' }].map((item, i) => (
            <div key={i} style={{ flex: 1, background: item.bg, borderRadius: 12, padding: 12, textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: item.c }}>{item.v}</div>
              <div style={{ fontSize: 10, fontWeight: 600, color: item.c }}>{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={s.card}>
        <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>🏅 Badges</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {[{ icon: '🌱', earned: true }, { icon: '🔥', earned: true }, { icon: '⚡', earned: true }, { icon: '🏃', earned: true }, { icon: '📊', earned: true }, { icon: '🧘', earned: false }, { icon: '🏆', earned: false }, { icon: '👑', earned: false }].map((b, i) => (
            <div key={i} style={{ width: 44, height: 44, borderRadius: 10, background: b.earned ? '#FFF9F0' : '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, opacity: b.earned ? 1 : 0.3 }}>{b.icon}</div>
          ))}
        </div>
      </div>

      <div style={s.card}>
        <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 14 }}>⭐ Plans</div>
        {[{ id: 'Basic', price: 'Free', color: '#999', desc: '1 analysis/day' },
          { id: 'Pro', price: '$9.99/mo', color: '#D4AF37', badge: 'Popular', desc: 'Unlimited + AI correlation' },
          { id: 'Family', price: '$19.99/mo', color: '#9C27B0', badge: 'Best', desc: 'Up to 5 members' }
        ].map(plan => (
          <div key={plan.id} onClick={() => setCurrentPlan(plan.id)} style={{ padding: 12, borderRadius: 10, border: currentPlan === plan.id ? `2px solid ${plan.color}` : '1px solid #eee', marginBottom: 8, cursor: 'pointer', position: 'relative' }}>
            {plan.badge && <span style={{ position: 'absolute', top: -6, right: 12, background: plan.color, color: 'white', padding: '1px 8px', borderRadius: 6, fontSize: 9, fontWeight: 600 }}>{plan.badge}</span>}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div><span style={{ fontSize: 14, fontWeight: 600, color: plan.color }}>{plan.id}</span><div style={{ fontSize: 10, color: '#999', marginTop: 2 }}>{plan.desc}</div></div>
              <span style={{ fontSize: 16, fontWeight: 700 }}>{plan.price}</span>
            </div>
          </div>
        ))}
      </div>

      <button onClick={() => setShowAnalyticsPanel(!showAnalyticsPanel)} style={{ ...s.btn, background: '#E3F2FD', color: '#1976D2', marginTop: 4 }}>📊 Analytics ({analytics.events.length})</button>
      {showAnalyticsPanel && (
        <div style={{ ...s.card, marginTop: 10, maxHeight: 180, overflow: 'auto', background: '#1a1a2e', color: '#eee', fontSize: 10, fontFamily: 'monospace' }}>
          {[...analytics.events].reverse().map((e, i) => (
            <div key={i} style={{ padding: '4px 0', borderBottom: '1px solid #333' }}>
              <span style={{ color: '#D4AF37' }}>{e.event}</span>
              <span style={{ color: '#888', marginLeft: 6 }}>{JSON.stringify(Object.fromEntries(Object.entries(e).filter(([k]) => !['event', 'timestamp'].includes(k))))}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // ============ MAIN ============
  return (
    <div style={s.container}>
      <div style={s.header}>🌿 GutBuddy</div>
      <div style={s.content}>
        {activeTab === 'home' && renderHome()}
        {activeTab === 'diet' && renderDiet()}
        {activeTab === 'calendar' && renderCalendar()}
        {activeTab === 'analysis' && renderAnalysis()}
        {activeTab === 'profile' && renderProfile()}
      </div>
      <nav style={s.navBar}>
        {[{ id: 'home', icon: '🏠', label: 'Home' }, { id: 'diet', icon: '🍽️', label: 'Log' }, { id: 'calendar', icon: '📅', label: 'History' }, { id: 'analysis', icon: '📊', label: 'Insights' }, { id: 'profile', icon: '👤', label: 'Profile' }].map(t => (
          <button key={t.id} onClick={() => handleTabChange(t.id)} style={{ ...s.navItem, color: activeTab === t.id ? '#D4AF37' : '#999' }}>
            <span style={{ fontSize: 22, marginBottom: 2 }}>{t.icon}</span>
            <span style={{ fontWeight: activeTab === t.id ? 600 : 400 }}>{t.label}</span>
          </button>
        ))}
      </nav>
      {showStravaModal && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: 'white', borderRadius: 20, padding: 32, width: '80%', textAlign: 'center' }}>
            <div style={{ width: 60, height: 60, borderRadius: 12, background: '#FC4C02', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'white', fontWeight: 700, fontSize: 24 }}>S</div>
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Connecting to Strava...</div>
            <div style={{ fontSize: 13, color: '#999', marginBottom: 16 }}>Syncing your exercise data</div>
            <div style={{ width: 40, height: 40, border: '3px solid #f0f0f0', borderTop: '3px solid #FC4C02', borderRadius: '50%', margin: '0 auto', animation: 'spin 1s linear infinite' }}></div>
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
          </div>
        </div>
      )}
    </div>
  );
}

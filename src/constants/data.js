export const exerciseTypes = [
  { icon: '\u{1F3C3}', label: 'Run', value: 'run' },
  { icon: '\u{1F6B6}', label: 'Walk', value: 'walk' },
  { icon: '\u{1F6B4}', label: 'Cycle', value: 'cycle' },
  { icon: '\u{1F3CA}', label: 'Swim', value: 'swim' },
  { icon: '\u{1F9D8}', label: 'Yoga', value: 'yoga' },
  { icon: '\u{1F4AA}', label: 'Strength', value: 'strength' },
];

export const intensityLevels = [
  { label: 'Light', emoji: '\u{1F7E2}', value: 'light', color: '#4CAF50' },
  { label: 'Moderate', emoji: '\u{1F7E1}', value: 'moderate', color: '#FFC107' },
  { label: 'Hard', emoji: '\u{1F7E0}', value: 'hard', color: '#FF9800' },
  { label: 'Extreme', emoji: '\u{1F534}', value: 'extreme', color: '#F44336' },
];

export const feelings = [
  { emoji: '\u{1F604}', label: 'Great', score: 90 },
  { emoji: '\u{1F60A}', label: 'Good', score: 75 },
  { emoji: '\u{1F610}', label: 'Okay', score: 60 },
  { emoji: '\u{1F623}', label: 'Bad', score: 45 },
  { emoji: '\u{1F62B}', label: 'Terrible', score: 30 },
];

export const levels = [
  { level: 1, name: 'Seed', icon: '\u{1F330}', exp: 0 },
  { level: 2, name: 'Sprout', icon: '\u{1F331}', exp: 50 },
  { level: 3, name: 'Seedling', icon: '\u{1F33F}', exp: 100 },
  { level: 4, name: 'Sapling', icon: '\u{1FAB4}', exp: 200 },
  { level: 5, name: 'Tree', icon: '\u{1F333}', exp: 350 },
  { level: 6, name: 'Bloom', icon: '\u{1F338}', exp: 500 },
];

export const onboardingQuestions = [
  { id: 'welcome', type: 'welcome' },
  {
    id: 'nickname', type: 'input',
    title: 'What should we call you? \u{1F60A}',
    placeholder: 'Enter your name', field: 'nickname',
  },
  {
    id: 'gender', type: 'choice',
    title: 'What is your gender? \u{1F464}', field: 'gender',
    options: [
      { value: 'male', label: 'Male', icon: '\u{1F468}' },
      { value: 'female', label: 'Female', icon: '\u{1F469}' },
      { value: 'other', label: 'Other', icon: '\u{1F9D1}' },
    ],
  },
  {
    id: 'goal', type: 'choice',
    title: "What's your main goal? \u{1F3AF}", field: 'goal',
    options: [
      { value: 'constipation', label: 'Relieve constipation', icon: '\u{1F4AA}' },
      { value: 'diarrhea', label: 'Manage diarrhea', icon: '\u{1FA79}' },
      { value: 'regular', label: 'Regular movements', icon: '\u23F0' },
      { value: 'overall', label: 'Overall gut health', icon: '\u{1F31F}' },
      { value: 'bloating', label: 'Reduce bloating', icon: '\u{1F388}' },
    ],
  },
  {
    id: 'issues', type: 'multiChoice',
    title: 'Any current symptoms? \u{1FA7A}', field: 'issues',
    options: [
      { value: 'bloating', label: 'Bloating', icon: '\u{1F388}' },
      { value: 'gas', label: 'Gas', icon: '\u{1F4A8}' },
      { value: 'pain', label: 'Pain', icon: '\u{1F623}' },
      { value: 'irregular', label: 'Irregular', icon: '\u{1F4CA}' },
      { value: 'none', label: 'None', icon: '\u2705' },
    ],
  },
  {
    id: 'stoolFrequency', type: 'choice',
    title: 'How often do you go? \u{1F6BD}', field: 'stoolFrequency',
    options: [
      { value: 'daily2', label: '2+ daily', icon: '\u{1F525}' },
      { value: 'daily1', label: 'Once daily', icon: '\u{1F44D}' },
      { value: 'every2days', label: 'Every 2 days', icon: '\u{1F610}' },
      { value: 'weekly', label: '1-2 weekly', icon: '\u{1F630}' },
    ],
  },
  {
    id: 'notification', type: 'time',
    title: 'Set reminder time \u23F0', field: 'notificationTime',
  },
  { id: 'complete', type: 'complete' },
];

export const initialExerciseRecords = {
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
};

export const initialDailyRecords = {
  1: { feeling: '\u{1F604} Great', score: 85, memo: 'Had yogurt', stoolCount: 1 },
  2: { feeling: '\u{1F60A} Good', score: 75, memo: '', stoolCount: 2 },
  3: { feeling: '\u{1F610} Okay', score: 65, memo: '', stoolCount: 1 },
  5: { feeling: '\u{1F604} Great', score: 88, memo: '', stoolCount: 1 },
  7: { feeling: '\u{1F60A} Good', score: 72, memo: '', stoolCount: 2 },
  8: { feeling: '\u{1F604} Great', score: 82, memo: 'Ate more fiber', stoolCount: 1 },
  10: { feeling: '\u{1F604} Great', score: 90, memo: 'Feeling amazing', stoolCount: 1 },
  12: { feeling: '\u{1F623} Bad', score: 55, memo: 'Bloated after pizza', stoolCount: 0 },
  14: { feeling: '\u{1F60A} Good', score: 76, memo: '', stoolCount: 1 },
  15: { feeling: '\u{1F60A} Good', score: 78, memo: '', stoolCount: 1 },
  17: { feeling: '\u{1F604} Great', score: 85, memo: 'Probiotics helped', stoolCount: 2 },
  19: { feeling: '\u{1F610} Okay', score: 62, memo: '', stoolCount: 1 },
  20: { feeling: '\u{1F60A} Good', score: 74, memo: '', stoolCount: 1 },
};

export const getExerciseIcon = (type) =>
  exerciseTypes.find((e) => e.value === type)?.icon || '\u{1F3C3}';

export const getExerciseLabel = (type) =>
  exerciseTypes.find((e) => e.value === type)?.label || type;

import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../context/AppContext';
import { getExerciseIcon, getExerciseLabel } from '../constants/data';
import { Colors, Shadows } from '../constants/theme';
import Card from '../components/Card';

export default function HistoryScreen() {
  const {
    selectedDate,
    setSelectedDate,
    dailyRecords,
    exerciseRecords,
    goodDays,
    okayDays,
    badDays,
    goodPct,
    okayPct,
    badPct,
    totalRecords,
    totalExerciseDays,
    monthlyAvg,
    totalBowel,
    totalCalories,
    avgDuration,
  } = useApp();

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const weeklyData = [
    { day: 'M', gs: 75, ex: true },
    { day: 'T', gs: 82, ex: true },
    { day: 'W', gs: 68, ex: false },
    { day: 'T', gs: 85, ex: true },
    { day: 'F', gs: 78, ex: true },
    { day: 'S', gs: 90, ex: false },
    { day: 'S', gs: 72, ex: true },
  ];

  const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Weekly Chart */}
      <Card>
        <Text style={styles.sectionTitle}>{'\u{1F4C8}'} Exercise {'\u2194'} Gut Score</Text>
        <Text style={styles.sectionSubtitle}>Weekly comparison</Text>
        <View style={styles.chartContainer}>
          {weeklyData.map((d, i) => {
            const barColor =
              d.gs >= 75 ? Colors.success : d.gs >= 60 ? Colors.warning : Colors.error;
            return (
              <View key={i} style={styles.chartColumn}>
                <Text
                  style={[
                    styles.chartScoreLabel,
                    { color: d.gs >= 75 ? Colors.success : Colors.warning },
                  ]}
                >
                  {d.gs}
                </Text>
                <View style={styles.chartBars}>
                  <View
                    style={[
                      styles.chartBar,
                      { height: d.gs * 0.7, backgroundColor: barColor },
                    ]}
                  />
                  <View
                    style={[
                      styles.chartBar,
                      {
                        height: d.ex ? 35 : 8,
                        backgroundColor: d.ex ? Colors.orange : '#f0f0f0',
                      },
                    ]}
                  />
                </View>
                <Text style={styles.chartDayLabel}>{d.day}</Text>
              </View>
            );
          })}
        </View>
        <View style={styles.chartLegend}>
          <Text style={styles.legendItem}>
            <Text style={{ color: Colors.success }}>{'\u25A0'}</Text> Gut Score
          </Text>
          <Text style={styles.legendItem}>
            <Text style={{ color: Colors.orange }}>{'\u25A0'}</Text> Exercise
          </Text>
        </View>
      </Card>

      {/* Calendar */}
      <Card>
        <View style={styles.calendarHeader}>
          <Text style={styles.calendarArrow}>{'\u25C0'}</Text>
          <Text style={styles.calendarTitle}>
            {monthNames[month]} {year}
          </Text>
          <Text style={styles.calendarArrow}>{'\u25B6'}</Text>
        </View>

        {/* Day Headers */}
        <View style={styles.calendarGrid}>
          {dayNames.map((d, i) => (
            <View key={`h${i}`} style={styles.calendarCell}>
              <Text
                style={[
                  styles.dayHeader,
                  i === 0 && { color: '#FF3B30' },
                  i === 6 && { color: '#007AFF' },
                ]}
              >
                {d}
              </Text>
            </View>
          ))}

          {/* Calendar Days */}
          {Array.from({ length: 42 }, (_, i) => {
            const day = i - firstDay + 1;
            const valid = day > 0 && day <= lastDate;
            const isToday = day === today.getDate();
            const isSel = day === selectedDate;
            const rec = dailyRecords[day];
            const exr = exerciseRecords[day];

            return (
              <TouchableOpacity
                key={i}
                onPress={() => valid && setSelectedDate(day)}
                style={[
                  styles.calendarCell,
                  isSel && styles.calendarCellSelected,
                  isToday && !isSel && styles.calendarCellToday,
                ]}
                activeOpacity={valid ? 0.7 : 1}
              >
                {valid && (
                  <>
                    <Text
                      style={[
                        styles.calendarDay,
                        isSel && { color: Colors.white },
                      ]}
                    >
                      {day}
                    </Text>
                    <View style={styles.calendarIndicators}>
                      {rec && (
                        <Text style={styles.calendarEmoji}>
                          {rec.feeling.split(' ')[0]}
                        </Text>
                      )}
                      {exr && (
                        <Text style={styles.calendarExerciseIcon}>
                          {getExerciseIcon(exr.type)}
                        </Text>
                      )}
                    </View>
                  </>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </Card>

      {/* Monthly Gut Health */}
      <Card>
        <Text style={[styles.sectionTitle, { marginBottom: 16 }]}>
          {'\u{1FA7A}'} Gut Health This Month
        </Text>
        {[
          { emoji: '\u{1F604}', label: 'Good Days', count: goodDays, pct: goodPct, color: Colors.success },
          { emoji: '\u{1F610}', label: 'Okay Days', count: okayDays, pct: okayPct, color: Colors.warning },
          { emoji: '\u{1F623}', label: 'Bad Days', count: badDays, pct: badPct, color: Colors.error },
        ].map((item, i) => (
          <View key={i} style={styles.healthRow}>
            <View style={styles.healthRowHeader}>
              <Text style={styles.healthLabel}>
                {item.emoji}{' '}
                <Text style={[styles.healthLabelBold, { color: item.color }]}>
                  {item.label}
                </Text>
              </Text>
              <Text style={[styles.healthValue, { color: item.color }]}>
                {item.count} ({item.pct}%)
              </Text>
            </View>
            <View style={styles.healthBarTrack}>
              <View
                style={[
                  styles.healthBar,
                  { width: `${item.pct}%`, backgroundColor: item.color },
                ]}
              />
            </View>
          </View>
        ))}
      </Card>

      {/* Selected Day Detail */}
      <Card>
        <Text style={[styles.sectionTitle, { marginBottom: 12 }]}>
          {'\u{1F4CB}'} {monthNames[month]} {selectedDate}
        </Text>
        {dailyRecords[selectedDate] || exerciseRecords[selectedDate] ? (
          <View>
            {dailyRecords[selectedDate] && (
              <View style={styles.dayDetailRow}>
                <View style={styles.dayDetailItem}>
                  <Text style={styles.dayDetailEmoji}>
                    {dailyRecords[selectedDate].feeling.split(' ')[0]}
                  </Text>
                  <Text style={styles.dayDetailLabel}>
                    {dailyRecords[selectedDate].feeling.split(' ')[1]}
                  </Text>
                </View>
                <View style={styles.dayDetailItem}>
                  <Text
                    style={[
                      styles.dayDetailValue,
                      {
                        color:
                          dailyRecords[selectedDate].score >= 75
                            ? Colors.success
                            : Colors.warning,
                      },
                    ]}
                  >
                    {dailyRecords[selectedDate].score}
                  </Text>
                  <Text style={styles.dayDetailLabel}>Score</Text>
                </View>
                <View style={styles.dayDetailItem}>
                  <Text style={[styles.dayDetailValue, { color: Colors.primary }]}>
                    {dailyRecords[selectedDate].stoolCount}
                  </Text>
                  <Text style={styles.dayDetailLabel}>Bowel</Text>
                </View>
              </View>
            )}
            {exerciseRecords[selectedDate] && (
              <View style={styles.exerciseDetail}>
                <Text style={styles.exerciseDetailIcon}>
                  {getExerciseIcon(exerciseRecords[selectedDate].type)}
                </Text>
                <View style={styles.exerciseDetailInfo}>
                  <Text style={styles.exerciseDetailTitle}>
                    {getExerciseLabel(exerciseRecords[selectedDate].type)}
                  </Text>
                  <Text style={styles.exerciseDetailStats}>
                    {exerciseRecords[selectedDate].duration}min {'\u00B7'}{' '}
                    {exerciseRecords[selectedDate].calories}kcal {'\u00B7'}{' '}
                    {exerciseRecords[selectedDate].intensity}
                  </Text>
                  <Text style={styles.exerciseDetailSource}>
                    via {exerciseRecords[selectedDate].source}
                  </Text>
                </View>
              </View>
            )}
          </View>
        ) : (
          <View style={styles.noRecords}>
            <Text style={styles.noRecordsText}>{'\u{1F4ED}'} No records</Text>
          </View>
        )}
      </Card>

      {/* Monthly Stats */}
      <Card>
        <Text style={[styles.sectionTitle, { marginBottom: 14 }]}>
          {'\u{1F4CA}'} Monthly Stats
        </Text>
        <View style={styles.statsGrid}>
          {[
            { v: totalRecords, label: 'Gut Logs', bg: Colors.greenBg, c: Colors.successDark },
            { v: totalExerciseDays, label: 'Exercise', bg: Colors.orangeBgLight, c: Colors.orange },
            { v: monthlyAvg, label: 'Avg Score', bg: Colors.blueBg, c: Colors.blue },
            { v: totalBowel, label: 'Bowel', bg: Colors.pinkBg, c: Colors.pink },
            { v: totalCalories, label: 'Total kcal', bg: Colors.orangeBg, c: Colors.orange },
            { v: `${avgDuration}m`, label: 'Avg Duration', bg: Colors.purpleBg, c: Colors.purpleDark },
          ].map((item, i) => (
            <View key={i} style={[styles.statItem, { backgroundColor: item.bg }]}>
              <Text style={[styles.statValue, { color: item.c }]}>{item.v}</Text>
              <Text style={[styles.statLabel, { color: item.c }]}>{item.label}</Text>
            </View>
          ))}
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
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 11,
    color: '#999',
    marginBottom: 14,
  },
  // Chart
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 110,
    paddingHorizontal: 4,
  },
  chartColumn: {
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  chartScoreLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
  chartBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
  },
  chartBar: {
    width: 14,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  chartDayLabel: {
    fontSize: 11,
    color: '#999',
  },
  chartLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginTop: 12,
  },
  legendItem: {
    fontSize: 10,
  },
  // Calendar
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  calendarArrow: {
    color: '#bbb',
    fontSize: 16,
  },
  calendarTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarCell: {
    width: '14.28%',
    minHeight: 46,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
    borderRadius: 10,
  },
  calendarCellSelected: {
    backgroundColor: Colors.primary,
  },
  calendarCellToday: {
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  dayHeader: {
    fontSize: 11,
    fontWeight: '600',
    color: '#999',
  },
  calendarDay: {
    fontSize: 10,
    color: '#333',
  },
  calendarIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 1,
    flexWrap: 'wrap',
  },
  calendarEmoji: {
    fontSize: 12,
  },
  calendarExerciseIcon: {
    fontSize: 10,
  },
  // Health rows
  healthRow: {
    marginBottom: 12,
  },
  healthRowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  healthLabel: {
    fontSize: 12,
  },
  healthLabelBold: {
    fontWeight: '600',
  },
  healthValue: {
    fontWeight: '700',
    fontSize: 12,
  },
  healthBarTrack: {
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
  },
  healthBar: {
    height: '100%',
    borderRadius: 4,
  },
  // Day detail
  dayDetailRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  dayDetailItem: {
    flex: 1,
    backgroundColor: Colors.warmBg,
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  dayDetailEmoji: {
    fontSize: 28,
  },
  dayDetailValue: {
    fontSize: 22,
    fontWeight: '700',
  },
  dayDetailLabel: {
    fontSize: 10,
    color: '#999',
  },
  exerciseDetail: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: Colors.orangeBg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  exerciseDetailIcon: {
    fontSize: 28,
  },
  exerciseDetailInfo: {},
  exerciseDetailTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.orange,
  },
  exerciseDetailStats: {
    fontSize: 12,
    color: '#999',
  },
  exerciseDetailSource: {
    fontSize: 10,
    color: '#bbb',
    marginTop: 2,
  },
  noRecords: {
    alignItems: 'center',
    padding: 20,
  },
  noRecordsText: {
    color: '#999',
    fontSize: 13,
  },
  // Stats grid
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statItem: {
    width: '31%',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },
});

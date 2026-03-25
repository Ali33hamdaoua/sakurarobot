import React, { useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useAppStore } from '../store';
import { supervisionWs } from '../services/websocket';
import { RobotStatusCard } from '../components/RobotStatusCard';
import { MissionCard } from '../components/MissionCard';
import { COLORS, MISSION_STATUS_LABELS } from '../utils/constants';

export function DashboardScreen() {
  const { robotState, missionQueue, historyLog, handleWsEvent } = useAppStore();

  useEffect(() => {
    supervisionWs.connect();
    const unsub = supervisionWs.onEvent(handleWsEvent);
    return () => {
      unsub();
      supervisionWs.disconnect();
    };
  }, []);

  return (
    <ScrollView style={styles.container}>
      {/* Status du robot */}
      <RobotStatusCard state={robotState} />

      {/* Mission en cours */}
      {robotState.currentMission && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mission en cours</Text>
          <View style={styles.currentMission}>
            <Text style={styles.missionType}>
              {robotState.currentMission.type.replace('_', ' ')}
            </Text>
            <Text style={styles.missionStatus}>
              {MISSION_STATUS_LABELS[robotState.currentMission.status]}
            </Text>
          </View>
        </View>
      )}

      {/* File d'attente */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Missions en attente ({missionQueue.length})
        </Text>
        {missionQueue.map((mission) => (
          <MissionCard key={mission.id} mission={mission} />
        ))}
        {missionQueue.length === 0 && (
          <Text style={styles.emptyText}>Aucune mission en attente</Text>
        )}
      </View>

      {/* Historique */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Historique</Text>
        {historyLog.slice(0, 10).map((entry, i) => (
          <View key={i} style={styles.historyEntry}>
            <Text style={[styles.historyTime, entry.level === 'error' && { color: COLORS.red }]}>
              {new Date(entry.timestamp).toLocaleTimeString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
            <Text style={styles.historyMessage}>{entry.message}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightBlue,
    padding: 16,
  },
  section: {
    marginTop: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.darkBlue,
    marginBottom: 12,
  },
  currentMission: {
    padding: 12,
    backgroundColor: COLORS.lightBlue,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.green,
  },
  missionType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.darkBlue,
  },
  missionStatus: {
    fontSize: 13,
    color: COLORS.gray,
    marginTop: 4,
  },
  emptyText: {
    color: COLORS.gray,
    fontSize: 14,
    fontStyle: 'italic',
  },
  historyEntry: {
    flexDirection: 'row',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    gap: 12,
  },
  historyTime: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.red,
    minWidth: 50,
  },
  historyMessage: {
    fontSize: 13,
    color: COLORS.darkBlue,
    flex: 1,
  },
});

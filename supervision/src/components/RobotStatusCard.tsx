import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RobotState, RobotOperationalStatus } from '../services/types';
import { COLORS, STATUS_LABELS } from '../utils/constants';

interface Props {
  state: RobotState;
}

export function RobotStatusCard({ state }: Props) {
  const statusColor = getStatusColor(state.status);
  const statusLabel = STATUS_LABELS[state.status] || state.status;

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: COLORS.darkBlue }]}>
        <Text style={styles.robotName}>{state.robotName}</Text>
        <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
          <Text style={styles.statusText}>{statusLabel}</Text>
        </View>
        <View style={styles.batteryContainer}>
          <Text style={styles.batteryText}>{state.battery.level}%</Text>
        </View>
        {state.currentLocation && (
          <Text style={styles.locationText}>{state.currentLocation}</Text>
        )}
      </View>

      {/* Current mission */}
      {state.currentMission && (
        <View style={styles.missionInfo}>
          <Text style={styles.missionLabel}>Mission en cours</Text>
          <Text style={styles.missionType}>
            {state.currentMission.type.replace('_', ' ')}
          </Text>
        </View>
      )}
    </View>
  );
}

function getStatusColor(status: RobotOperationalStatus): string {
  switch (status) {
    case RobotOperationalStatus.IDLE: return COLORS.green;
    case RobotOperationalStatus.EXECUTING_MISSION: return COLORS.mediumBlue;
    case RobotOperationalStatus.CHARGING: return COLORS.orange;
    case RobotOperationalStatus.MANUAL_CONTROL: return COLORS.mediumBlue;
    case RobotOperationalStatus.ERROR: return COLORS.red;
    case RobotOperationalStatus.OFFLINE: return COLORS.gray;
    default: return COLORS.gray;
  }
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  robotName: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  batteryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  batteryText: {
    color: 'white',
    fontSize: 14,
  },
  locationText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
    marginLeft: 'auto',
  },
  missionInfo: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  missionLabel: {
    fontSize: 12,
    color: COLORS.gray,
    marginBottom: 4,
  },
  missionType: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.darkBlue,
  },
});

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Mission, MissionStatus } from '../services/types';
import { COLORS, MISSION_TYPE_LABELS, MISSION_STATUS_LABELS } from '../utils/constants';

interface Props {
  mission: Mission;
  onCancel?: (id: string) => void;
}

export function MissionCard({ mission, onCancel }: Props) {
  const isActive = [
    MissionStatus.IN_PROGRESS,
    MissionStatus.NAVIGATING,
    MissionStatus.ARRIVED,
    MissionStatus.WAITING_CONFIRMATION,
  ].includes(mission.status);

  const isCancellable = [
    MissionStatus.PENDING,
    MissionStatus.QUEUED,
  ].includes(mission.status);

  const isUrgent = mission.type === 'LIVRAISON_URGENTE';

  return (
    <View style={[styles.card, isActive && styles.activeCard]}>
      <View style={styles.header}>
        {isUrgent && (
          <View style={styles.urgentBadge}>
            <Text style={styles.urgentText}>URGENCE</Text>
          </View>
        )}
        <Text style={styles.typeLabel}>
          {MISSION_TYPE_LABELS[mission.type] || mission.type}
        </Text>
      </View>

      <Text style={styles.statusText}>
        {MISSION_STATUS_LABELS[mission.status] || mission.status}
      </Text>

      <Text style={styles.timeText}>
        {new Date(mission.createdAt).toLocaleTimeString('fr-FR', {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </Text>

      {isCancellable && onCancel && (
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => onCancel(mission.id)}
        >
          <Text style={styles.cancelText}>Annuler</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.mediumBlue,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  activeCard: {
    borderLeftColor: COLORS.green,
    backgroundColor: '#f0fdf4',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  urgentBadge: {
    backgroundColor: COLORS.red,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  urgentText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  typeLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.darkBlue,
  },
  statusText: {
    fontSize: 13,
    color: COLORS.gray,
    marginBottom: 2,
  },
  timeText: {
    fontSize: 12,
    color: COLORS.gray,
  },
  cancelButton: {
    marginTop: 8,
    alignSelf: 'flex-end',
  },
  cancelText: {
    color: COLORS.red,
    fontSize: 13,
    fontWeight: '600',
  },
});

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppStore } from '../store';
import { COLORS } from '../utils/constants';

export function SettingsScreen() {
  const { robotState } = useAppStore();

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Parametres</Text>

        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Robot ID</Text>
          <Text style={styles.settingValue}>{robotState.robotId}</Text>
        </View>

        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Nom</Text>
          <Text style={styles.settingValue}>{robotState.robotName}</Text>
        </View>

        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Batterie</Text>
          <Text style={styles.settingValue}>
            {robotState.battery.level}% {robotState.battery.isCharging ? '(en charge)' : ''}
          </Text>
        </View>

        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Position</Text>
          <Text style={styles.settingValue}>
            {robotState.currentLocation || 'Inconnue'}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Connexion</Text>

        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Backend URL</Text>
          <Text style={styles.settingValue}>
            {process.env.EXPO_PUBLIC_BACKEND_URL || 'http://localhost:8080'}
          </Text>
        </View>

        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Orthalis Cabinet</Text>
          <Text style={styles.settingValue}>64005 (test)</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightBlue,
    padding: 16,
    gap: 16,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.darkBlue,
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingLabel: {
    fontSize: 14,
    color: COLORS.darkBlue,
  },
  settingValue: {
    fontSize: 14,
    color: COLORS.gray,
  },
});

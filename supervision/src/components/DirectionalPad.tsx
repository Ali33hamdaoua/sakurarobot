import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Direction } from '../services/types';
import { COLORS } from '../utils/constants';

interface Props {
  onMove: (direction: Direction) => void;
  onStop: () => void;
  disabled?: boolean;
}

export function DirectionalPad({ onMove, onStop, disabled }: Props) {
  const opacity = disabled ? 0.4 : 1;

  return (
    <View style={[styles.container, { opacity }]}>
      <Text style={styles.title}>Controle Manuel</Text>

      <View style={styles.padContainer}>
        {/* Ligne du haut */}
        <View style={styles.row}>
          <View style={styles.spacer} />
          <PadButton
            label="^"
            onPress={() => onMove(Direction.FORWARD)}
            disabled={disabled}
          />
          <View style={styles.spacer} />
        </View>

        {/* Ligne du milieu */}
        <View style={styles.row}>
          <PadButton
            label="<"
            onPress={() => onMove(Direction.LEFT)}
            disabled={disabled}
          />
          <PadButton
            label="O"
            onPress={onStop}
            disabled={disabled}
            isCenter
          />
          <PadButton
            label=">"
            onPress={() => onMove(Direction.RIGHT)}
            disabled={disabled}
          />
        </View>

        {/* Ligne du bas */}
        <View style={styles.row}>
          <View style={styles.spacer} />
          <PadButton
            label="v"
            onPress={() => onMove(Direction.BACKWARD)}
            disabled={disabled}
          />
          <View style={styles.spacer} />
        </View>
      </View>
    </View>
  );
}

function PadButton({
  label,
  onPress,
  disabled,
  isCenter,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  isCenter?: boolean;
}) {
  return (
    <TouchableOpacity
      style={[styles.button, isCenter && styles.centerButton]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text style={[styles.buttonText, isCenter && styles.centerButtonText]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.darkBlue,
    borderRadius: 12,
    padding: 16,
  },
  title: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  padContainer: {
    alignItems: 'center',
    gap: 4,
  },
  row: {
    flexDirection: 'row',
    gap: 4,
  },
  spacer: {
    width: 56,
    height: 56,
  },
  button: {
    width: 56,
    height: 56,
    backgroundColor: COLORS.mediumBlue,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerButton: {
    backgroundColor: '#1a2a4a',
    borderRadius: 28,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  centerButtonText: {
    fontSize: 16,
  },
});

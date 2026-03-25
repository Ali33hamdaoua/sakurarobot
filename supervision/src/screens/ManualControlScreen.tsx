import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAppStore } from '../store';
import { DirectionalPad } from '../components/DirectionalPad';
import { sendManualMove, sendManualStop, sendSpeak, sendToCharge } from '../services/api';
import { Direction, RobotOperationalStatus } from '../services/types';
import { COLORS } from '../utils/constants';

export function ManualControlScreen() {
  const { robotState } = useAppStore();
  const [ttsText, setTtsText] = useState('');
  const [speed, setSpeed] = useState(0.5);

  const isManualAllowed =
    robotState.status === RobotOperationalStatus.IDLE ||
    robotState.status === RobotOperationalStatus.MANUAL_CONTROL;

  const handleMove = async (direction: Direction) => {
    try {
      await sendManualMove(direction, speed);
    } catch (e) {
      Alert.alert('Erreur', 'Impossible d\'envoyer la commande');
    }
  };

  const handleStop = async () => {
    try {
      await sendManualStop();
    } catch (e) {
      Alert.alert('Erreur', 'Impossible d\'arreter le robot');
    }
  };

  const handleSpeak = async () => {
    if (!ttsText.trim()) return;
    try {
      await sendSpeak(ttsText);
      setTtsText('');
    } catch (e) {
      Alert.alert('Erreur', 'Impossible d\'envoyer le TTS');
    }
  };

  const handleCharge = async () => {
    try {
      await sendToCharge();
    } catch (e) {
      Alert.alert('Erreur', 'Impossible d\'envoyer a la recharge');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {/* D-Pad */}
        <DirectionalPad
          onMove={handleMove}
          onStop={handleStop}
          disabled={!isManualAllowed}
        />

        {/* Controles supplementaires */}
        <View style={styles.controls}>
          {/* Vitesse */}
          <View style={styles.speedControl}>
            <Text style={styles.label}>Vitesse: {speed.toFixed(1)} m/s</Text>
            <View style={styles.speedButtons}>
              <TouchableOpacity
                style={styles.speedButton}
                onPress={() => setSpeed(Math.max(0.1, speed - 0.1))}
              >
                <Text style={styles.speedButtonText}>-</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.speedButton}
                onPress={() => setSpeed(Math.min(0.8, speed + 0.1))}
              >
                <Text style={styles.speedButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* TTS */}
          <View style={styles.ttsSection}>
            <Text style={styles.label}>Synthese vocale</Text>
            <TextInput
              style={styles.ttsInput}
              placeholder="Texte a prononcer..."
              value={ttsText}
              onChangeText={setTtsText}
              multiline
            />
            <TouchableOpacity style={styles.ttsButton} onPress={handleSpeak}>
              <Text style={styles.ttsButtonText}>Parler</Text>
            </TouchableOpacity>
          </View>

          {/* Actions rapides */}
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.chargeButton} onPress={handleCharge}>
              <Text style={styles.chargeButtonText}>Recharger</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.emergencyButton} onPress={handleStop}>
              <Text style={styles.emergencyButtonText}>ARRET</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {!isManualAllowed && (
        <View style={styles.disabledOverlay}>
          <Text style={styles.disabledText}>
            Controle manuel indisponible pendant une mission
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightBlue,
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  controls: {
    flex: 1,
    gap: 16,
  },
  speedControl: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.darkBlue,
    marginBottom: 8,
  },
  speedButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  speedButton: {
    backgroundColor: COLORS.mediumBlue,
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  speedButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  ttsSection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
  },
  ttsInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    minHeight: 60,
    marginBottom: 8,
  },
  ttsButton: {
    backgroundColor: COLORS.mediumBlue,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  ttsButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
  },
  chargeButton: {
    flex: 1,
    backgroundColor: COLORS.orange,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  chargeButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  emergencyButton: {
    flex: 1,
    backgroundColor: COLORS.red,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  emergencyButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  disabledOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 16,
    alignItems: 'center',
  },
  disabledText: {
    color: 'white',
    fontWeight: '600',
  },
});

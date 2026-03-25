import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';
import { useAppStore } from '../store';
import { MissionCard } from '../components/MissionCard';
import { createMission, cancelMission } from '../services/api';
import { MissionType, MissionParams } from '../services/types';
import { COLORS, MISSION_TYPE_LABELS } from '../utils/constants';

export function MissionsScreen() {
  const { missionQueue } = useAppStore();
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleCancel = async (id: string) => {
    try {
      await cancelMission(id);
    } catch (e) {
      Alert.alert('Erreur', 'Impossible d\'annuler la mission');
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => setShowCreateForm(!showCreateForm)}
        >
          <Text style={styles.createButtonText}>+ Nouvelle mission</Text>
        </TouchableOpacity>
      </View>

      {/* Formulaire de création */}
      {showCreateForm && (
        <CreateMissionForm onCreated={() => setShowCreateForm(false)} />
      )}

      {/* File d'attente */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          File d'attente ({missionQueue.length})
        </Text>
        {missionQueue.map((mission) => (
          <MissionCard
            key={mission.id}
            mission={mission}
            onCancel={handleCancel}
          />
        ))}
        {missionQueue.length === 0 && (
          <Text style={styles.emptyText}>Aucune mission dans la file</Text>
        )}
      </View>
    </ScrollView>
  );
}

function CreateMissionForm({ onCreated }: { onCreated: () => void }) {
  const [selectedType, setSelectedType] = useState<MissionType>(MissionType.LIVRAISON_STANDARD);
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [patientName, setPatientName] = useState('');
  const [room, setRoom] = useState('');
  const [practitioner, setPractitioner] = useState('');

  const handleSubmit = async () => {
    try {
      let params: MissionParams;

      switch (selectedType) {
        case MissionType.LIVRAISON_URGENTE:
        case MissionType.LIVRAISON_STANDARD:
          params = {
            type: 'livraison',
            fromLocation,
            toLocation,
            description: '',
            urgent: selectedType === MissionType.LIVRAISON_URGENTE,
          };
          break;
        case MissionType.APPEL_PATIENT:
          params = {
            type: 'appel_patient',
            patientDisplayName: patientName,
            waitingRoomLocation: 'salle_attente',
            consultationRoom: room,
            practitionerName: practitioner,
          };
          break;
        case MissionType.ACCUEIL:
          params = {
            type: 'accueil',
            kioskLocation: 'kiosque',
            waitingRoomLocation: 'salle_attente',
          };
          break;
        default:
          params = {
            type: 'promotion',
          };
      }

      await createMission(selectedType, params);
      onCreated();
    } catch (e) {
      Alert.alert('Erreur', 'Impossible de creer la mission');
    }
  };

  return (
    <View style={styles.form}>
      <Text style={styles.formTitle}>Nouvelle mission</Text>

      {/* Type selector */}
      <View style={styles.typeSelector}>
        {Object.values(MissionType).map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.typeButton,
              selectedType === type && styles.typeButtonActive,
            ]}
            onPress={() => setSelectedType(type)}
          >
            <Text style={[
              styles.typeButtonText,
              selectedType === type && styles.typeButtonTextActive,
            ]}>
              {MISSION_TYPE_LABELS[type]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Champs conditionnels */}
      {(selectedType === MissionType.LIVRAISON_STANDARD ||
        selectedType === MissionType.LIVRAISON_URGENTE) && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Depuis (ex: salle_3)"
            value={fromLocation}
            onChangeText={setFromLocation}
          />
          <TextInput
            style={styles.input}
            placeholder="Vers (ex: sterilisation)"
            value={toLocation}
            onChangeText={setToLocation}
          />
        </>
      )}

      {selectedType === MissionType.APPEL_PATIENT && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Prenom du patient"
            value={patientName}
            onChangeText={setPatientName}
          />
          <TextInput
            style={styles.input}
            placeholder="Salle (ex: Salle 3)"
            value={room}
            onChangeText={setRoom}
          />
          <TextInput
            style={styles.input}
            placeholder="Praticien (ex: Dr Durieux)"
            value={practitioner}
            onChangeText={setPractitioner}
          />
        </>
      )}

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Creer la mission</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightBlue,
    padding: 16,
  },
  actions: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  createButton: {
    backgroundColor: COLORS.mediumBlue,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createButtonText: {
    color: 'white',
    fontWeight: '600',
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
    marginBottom: 12,
  },
  emptyText: {
    color: COLORS.gray,
    fontStyle: 'italic',
  },
  form: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.darkBlue,
    marginBottom: 12,
  },
  typeSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  typeButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.mediumBlue,
  },
  typeButtonActive: {
    backgroundColor: COLORS.mediumBlue,
  },
  typeButtonText: {
    fontSize: 13,
    color: COLORS.mediumBlue,
  },
  typeButtonTextActive: {
    color: 'white',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: COLORS.green,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 15,
  },
});

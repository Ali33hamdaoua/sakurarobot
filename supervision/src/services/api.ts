import axios from 'axios';
import { Direction, Mission, MissionType, MissionParams, RobotState } from './types';

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL || 'http://192.168.100.120:8080';

const api = axios.create({
  baseURL: `${BACKEND_URL}/api`,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// ─── Robot ─────────────────────────────────────────────────────

export const getRobotStatus = () =>
  api.get<RobotState>('/robot/status').then(r => r.data);

export const sendManualMove = (direction: Direction, speed: number = 0.5) =>
  api.post('/robot/manual/move', { direction, speed });

export const sendManualStop = () =>
  api.post('/robot/manual/stop');

export const sendSpeak = (text: string, language: string = 'fr') =>
  api.post('/robot/speak', { text, language });

export const sendToCharge = () =>
  api.post('/robot/charge');

// ─── Missions ──────────────────────────────────────────────────

export const getMissions = (status?: string) =>
  api.get<Mission[]>('/missions', { params: { status } }).then(r => r.data);

export const getMissionQueue = () =>
  api.get<Mission[]>('/missions/queue').then(r => r.data);

export const getMissionHistory = (limit: number = 50) =>
  api.get<Mission[]>('/missions/history', { params: { limit } }).then(r => r.data);

export const createMission = (type: MissionType, params: MissionParams) =>
  api.post<Mission>('/missions', { type, params }).then(r => r.data);

export const cancelMission = (id: string) =>
  api.put(`/missions/${id}/cancel`);

// ─── Orthalis ──────────────────────────────────────────────────

export const searchPatients = (params: { telephone?: string; nom?: string; prenom?: string }) =>
  api.get('/orthalis/patients', { params }).then(r => r.data);

export const getPractitioners = () =>
  api.get('/orthalis/practitioners').then(r => r.data);

export const getCareTypes = () =>
  api.get('/orthalis/care-types').then(r => r.data);

export default api;

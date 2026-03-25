// Types miroirs des modèles Kotlin shared

export enum MissionType {
  LIVRAISON_URGENTE = 'LIVRAISON_URGENTE',
  APPEL_PATIENT = 'APPEL_PATIENT',
  LIVRAISON_STANDARD = 'LIVRAISON_STANDARD',
  ACCUEIL = 'ACCUEIL',
  PROMOTION = 'PROMOTION',
}

export enum MissionStatus {
  PENDING = 'PENDING',
  QUEUED = 'QUEUED',
  IN_PROGRESS = 'IN_PROGRESS',
  NAVIGATING = 'NAVIGATING',
  ARRIVED = 'ARRIVED',
  WAITING_CONFIRMATION = 'WAITING_CONFIRMATION',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

export enum RobotOperationalStatus {
  IDLE = 'IDLE',
  EXECUTING_MISSION = 'EXECUTING_MISSION',
  CHARGING = 'CHARGING',
  MANUAL_CONTROL = 'MANUAL_CONTROL',
  ERROR = 'ERROR',
  OFFLINE = 'OFFLINE',
}

export enum Direction {
  FORWARD = 'FORWARD',
  BACKWARD = 'BACKWARD',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
  ROTATE_LEFT = 'ROTATE_LEFT',
  ROTATE_RIGHT = 'ROTATE_RIGHT',
}

export interface Mission {
  id: string;
  type: MissionType;
  status: MissionStatus;
  priority: number;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  params: MissionParams;
}

export type MissionParams =
  | { type: 'accueil'; patientFirstName?: string; kioskLocation: string; waitingRoomLocation: string }
  | { type: 'appel_patient'; patientDisplayName: string; waitingRoomLocation: string; consultationRoom: string; practitionerName: string }
  | { type: 'livraison'; fromLocation: string; toLocation: string; description: string; urgent: boolean }
  | { type: 'promotion'; videoUrl?: string; cruiseRoute?: string; displayMessage?: string };

export interface RobotPosition {
  x: number;
  y: number;
  theta: number;
  locationName?: string;
}

export interface BatteryInfo {
  level: number;
  isCharging: boolean;
}

export interface RobotState {
  robotId: string;
  robotName: string;
  status: RobotOperationalStatus;
  currentMission?: Mission;
  position?: RobotPosition;
  battery: BatteryInfo;
  currentLocation?: string;
  isNavigating: boolean;
  lastHeartbeat?: string;
}

// WebSocket events
export interface WsRobotStateSnapshot {
  type: 'robot_state_snapshot';
  id: string;
  timestamp: string;
  state: RobotState;
}

export interface WsQueueUpdate {
  type: 'queue_update';
  id: string;
  timestamp: string;
  queue: Mission[];
}

export interface WsHistoryEntry {
  type: 'history_entry';
  id: string;
  timestamp: string;
  message: string;
  level: string;
}

export type SupervisionEvent = WsRobotStateSnapshot | WsQueueUpdate | WsHistoryEntry;

// Orthalis types
export interface Practitioner {
  idPraticien: number;
  nomPrenom: string;
  specialite: string;
}

export interface PatientInfo {
  idPatient: number;
  nom: string;
  prenom: string;
  dateNaissance?: string;
  telephones: string[];
  rendezVous: Array<{
    date: string;
    idRdv: number;
    idActe: number;
    idPraticien: number;
  }>;
}

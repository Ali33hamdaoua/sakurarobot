import { create } from 'zustand';
import {
  RobotState,
  RobotOperationalStatus,
  Mission,
  SupervisionEvent,
} from '../services/types';

interface AppStore {
  // Robot state
  robotState: RobotState;
  setRobotState: (state: RobotState) => void;

  // Mission queue
  missionQueue: Mission[];
  setMissionQueue: (queue: Mission[]) => void;

  // History log
  historyLog: Array<{ timestamp: string; message: string; level: string }>;
  addHistoryEntry: (entry: { timestamp: string; message: string; level: string }) => void;

  // WebSocket connection
  isWsConnected: boolean;
  setWsConnected: (connected: boolean) => void;

  // Handle incoming WebSocket event
  handleWsEvent: (event: SupervisionEvent) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  robotState: {
    robotId: 'sakura_01',
    robotName: 'Sakura 01',
    status: RobotOperationalStatus.OFFLINE,
    battery: { level: 0, isCharging: false },
    isNavigating: false,
  },
  setRobotState: (state) => set({ robotState: state }),

  missionQueue: [],
  setMissionQueue: (queue) => set({ missionQueue: queue }),

  historyLog: [],
  addHistoryEntry: (entry) =>
    set((state) => ({
      historyLog: [entry, ...state.historyLog].slice(0, 200),
    })),

  isWsConnected: false,
  setWsConnected: (connected) => set({ isWsConnected: connected }),

  handleWsEvent: (event) => {
    set((state) => {
      switch (event.type) {
        case 'robot_state_snapshot':
          return { robotState: event.state };
        case 'queue_update':
          return { missionQueue: event.queue };
        case 'history_entry':
          return {
            historyLog: [
              { timestamp: event.timestamp, message: event.message, level: event.level },
              ...state.historyLog,
            ].slice(0, 200),
          };
        default:
          return state;
      }
    });
  },
}));

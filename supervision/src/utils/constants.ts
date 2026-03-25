export const COLORS = {
  darkBlue: '#2C3E6B',
  mediumBlue: '#4A6FA5',
  lightBlue: '#E8EDF5',
  white: '#FAFBFD',
  green: '#4CAF50',
  red: '#E53935',
  orange: '#FF9800',
  gray: '#9E9E9E',
  lightGray: '#F5F5F5',
};

export const MISSION_TYPE_LABELS: Record<string, string> = {
  LIVRAISON_URGENTE: 'Livraison urgente',
  APPEL_PATIENT: 'Appel patient',
  LIVRAISON_STANDARD: 'Livraison standard',
  ACCUEIL: 'Accueil',
  PROMOTION: 'Promotion',
};

export const STATUS_LABELS: Record<string, string> = {
  IDLE: 'En attente',
  EXECUTING_MISSION: 'En mission',
  CHARGING: 'En charge',
  MANUAL_CONTROL: 'Mode manuel',
  ERROR: 'Erreur',
  OFFLINE: 'Hors ligne',
};

export const MISSION_STATUS_LABELS: Record<string, string> = {
  PENDING: 'En attente',
  QUEUED: 'Dans la file',
  IN_PROGRESS: 'En cours',
  NAVIGATING: 'Navigation',
  ARRIVED: 'Arrivé',
  WAITING_CONFIRMATION: 'Attente confirmation',
  COMPLETED: 'Terminée',
  FAILED: 'Échouée',
  CANCELLED: 'Annulée',
};

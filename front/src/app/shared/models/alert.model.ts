export interface Alert {
  message: string;
  type: 'success' | 'warning' | 'error' | 'info';
  accept?: () => void;
  dismiss?: () => void;
}

export type AlertWithTimeout = Alert & {
  timeout: number;
};

export interface Alerts {
  alerts: AlertWithTimeout[];
}

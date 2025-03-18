export interface Notification {
  content: string;
  time: number;
  from: string;
  type: string;
}

export interface NotificationData {
  count: number;
  notifications: Notification[];
}

export interface NotificationsList {
  [email: string]: NotificationData;
}

export interface Helps {
  [email: string]: Notification[];
}

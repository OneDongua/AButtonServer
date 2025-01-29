export interface Notification {
    count: number;
    notifications: string[];
}

export interface NotificationsData {
    [email: string]: Notification;
}

export interface NewNotification {
    notification: string
}

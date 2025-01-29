export interface Notification {
    content: string,
    time: number,
    from: string
}

export interface NotificationData {
    count: number;
    notifications: Notification[];
}

export interface NotificationsList {
    [email: string]: NotificationData;
}
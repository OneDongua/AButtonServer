import { Location } from "./PostTypes";

export interface Notification {
    content: string,
    time: number,
    from: string,
    location?: Location
}

export interface NotificationData {
    count: number;
    notifications: Notification[];
}

export interface NotificationsList {
    [email: string]: NotificationData;
}
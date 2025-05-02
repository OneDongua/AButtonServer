export interface Message {
  id: number;
  name: string;
  message: string;
  time: number;
}

export interface ChatList {
  [id: string]: number[];
}
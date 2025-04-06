export enum UserType {
  ADMIN = 0,
  USER = 1,
}

export interface User {
  id: number;
  type: UserType,
  name: string,
  email: string,
  password: string,
  hardware: string,
  disability?: string[],
  tag?: string[],
}

export interface Users {
  [id: number]: User
}

export interface LoginData {
  email: string,
  password: string
}
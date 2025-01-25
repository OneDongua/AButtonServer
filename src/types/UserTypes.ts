export enum UserType {
  ADMIN = 0,
  KIN = 1, // 家属
  VOLUNTEER = 2
}

export interface User {
  id: number;
  type: UserType,
  name: string,
  email: string,
  password: string,
  hardware: string,
  disability?: string[],
}

export interface Users {
  [id: number]: User
}

export interface LoginData {
  email: string,
  password: string
}
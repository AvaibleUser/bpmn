export interface LoginInfo {
  email: string;
  password: string;
}

export interface SignupInfo {
  username: string;
  email: string;
  password: string;
  firstname: string;
  lastname: string;
}

export interface CheckCode {
  email: string;
  code: string;
}

export interface Reset {
  email: string;
  code: string;
  password: string;
  confirmPassword: string;
}

export interface Session {
  token: string;
  id: number;
  email: string;
  username: string;
  role: Role;
  firstname: string;
  lastname: string;
}

export interface Auth {
  session: Session;
}

export type Role = 'CLIENT' | 'ADMIN';

export const Roles: Record<Role, Role> = {
  CLIENT: 'CLIENT',
  ADMIN: 'ADMIN',
};

import { Role } from '../constants/role.constants';

export interface LoginRequest { username: string; password: string; }
export interface LoginResponse { token: string; username: string; role: Role; expiresInSeconds: number; }
export interface Session { token: string; username: string; role: Role; }

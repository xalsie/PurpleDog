import { z } from "zod";
import { loginSchema } from "../lib/validations";

export enum UserRole {
  SELLER = "seller",
  PROFESSIONAL = "professional",
  ADMIN = "admin",
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  isVerfied?: boolean;
  IsIdentityVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
  lastLogin?: string;
}

export interface LoginResponse {
  access_token: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  role: UserRole;
}

export type LoginFormData = z.infer<typeof loginSchema>;

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface UserState {
  user: User | null;
  userRole: UserRole | null;
  isLoading: boolean;
  error: string | null;
}

export interface ApiError {
  message: string;
  statusCode: number;
  timestamp?: string;
}

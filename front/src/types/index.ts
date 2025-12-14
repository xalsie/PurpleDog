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

// Item types
export type UploadedMedia = {
  id: string;
  url: string;
  mediaType: string;
  isPrimary: boolean;
};

export type AnalysisResponse = {
  titre?: string;
  artiste?: string;
  artwork_title?: string;
  category_parent?: string;
  category_enfant?: string[][];
  description_court?: string;
  description_longue?: string;
  estimated_price_min?: number;
  estimated_price_max?: number;
  currency?: string;
  method?: string;
  country_of_origin?: string;
  style?: string;
  signature?: string;
  style_subtype?: string;
  color?: string;
  weight?: string;
  height?: string;
  width?: string;
  depth?: string;
  title?: string;
  short_description?: string;
  long_description?: string;
  estimated_price?: number | string;
  Weight?: string;
};

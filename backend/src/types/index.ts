import { Request } from 'express';
import { User } from '@prisma/client';

// Extended Request interface with user
export interface AuthenticatedRequest extends Request {
  user?: User;
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role?: 'JOB_SEEKER' | 'EMPLOYER';
}

export interface AuthResponse {
  user: Omit<User, 'password'>;
  token: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Error types
export interface AppError extends Error {
  statusCode: number;
  isOperational: boolean;
} 
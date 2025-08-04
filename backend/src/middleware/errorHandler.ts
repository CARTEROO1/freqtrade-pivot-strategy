import { Request, Response, NextFunction } from 'express';
import { AppError } from '../types';

export const errorHandler = (
  error: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = 'Internal Server Error';

  // Handle known errors
  if (error instanceof Error && 'statusCode' in error) {
    const appError = error as AppError;
    statusCode = appError.statusCode;
    message = appError.message;
  }

  // Handle Prisma errors
  if (error.name === 'PrismaClientKnownRequestError') {
    statusCode = 400;
    message = 'Database operation failed';
  }

  if (error.name === 'PrismaClientValidationError') {
    statusCode = 400;
    message = 'Invalid data provided';
  }

  // Handle JWT errors
  if (error.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }

  if (error.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  // Handle validation errors
  if (error.name === 'ValidationError') {
    statusCode = 400;
    message = error.message;
  }

  // Log error in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', {
      message: error.message,
      stack: error.stack,
      url: req.url,
      method: req.method,
      body: req.body,
      params: req.params,
      query: req.query
    });
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
};

export const createError = (message: string, statusCode: number = 500): AppError => {
  const error = new Error(message) as AppError;
  error.statusCode = statusCode;
  error.isOperational = true;
  return error;
};

export const notFound = (resource: string = 'Resource') => {
  return createError(`${resource} not found`, 404);
};

export const badRequest = (message: string = 'Bad request') => {
  return createError(message, 400);
};

export const unauthorized = (message: string = 'Unauthorized') => {
  return createError(message, 401);
};

export const forbidden = (message: string = 'Forbidden') => {
  return createError(message, 403);
};

export const conflict = (message: string = 'Conflict') => {
  return createError(message, 409);
}; 
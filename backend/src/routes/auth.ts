import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { LoginRequest, RegisterRequest, AuthResponse, ApiResponse } from '../types';

const router = Router();
const prisma = new PrismaClient();

// Register new user
router.post('/register', async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, phone, role = 'JOB_SEEKER' }: RegisterRequest = req.body;

    // Validate input
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({
        success: false,
        message: 'Email, password, first name, and last name are required'
      });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone,
        role: role as 'JOB_SEEKER' | 'EMPLOYER'
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isVerified: true,
        isActive: true,
        companyId: true,
        avatar: true,
        phone: true,
        bio: true,
        location: true,
        website: true,
        linkedin: true,
        github: true,
        skills: true,
        experience: true,
        education: true,
        expectedSalary: true,
        availability: true,
        resume: true,
        position: true,
        department: true,
        createdAt: true,
        updatedAt: true
      }
    });

    // Generate JWT token
    const jwtSecret = process.env.JWT_SECRET || 'fallback-secret';
    const token = jwt.sign(
      { userId: user.id },
      jwtSecret as jwt.Secret,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    // Add missing fields for response
    const userResponse = {
      ...user,
      lastLoginAt: null,
      preferences: null
    };

    const response: ApiResponse<AuthResponse> = {
      success: true,
      message: 'User registered successfully',
      data: {
        user: userResponse,
        token
      }
    };

    return res.status(201).json(response);
  } catch (error) {
    return next(error);
  }
});

// Login user
router.post('/login', async (req, res, next) => {
  try {
    const { email, password }: LoginRequest = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        firstName: true,
        lastName: true,
        role: true,
        isVerified: true,
        isActive: true,
        companyId: true,
        avatar: true,
        phone: true,
        bio: true,
        location: true,
        website: true,
        linkedin: true,
        github: true,
        skills: true,
        experience: true,
        education: true,
        expectedSalary: true,
        availability: true,
        resume: true,
        position: true,
        department: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    // Generate JWT token
    const jwtSecret = process.env.JWT_SECRET || 'fallback-secret';
    const token = jwt.sign(
      { userId: user.id },
      jwtSecret as string,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    // Add missing fields for response
    const userResponse = {
      ...userWithoutPassword,
      lastLoginAt: new Date(),
      preferences: null
    };

    const response: ApiResponse<AuthResponse> = {
      success: true,
      message: 'Login successful',
      data: {
        user: userResponse,
        token
      }
    };

    return res.json(response);
  } catch (error) {
    return next(error);
  }
});

// Get current user
router.get('/me', async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }

    const token = authHeader.substring(7);
    const jwtSecret = process.env.JWT_SECRET || 'fallback-secret';
    const decoded = jwt.verify(token, jwtSecret) as { userId: string };
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isVerified: true,
        isActive: true,
        companyId: true,
        avatar: true,
        phone: true,
        bio: true,
        location: true,
        website: true,
        linkedin: true,
        github: true,
        skills: true,
        experience: true,
        education: true,
        expectedSalary: true,
        availability: true,
        resume: true,
        position: true,
        department: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    const response: ApiResponse<typeof user> = {
      success: true,
      message: 'User retrieved successfully',
      data: user
    };

    return res.json(response);
  } catch (error) {
    return next(error);
  }
});

// Refresh token
router.post('/refresh', async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }

    const token = authHeader.substring(7);
    const jwtSecret = process.env.JWT_SECRET || 'fallback-secret';
    const decoded = jwt.verify(token, jwtSecret) as { userId: string };
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isVerified: true,
        isActive: true,
        companyId: true,
        avatar: true,
        phone: true,
        bio: true,
        location: true,
        website: true,
        linkedin: true,
        github: true,
        skills: true,
        experience: true,
        education: true,
        expectedSalary: true,
        availability: true,
        resume: true,
        position: true,
        department: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'User not found or inactive'
      });
    }

    // Generate new token
    const newToken = jwt.sign(
      { userId: user.id },
      jwtSecret as string,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    const response: ApiResponse<{ token: string }> = {
      success: true,
      message: 'Token refreshed successfully',
      data: { token: newToken }
    };

    return res.json(response);
  } catch (error) {
    return next(error);
  }
});

export default router; 
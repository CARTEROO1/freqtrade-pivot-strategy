import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { ApiResponse } from '../types';
import { authMiddleware } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Get all jobs
router.get('/', async (req, res, next) => {
  try {
    const { search, location, type, experience, isRemote, page = '1', limit = '10' } = req.query;

    const pageNum = parseInt(page as string) || 1;
    const limitNum = parseInt(limit as string) || 10;
    const skip = (pageNum - 1) * limitNum;

    const where: any = { isActive: true };

    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    if (location) {
      where.location = { contains: location as string, mode: 'insensitive' };
    }

    if (type) {
      where.type = type;
    }

    if (experience) {
      where.experience = experience;
    }

    if (isRemote !== undefined) {
      where.isRemote = isRemote === 'true';
    }

    const jobs = await prisma.job.findMany({
      where,
      include: {
        company: {
          select: {
            id: true,
            name: true,
            logo: true,
            industry: true,
            size: true,
            location: true
          }
        }
      },
      orderBy: [
        { isFeatured: 'desc' },
        { isUrgent: 'desc' },
        { postedAt: 'desc' }
      ],
      skip,
      take: limitNum
    });

    const total = await prisma.job.count({ where });

    const response: ApiResponse<typeof jobs> = {
      success: true,
      message: 'Jobs retrieved successfully',
      data: jobs,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum)
      }
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

// Get featured jobs
router.get('/featured', async (req, res, next) => {
  try {
    const jobs = await prisma.job.findMany({
      where: {
        isFeatured: true,
        isActive: true
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            logo: true,
            industry: true,
            size: true,
            location: true
          }
        }
      },
      orderBy: { postedAt: 'desc' },
      take: 6
    });

    const response: ApiResponse<typeof jobs> = {
      success: true,
      message: 'Featured jobs retrieved successfully',
      data: jobs
    };

    return res.json(response);
  } catch (error) {
    return next(error);
  }
});

// Get job by ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const job = await prisma.job.findUnique({
      where: { id },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            logo: true,
            industry: true,
            size: true,
            type: true,
            founded: true,
            location: true,
            address: true,
            phone: true,
            email: true,
            website: true,
            description: true
          }
        }
      }
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Increment views
    await prisma.job.update({
      where: { id },
      data: { views: { increment: 1 } }
    });

    const response: ApiResponse<typeof job> = {
      success: true,
      message: 'Job retrieved successfully',
      data: job
    };

    return res.json(response);
  } catch (error) {
    return next(error);
  }
});

export default router; 
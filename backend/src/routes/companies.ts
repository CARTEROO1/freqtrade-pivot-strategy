import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { ApiResponse, AuthenticatedRequest } from '../types';
import { authMiddleware } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Get all companies
router.get('/', async (req, res, next) => {
  try {
    const { search, industry, size, type, page = '1', limit = '10' } = req.query;

    const pageNum = parseInt(page as string) || 1;
    const limitNum = parseInt(limit as string) || 10;
    const skip = (pageNum - 1) * limitNum;

    const where: any = { isActive: true };

    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    if (industry) {
      where.industry = { contains: industry as string, mode: 'insensitive' };
    }

    if (size) {
      where.size = size;
    }

    if (type) {
      where.type = type;
    }

    const companies = await prisma.company.findMany({
      where,
      include: {
        _count: {
          select: {
            jobs: true,
            users: true
          }
        }
      },
      orderBy: { name: 'asc' },
      skip,
      take: limitNum
    });

    const total = await prisma.company.count({ where });

    const response: ApiResponse<typeof companies> = {
      success: true,
      message: 'Companies retrieved successfully',
      data: companies,
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

// Get company by ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const company = await prisma.company.findUnique({
      where: { id },
      include: {
        users: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            position: true,
            department: true
          }
        },
        jobs: {
          where: { isActive: true },
          select: {
            id: true,
            title: true,
            type: true,
            experience: true,
            isRemote: true,
            location: true,
            postedAt: true,
            isUrgent: true,
            isFeatured: true
          },
          orderBy: { postedAt: 'desc' },
          take: 5
        },
        _count: {
          select: {
            jobs: true,
            users: true
          }
        }
      }
    });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    const response: ApiResponse<typeof company> = {
      success: true,
      message: 'Company retrieved successfully',
      data: company
    };

    return res.json(response);
  } catch (error) {
    return next(error);
  }
});

// Create company (authenticated users)
router.post('/', authMiddleware, async (req: AuthenticatedRequest, res, next) => {
  try {
    const {
      name,
      description,
      website,
      industry,
      size,
      type,
      founded,
      location,
      address,
      phone,
      email
    } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Company name is required'
      });
    }

    const company = await prisma.company.create({
      data: {
        name,
        description,
        website,
        industry,
        size: size as any,
        type: type as any,
        founded: founded ? parseInt(founded) : null,
        location,
        address,
        phone,
        email
      }
    });

    // Associate user with company
    await prisma.user.update({
      where: { id: req.user!.id },
      data: { companyId: company.id }
    });

    const response: ApiResponse<typeof company> = {
      success: true,
      message: 'Company created successfully',
      data: company
    };

    return res.status(201).json(response);
  } catch (error) {
    return next(error);
  }
});

export default router; 
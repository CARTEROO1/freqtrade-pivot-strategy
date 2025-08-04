import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { ApiResponse } from '../types';
import { AuthenticatedRequest } from '../types';

const router = Router();
const prisma = new PrismaClient();

// Get user's applications
router.get('/my-applications', async (req: AuthenticatedRequest, res, next) => {
  try {
    const { page = '1', limit = '10' } = req.query;
    const pageNum = parseInt(page as string) || 1;
    const limitNum = parseInt(limit as string) || 10;
    const skip = (pageNum - 1) * limitNum;

    const applications = await prisma.jobApplication.findMany({
      where: { applicantId: req.user!.id },
      include: {
        job: {
          include: {
            company: {
              select: {
                id: true,
                name: true,
                logo: true
              }
            }
          }
        }
      },
      orderBy: { appliedAt: 'desc' },
      skip,
      take: limitNum
    });

    const total = await prisma.jobApplication.count({
      where: { applicantId: req.user!.id }
    });

    const response: ApiResponse<typeof applications> = {
      success: true,
      message: 'Applications retrieved successfully',
      data: applications,
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

// Apply for a job
router.post('/', async (req: AuthenticatedRequest, res, next) => {
  try {
    const { jobId, coverLetter, resume, portfolio, expectedSalary, availability } = req.body;

    if (!jobId) {
      return res.status(400).json({
        success: false,
        message: 'Job ID is required'
      });
    }

    // Check if job exists and is active
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: { company: true }
    });

    if (!job || !job.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Job not found or inactive'
      });
    }

    // Check if user already applied
    const existingApplication = await prisma.jobApplication.findFirst({
      where: {
        jobId,
        applicantId: req.user!.id
      }
    });

    if (existingApplication) {
      return res.status(409).json({
        success: false,
        message: 'You have already applied for this job'
      });
    }

    const application = await prisma.jobApplication.create({
      data: {
        jobId,
        applicantId: req.user!.id,
        companyId: job.companyId,
        coverLetter,
        resume,
        portfolio,
        expectedSalary: expectedSalary ? parseInt(expectedSalary) : null,
        availability
      },
      include: {
        job: {
          include: {
            company: {
              select: {
                id: true,
                name: true,
                logo: true
              }
            }
          }
        }
      }
    });

    // Increment application count
    await prisma.job.update({
      where: { id: jobId },
      data: { applicationCount: { increment: 1 } }
    });

    const response: ApiResponse<typeof application> = {
      success: true,
      message: 'Application submitted successfully',
      data: application
    };

    return res.status(201).json(response);
  } catch (error) {
    return next(error);
  }
});

// Get application by ID
router.get('/:id', async (req: AuthenticatedRequest, res, next) => {
  try {
    const { id } = req.params;

    const application = await prisma.jobApplication.findUnique({
      where: { id },
      include: {
        job: {
          include: {
            company: {
              select: {
                id: true,
                name: true,
                logo: true
              }
            }
          }
        },
        applicant: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            avatar: true
          }
        }
      }
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check if user can view this application
    if (application.applicantId !== req.user!.id && req.user!.role !== 'EMPLOYER') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const response: ApiResponse<typeof application> = {
      success: true,
      message: 'Application retrieved successfully',
      data: application
    };

    return res.json(response);
  } catch (error) {
    return next(error);
  }
});

// Update application status (employers only)
router.patch('/:id/status', async (req: AuthenticatedRequest, res, next) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    if (req.user!.role !== 'EMPLOYER') {
      return res.status(403).json({
        success: false,
        message: 'Only employers can update application status'
      });
    }

    const application = await prisma.jobApplication.findUnique({
      where: { id },
      include: { job: true }
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check if user owns the job
    if (application.job.postedById !== req.user!.id) {
      return res.status(403).json({
        success: false,
        message: 'You can only update applications for jobs you posted'
      });
    }

    const updatedApplication = await prisma.jobApplication.update({
      where: { id },
      data: {
        status: status as any,
        notes,
        reviewedAt: new Date()
      },
      include: {
        job: {
          include: {
            company: {
              select: {
                id: true,
                name: true,
                logo: true
              }
            }
          }
        },
        applicant: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            avatar: true
          }
        }
      }
    });

    const response: ApiResponse<typeof updatedApplication> = {
      success: true,
      message: 'Application status updated successfully',
      data: updatedApplication
    };

    return res.json(response);
  } catch (error) {
    return next(error);
  }
});

export default router; 
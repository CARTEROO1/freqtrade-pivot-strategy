import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { ApiResponse } from '../types';
import { AuthenticatedRequest } from '../types';

const router = Router();
const prisma = new PrismaClient();

// Get user profile
router.get('/profile', async (req: AuthenticatedRequest, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
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
      }
    });

    const response: ApiResponse<typeof user> = {
      success: true,
      message: 'Profile retrieved successfully',
      data: user
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

// Update user profile
router.put('/profile', async (req: AuthenticatedRequest, res, next) => {
  try {
    const updateData = req.body;
    delete updateData.password; // Don't allow password update here
    delete updateData.email; // Don't allow email update here
    delete updateData.role; // Don't allow role update here

    const user = await prisma.user.update({
      where: { id: req.user!.id },
      data: updateData,
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
      }
    });

    const response: ApiResponse<typeof user> = {
      success: true,
      message: 'Profile updated successfully',
      data: user
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

// Get user's saved jobs
router.get('/saved-jobs', async (req: AuthenticatedRequest, res, next) => {
  try {
    const savedJobs = await prisma.savedJob.findMany({
      where: { userId: req.user!.id },
      include: {
        job: {
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
          }
        }
      },
      orderBy: { savedAt: 'desc' }
    });

    const response: ApiResponse<typeof savedJobs> = {
      success: true,
      message: 'Saved jobs retrieved successfully',
      data: savedJobs
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

// Save a job
router.post('/saved-jobs', async (req: AuthenticatedRequest, res, next) => {
  try {
    const { jobId } = req.body;

    if (!jobId) {
      return res.status(400).json({
        success: false,
        message: 'Job ID is required'
      });
    }

    // Check if job exists
    const job = await prisma.job.findUnique({
      where: { id: jobId }
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check if already saved
    const existingSave = await prisma.savedJob.findUnique({
      where: {
        userId_jobId: {
          userId: req.user!.id,
          jobId: jobId
        }
      }
    });

    if (existingSave) {
      return res.status(400).json({
        success: false,
        message: 'Job is already saved'
      });
    }

    const savedJob = await prisma.savedJob.create({
      data: {
        userId: req.user!.id,
        jobId: jobId
      },
      include: {
        job: {
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
          }
        }
      }
    });

    const response: ApiResponse<typeof savedJob> = {
      success: true,
      message: 'Job saved successfully',
      data: savedJob
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

// Unsave a job
router.delete('/saved-jobs/:jobId', async (req: AuthenticatedRequest, res, next) => {
  try {
    const { jobId } = req.params;

    const savedJob = await prisma.savedJob.findUnique({
      where: {
        userId_jobId: {
          userId: req.user!.id,
          jobId: jobId
        }
      }
    });

    if (!savedJob) {
      return res.status(404).json({
        success: false,
        message: 'Saved job not found'
      });
    }

    await prisma.savedJob.delete({
      where: {
        userId_jobId: {
          userId: req.user!.id,
          jobId: jobId
        }
      }
    });

    const response: ApiResponse<null> = {
      success: true,
      message: 'Job removed from saved jobs',
      data: null
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

// Check if a job is saved
router.get('/saved-jobs/:jobId/check', async (req: AuthenticatedRequest, res, next) => {
  try {
    const { jobId } = req.params;

    const savedJob = await prisma.savedJob.findUnique({
      where: {
        userId_jobId: {
          userId: req.user!.id,
          jobId: jobId
        }
      }
    });

    const response: ApiResponse<{ isSaved: boolean }> = {
      success: true,
      message: 'Check completed',
      data: { isSaved: !!savedJob }
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

export default router; 
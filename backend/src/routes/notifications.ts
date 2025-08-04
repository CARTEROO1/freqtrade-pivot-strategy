import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { ApiResponse } from '../types';
import { AuthenticatedRequest } from '../types';

const router = Router();
const prisma = new PrismaClient();

// Get user notifications
router.get('/', async (req: AuthenticatedRequest, res, next) => {
  try {
    const { page = '1', limit = '20', unreadOnly = 'false' } = req.query;
    const pageNum = parseInt(page as string) || 1;
    const limitNum = parseInt(limit as string) || 20;
    const skip = (pageNum - 1) * limitNum;

    const where: any = { userId: req.user!.id };

    if (unreadOnly === 'true') {
      where.isRead = false;
    }

    const notifications = await prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limitNum
    });

    const total = await prisma.notification.count({ where });

    const response: ApiResponse<typeof notifications> = {
      success: true,
      message: 'Notifications retrieved successfully',
      data: notifications,
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

// Mark notification as read
router.patch('/:id/read', async (req: AuthenticatedRequest, res, next) => {
  try {
    const { id } = req.params;

    const notification = await prisma.notification.findUnique({
      where: { id }
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    if (notification.userId !== req.user!.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const updatedNotification = await prisma.notification.update({
      where: { id },
      data: { isRead: true }
    });

    const response: ApiResponse<typeof updatedNotification> = {
      success: true,
      message: 'Notification marked as read',
      data: updatedNotification
    };

    return res.json(response);
  } catch (error) {
    return next(error);
  }
});

// Mark all notifications as read
router.patch('/mark-all-read', async (req: AuthenticatedRequest, res, next) => {
  try {
    await prisma.notification.updateMany({
      where: {
        userId: req.user!.id,
        isRead: false
      },
      data: { isRead: true }
    });

    const response: ApiResponse<null> = {
      success: true,
      message: 'All notifications marked as read'
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

// Get unread count
router.get('/unread-count', async (req: AuthenticatedRequest, res, next) => {
  try {
    const count = await prisma.notification.count({
      where: {
        userId: req.user!.id,
        isRead: false
      }
    });

    const response: ApiResponse<{ count: number }> = {
      success: true,
      message: 'Unread count retrieved successfully',
      data: { count }
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

export default router; 
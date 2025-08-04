import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { ApiResponse } from '../types';
import { AuthenticatedRequest } from '../types';

const router = Router();
const prisma = new PrismaClient();

// Get user's conversations
router.get('/conversations', async (req: AuthenticatedRequest, res, next) => {
  try {
    const conversations = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: req.user!.id },
          { receiverId: req.user!.id }
        ]
      },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true
          }
        },
        receiver: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Group by conversation
    const conversationMap = new Map();
    conversations.forEach(message => {
      const otherUserId = message.senderId === req.user!.id 
        ? message.receiverId 
        : message.senderId;
      
      if (!conversationMap.has(otherUserId)) {
        conversationMap.set(otherUserId, {
          userId: otherUserId,
          user: message.senderId === req.user!.id 
            ? message.receiver 
            : message.sender,
          lastMessage: message,
          unreadCount: 0
        });
      }
    });

    // Count unread messages
    for (const [userId, conversation] of conversationMap) {
      const unreadCount = await prisma.message.count({
        where: {
          senderId: userId,
          receiverId: req.user!.id,
          isRead: false
        }
      });
      conversation.unreadCount = unreadCount;
    }

    const response: ApiResponse<Array<any>> = {
      success: true,
      message: 'Conversations retrieved successfully',
      data: Array.from(conversationMap.values())
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

// Get messages with a specific user
router.get('/conversation/:userId', async (req: AuthenticatedRequest, res, next) => {
  try {
    const { userId } = req.params;
    const { page = '1', limit = '50' } = req.query;
    const pageNum = parseInt(page as string) || 1;
    const limitNum = parseInt(limit as string) || 50;
    const skip = (pageNum - 1) * limitNum;

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          {
            senderId: req.user!.id,
            receiverId: userId
          },
          {
            senderId: userId,
            receiverId: req.user!.id
          }
        ]
      },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true
          }
        },
        receiver: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limitNum
    });

    // Mark messages as read
    await prisma.message.updateMany({
      where: {
        senderId: userId,
        receiverId: req.user!.id,
        isRead: false
      },
      data: { isRead: true }
    });

    const total = await prisma.message.count({
      where: {
        OR: [
          {
            senderId: req.user!.id,
            receiverId: userId
          },
          {
            senderId: userId,
            receiverId: req.user!.id
          }
        ]
      }
    });

    const response: ApiResponse<typeof messages> = {
      success: true,
      message: 'Messages retrieved successfully',
      data: messages.reverse(), // Show oldest first
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

// Send a message
router.post('/', async (req: AuthenticatedRequest, res, next) => {
  try {
    const { receiverId, content } = req.body;

    if (!receiverId || !content) {
      return res.status(400).json({
        success: false,
        message: 'Receiver ID and content are required'
      });
    }

    // Check if receiver exists
    const receiver = await prisma.user.findUnique({
      where: { id: receiverId }
    });

    if (!receiver) {
      return res.status(404).json({
        success: false,
        message: 'Receiver not found'
      });
    }

    const message = await prisma.message.create({
      data: {
        senderId: req.user!.id,
        receiverId,
        content
      },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true
          }
        },
        receiver: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true
          }
        }
      }
    });

    const response: ApiResponse<typeof message> = {
      success: true,
      message: 'Message sent successfully',
      data: message
    };

    return res.status(201).json(response);
  } catch (error) {
    return next(error);
  }
});

// Mark message as read
router.patch('/:id/read', async (req: AuthenticatedRequest, res, next) => {
  try {
    const { id } = req.params;

    const message = await prisma.message.findUnique({
      where: { id }
    });

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    if (message.receiverId !== req.user!.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const updatedMessage = await prisma.message.update({
      where: { id },
      data: { isRead: true }
    });

    const response: ApiResponse<typeof updatedMessage> = {
      success: true,
      message: 'Message marked as read',
      data: updatedMessage
    };

    return res.json(response);
  } catch (error) {
    return next(error);
  }
});

export default router; 
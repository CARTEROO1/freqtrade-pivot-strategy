import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import JobScraper from '../services/jobScraper';
import { ApiResponse } from '../types';

const router = Router();
const prisma = new PrismaClient();
const jobScraper = new JobScraper();

// Start automated scraping
router.post('/start', async (req, res, next) => {
  try {
    console.log('🚀 Manual scraping started via API');
    
    // Start scraping in background
    jobScraper.startScraping().catch(error => {
      console.error('Background scraping error:', error);
    });

    const response: ApiResponse<{ message: string }> = {
      success: true,
      message: 'Job scraping started successfully',
      data: { message: 'Scraping is running in the background' }
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

// Get scraping statistics
router.get('/stats', async (req, res, next) => {
  try {
    const totalJobs = await prisma.job.count();
    const scrapedJobs = await prisma.job.count({
      where: { isScraped: true }
    });
    
    const jobsBySource = await prisma.job.groupBy({
      by: ['source'],
      where: { isScraped: true },
      _count: { id: true }
    });

    const recentJobs = await prisma.job.findMany({
      where: { isScraped: true },
      orderBy: { postedAt: 'desc' },
      take: 10,
      include: {
        company: {
          select: { name: true }
        }
      }
    });

    const response: ApiResponse<{
      totalJobs: number;
      scrapedJobs: number;
      jobsBySource: any[];
      recentJobs: any[];
    }> = {
      success: true,
      message: 'Scraping statistics retrieved successfully',
      data: {
        totalJobs,
        scrapedJobs,
        jobsBySource,
        recentJobs
      }
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

// Get jobs by source
router.get('/jobs/:source', async (req, res, next) => {
  try {
    const { source } = req.params;
    const { page = '1', limit = '20' } = req.query;

    const pageNum = parseInt(page as string) || 1;
    const limitNum = parseInt(limit as string) || 20;
    const skip = (pageNum - 1) * limitNum;

    const jobs = await prisma.job.findMany({
      where: { 
        source: source,
        isScraped: true 
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
      skip,
      take: limitNum
    });

    const total = await prisma.job.count({
      where: { 
        source: source,
        isScraped: true 
      }
    });

    const response: ApiResponse<typeof jobs> = {
      success: true,
      message: `Jobs from ${source} retrieved successfully`,
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

// Update scraping configuration
router.put('/config', async (req, res, next) => {
  try {
    const { keywords, locations, sources, enabled } = req.body;

    // In a real implementation, you'd save this to a config table
    // For now, we'll just return success
    const response: ApiResponse<{ message: string }> = {
      success: true,
      message: 'Scraping configuration updated successfully',
      data: { message: 'Configuration saved' }
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

// Get scraping configuration
router.get('/config', async (req, res, next) => {
  try {
    // Mock configuration - in real implementation, load from database
    const config = {
      enabled: true,
      keywords: [
        'software engineer', 'developer', 'programmer', 'full stack',
        'frontend', 'backend', 'data scientist', 'machine learning'
      ],
      locations: [
        'San Francisco', 'New York', 'Los Angeles', 'Chicago',
        'Austin', 'Seattle', 'Boston', 'Denver', 'Atlanta'
      ],
      sources: ['LinkedIn', 'Indeed', 'Glassdoor', 'Monster'],
      schedule: 'daily',
      rateLimit: 2000 // ms between requests
    };

    const response: ApiResponse<typeof config> = {
      success: true,
      message: 'Scraping configuration retrieved successfully',
      data: config
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

// Clear scraped jobs
router.delete('/jobs', async (req, res, next) => {
  try {
    const { source } = req.query;

    const whereClause = { isScraped: true };
    if (source) {
      whereClause.source = source as string;
    }

    const deletedCount = await prisma.job.deleteMany({
      where: whereClause
    });

    const response: ApiResponse<{ deletedCount: number }> = {
      success: true,
      message: 'Scraped jobs cleared successfully',
      data: { deletedCount: deletedCount.count }
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

export default router; 
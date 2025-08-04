import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { ApiResponse, AuthenticatedRequest } from '../types';
import { authMiddleware, requireAdmin } from '../middleware/auth';
import { 
  reportSuspiciousActivity, 
  getFraudStats,
  detectJobFraud,
  detectCompanyFraud,
  JobVerificationStatus,
  CompanyVerificationStatus
} from '../middleware/fraudProtection';

const router = Router();
const prisma = new PrismaClient();

// Report suspicious job or company
router.post('/report', authMiddleware, reportSuspiciousActivity);

// Get fraud statistics (admin only)
router.get('/stats', authMiddleware, requireAdmin, getFraudStats);

// Get fraud detection score for a job (for testing)
router.post('/analyze-job', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const jobData = req.body;
    const fraudResult = detectJobFraud(jobData);
    
    return res.json({
      success: true,
      data: {
        fraudScore: fraudResult.score,
        flags: fraudResult.flags,
        riskLevel: fraudResult.score >= 70 ? 'HIGH' : fraudResult.score >= 40 ? 'MEDIUM' : 'LOW'
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to analyze job'
    });
  }
});

// Get fraud detection score for a company (for testing)
router.post('/analyze-company', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const companyData = req.body;
    const fraudResult = detectCompanyFraud(companyData);
    
    return res.json({
      success: true,
      data: {
        fraudScore: fraudResult.score,
        flags: fraudResult.flags,
        riskLevel: fraudResult.score >= 70 ? 'HIGH' : fraudResult.score >= 40 ? 'MEDIUM' : 'LOW'
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to analyze company'
    });
  }
});

// Get pending fraud reports (admin only)
router.get('/reports', authMiddleware, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { page = '1', limit = '10', status = 'PENDING' } = req.query;
    
    const pageNum = parseInt(page as string) || 1;
    const limitNum = parseInt(limit as string) || 10;
    const skip = (pageNum - 1) * limitNum;
    
    const reports = await prisma.fraudReport.findMany({
      where: { status: status as string },
      include: {
        reporter: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limitNum
    });
    
    const total = await prisma.fraudReport.count({ where: { status: status as string } });
    
    const response: ApiResponse<typeof reports> = {
      success: true,
      message: 'Fraud reports retrieved successfully',
      data: reports,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum)
      }
    };
    
    return res.json(response);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to get fraud reports'
    });
  }
});

// Update fraud report status (admin only)
router.patch('/reports/:id', authMiddleware, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;
    
    const report = await prisma.fraudReport.update({
      where: { id },
      data: { 
        status,
        adminNotes,
        reviewedAt: new Date(),
        reviewedBy: req.user!.id
      }
    });
    
    // If report is approved, take action on the target
    if (status === 'APPROVED') {
      if (report.type === 'JOB') {
        await prisma.job.update({
          where: { id: report.targetId },
          data: { verificationStatus: JobVerificationStatus.BLOCKED }
        });
      } else if (report.type === 'COMPANY') {
        await prisma.company.update({
          where: { id: report.targetId },
          data: { verificationStatus: CompanyVerificationStatus.BLOCKED }
        });
      }
    }
    
    return res.json({
      success: true,
      message: 'Report status updated successfully',
      data: report
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update report status'
    });
  }
});

// Get blocked jobs and companies (admin only)
router.get('/blocked', authMiddleware, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const [blockedJobs, blockedCompanies] = await Promise.all([
      prisma.job.findMany({
        where: { verificationStatus: JobVerificationStatus.BLOCKED },
        include: {
          company: {
            select: {
              id: true,
              name: true
            }
          }
        },
        orderBy: { updatedAt: 'desc' }
      }),
      prisma.company.findMany({
        where: { verificationStatus: CompanyVerificationStatus.BLOCKED },
        orderBy: { updatedAt: 'desc' }
      })
    ]);
    
    return res.json({
      success: true,
      data: {
        blockedJobs,
        blockedCompanies
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to get blocked entities'
    });
  }
});

// Unblock a job or company (admin only)
router.patch('/unblock/:type/:id', authMiddleware, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { type, id } = req.params;
    
    if (type === 'job') {
      await prisma.job.update({
        where: { id },
        data: { verificationStatus: JobVerificationStatus.APPROVED }
      });
    } else if (type === 'company') {
      await prisma.company.update({
        where: { id },
        data: { verificationStatus: CompanyVerificationStatus.VERIFIED }
      });
    }
    
    return res.json({
      success: true,
      message: `${type} unblocked successfully`
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to unblock entity'
    });
  }
});

// Get fraud protection guidelines
router.get('/guidelines', async (req: Request, res: Response) => {
  try {
    const guidelines = {
      jobSeekers: [
        'Never pay money to apply for a job',
        'Be wary of jobs that promise unrealistic salaries',
        'Research the company before applying',
        'Avoid jobs that require personal financial information',
        'Report suspicious job postings immediately',
        'Never share bank account details during application',
        'Be cautious of jobs that require upfront investment',
        'Verify company contact information',
        'Check for company website and social media presence',
        'Avoid jobs that pressure you to make quick decisions'
      ],
      employers: [
        'Verify your company information before posting',
        'Provide complete and accurate job descriptions',
        'Include legitimate company contact information',
        'Avoid using personal email addresses for business',
        'Respond to job seekers professionally',
        'Never ask for payment from job seekers',
        'Provide clear application instructions',
        'Maintain transparency about job requirements',
        'Follow up with applicants in a timely manner',
        'Report any suspicious activity you encounter'
      ],
      redFlags: [
        'Jobs promising unrealistic earnings',
        'Requests for personal financial information',
        'Pressure to make immediate decisions',
        'Vague or incomplete job descriptions',
        'Personal email addresses for business contact',
        'Requests for upfront payments or investments',
        'Jobs that seem too good to be true',
        'Lack of company information or website',
        'Suspicious phone numbers or addresses',
        'Jobs requiring you to recruit others'
      ]
    };
    
    return res.json({
      success: true,
      data: guidelines
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to get guidelines'
    });
  }
});

export default router; 
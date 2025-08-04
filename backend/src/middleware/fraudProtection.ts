import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthenticatedRequest } from '../types';

const prisma = new PrismaClient();

// Fraud detection patterns
const FRAUD_PATTERNS = {
  // Suspicious job titles
  suspiciousTitles: [
    'work from home',
    'earn money online',
    'quick cash',
    'easy money',
    'no experience needed',
    'get rich quick',
    'make money fast',
    'online business opportunity',
    'mlm',
    'multi level marketing',
    'pyramid scheme',
    'investment opportunity',
    'crypto trading',
    'forex trading',
    'bitcoin mining'
  ],
  
  // Suspicious company names
  suspiciousCompanyNames: [
    'global',
    'international',
    'worldwide',
    'enterprise',
    'holdings',
    'group',
    'corporation',
    'inc',
    'llc',
    'ltd'
  ],
  
  // Suspicious email patterns
  suspiciousEmails: [
    'gmail.com',
    'yahoo.com',
    'hotmail.com',
    'outlook.com',
    'protonmail.com'
  ],
  
  // Suspicious phone patterns
  suspiciousPhones: [
    '000-000-0000',
    '111-111-1111',
    '123-456-7890',
    '555-555-5555'
  ],
  
  // Suspicious salary ranges
  suspiciousSalaries: {
    min: 50000,  // Suspiciously low for professional jobs
    max: 500000  // Suspiciously high
  },
  
  // Suspicious job requirements
  suspiciousRequirements: [
    'no experience required',
    'no education needed',
    'anyone can apply',
    'no skills required',
    'training provided',
    'will train',
    'entry level',
    'beginner friendly'
  ]
};

// Company verification status
export enum CompanyVerificationStatus {
  UNVERIFIED = 'UNVERIFIED',
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  SUSPICIOUS = 'SUSPICIOUS',
  BLOCKED = 'BLOCKED'
}

// Job verification status
export enum JobVerificationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  SUSPICIOUS = 'SUSPICIOUS',
  BLOCKED = 'BLOCKED'
}

// Fraud detection functions
export const detectJobFraud = (jobData: any): { score: number; flags: string[] } => {
  let fraudScore = 0;
  const flags: string[] = [];
  
  // Check job title
  const title = jobData.title?.toLowerCase() || '';
  for (const pattern of FRAUD_PATTERNS.suspiciousTitles) {
    if (title.includes(pattern)) {
      fraudScore += 30;
      flags.push(`Suspicious job title: ${pattern}`);
    }
  }
  
  // Check description
  const description = jobData.description?.toLowerCase() || '';
  for (const pattern of FRAUD_PATTERNS.suspiciousRequirements) {
    if (description.includes(pattern)) {
      fraudScore += 20;
      flags.push(`Suspicious requirement: ${pattern}`);
    }
  }
  
  // Check salary
  if (jobData.salary) {
    const { min, max } = jobData.salary;
    if (min < FRAUD_PATTERNS.suspiciousSalaries.min || max > FRAUD_PATTERNS.suspiciousSalaries.max) {
      fraudScore += 25;
      flags.push('Suspicious salary range');
    }
  }
  
  // Check for excessive urgency
  if (jobData.isUrgent && !jobData.isVerified) {
    fraudScore += 15;
    flags.push('Unverified urgent job posting');
  }
  
  // Check for missing company information
  if (!jobData.company?.website || !jobData.company?.phone) {
    fraudScore += 10;
    flags.push('Missing company contact information');
  }
  
  return { score: Math.min(fraudScore, 100), flags };
};

export const detectCompanyFraud = (companyData: any): { score: number; flags: string[] } => {
  let fraudScore = 0;
  const flags: string[] = [];
  
  // Check company name
  const name = companyData.name?.toLowerCase() || '';
  for (const pattern of FRAUD_PATTERNS.suspiciousCompanyNames) {
    if (name.includes(pattern)) {
      fraudScore += 15;
      flags.push(`Suspicious company name pattern: ${pattern}`);
    }
  }
  
  // Check email domain
  const email = companyData.email || '';
  const domain = email.split('@')[1];
  if (domain && FRAUD_PATTERNS.suspiciousEmails.includes(domain)) {
    fraudScore += 25;
    flags.push('Suspicious email domain');
  }
  
  // Check phone number
  const phone = companyData.phone || '';
  for (const pattern of FRAUD_PATTERNS.suspiciousPhones) {
    if (phone.includes(pattern)) {
      fraudScore += 30;
      flags.push('Suspicious phone number');
    }
  }
  
  // Check for missing information
  if (!companyData.website || !companyData.address || !companyData.industry) {
    fraudScore += 20;
    flags.push('Missing company information');
  }
  
  return { score: Math.min(fraudScore, 100), flags };
};

// Middleware to check job posting for fraud
export const jobFraudCheck = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const jobData = req.body;
    
    // Perform fraud detection
    const fraudResult = detectJobFraud(jobData);
    
    // If fraud score is high, flag for review
    if (fraudResult.score >= 70) {
      // Block the job posting
      return res.status(400).json({
        success: false,
        message: 'Job posting flagged for suspicious activity',
        data: {
          fraudScore: fraudResult.score,
          flags: fraudResult.flags,
          requiresReview: true
        }
      });
    } else if (fraudResult.score >= 40) {
      // Mark for manual review
      jobData.verificationStatus = JobVerificationStatus.PENDING;
      jobData.fraudScore = fraudResult.score;
      jobData.fraudFlags = fraudResult.flags;
    } else {
      jobData.verificationStatus = JobVerificationStatus.APPROVED;
    }
    
    next();
  } catch (error) {
    next(error);
  }
};

// Middleware to check company for fraud
export const companyFraudCheck = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const companyData = req.body;
    
    // Perform fraud detection
    const fraudResult = detectCompanyFraud(companyData);
    
    // If fraud score is high, block the company
    if (fraudResult.score >= 70) {
      return res.status(400).json({
        success: false,
        message: 'Company flagged for suspicious activity',
        data: {
          fraudScore: fraudResult.score,
          flags: fraudResult.flags,
          requiresReview: true
        }
      });
    } else if (fraudResult.score >= 40) {
      // Mark for manual review
      companyData.verificationStatus = CompanyVerificationStatus.PENDING;
      companyData.fraudScore = fraudResult.score;
      companyData.fraudFlags = fraudResult.flags;
    } else {
      companyData.verificationStatus = CompanyVerificationStatus.VERIFIED;
    }
    
    next();
  } catch (error) {
    next(error);
  }
};

// Middleware to filter out suspicious jobs from search results
export const filterSuspiciousJobs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Add fraud filtering to job queries
    req.query.verifiedOnly = 'true';
    req.query.minFraudScore = '30'; // Only show jobs with low fraud scores
    
    next();
  } catch (error) {
    next(error);
  }
};

// Rate limiting for job postings
export const jobPostingRateLimit = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }
    
    // Check how many jobs the user has posted in the last 24 hours
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentJobs = await prisma.job.count({
      where: {
        postedById: userId,
        postedAt: {
          gte: last24Hours
        }
      }
    });
    
    // Limit to 5 jobs per day for unverified companies
    if (recentJobs >= 5) {
      return res.status(429).json({
        success: false,
        message: 'Job posting limit reached. Please wait 24 hours or verify your company.'
      });
    }
    
    next();
  } catch (error) {
    next(error);
  }
};

// Report suspicious activity
export const reportSuspiciousActivity = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { type, targetId, reason, evidence } = req.body;
    const reporterId = req.user?.id;
    
    if (!reporterId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }
    
    // Create report
    const report = await prisma.fraudReport.create({
      data: {
        type,
        targetId,
        reason,
        evidence,
        reporterId,
        status: 'PENDING'
      }
    });
    
    // If multiple reports exist, escalate
    const reportCount = await prisma.fraudReport.count({
      where: {
        targetId,
        type,
        status: 'PENDING'
      }
    });
    
    if (reportCount >= 3) {
      // Auto-block the target
      if (type === 'JOB') {
        await prisma.job.update({
          where: { id: targetId },
          data: { verificationStatus: JobVerificationStatus.BLOCKED }
        });
      } else if (type === 'COMPANY') {
        await prisma.company.update({
          where: { id: targetId },
          data: { verificationStatus: CompanyVerificationStatus.BLOCKED }
        });
      }
    }
    
    return res.status(201).json({
      success: true,
      message: 'Report submitted successfully',
      data: report
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to submit report'
    });
  }
};

// Get fraud statistics
export const getFraudStats = async (req: Request, res: Response) => {
  try {
    const stats = await prisma.$transaction([
      prisma.job.count({ where: { verificationStatus: JobVerificationStatus.BLOCKED } }),
      prisma.company.count({ where: { verificationStatus: CompanyVerificationStatus.BLOCKED } }),
      prisma.fraudReport.count({ where: { status: 'PENDING' } }),
      prisma.job.count({ where: { verificationStatus: JobVerificationStatus.SUSPICIOUS } })
    ]);
    
    return res.json({
      success: true,
      data: {
        blockedJobs: stats[0],
        blockedCompanies: stats[1],
        pendingReports: stats[2],
        suspiciousJobs: stats[3]
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to get fraud statistics'
    });
  }
}; 
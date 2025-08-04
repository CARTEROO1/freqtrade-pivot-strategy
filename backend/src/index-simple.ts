import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Import routes
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import jobRoutes from './routes/jobs';
import companyRoutes from './routes/companies';
import applicationRoutes from './routes/applications';
import notificationRoutes from './routes/notifications';
import messageRoutes from './routes/messages';
import scrapingRoutes from './routes/scraping';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Security middleware
app.use(helmet());
app.use(compression());

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Mock data
const mockJobs = [
  {
    id: '1',
    title: 'Senior Software Engineer',
    company: {
      id: '1',
      name: 'TechCorp Solutions',
      logo: '🏢',
      industry: 'Technology',
      size: 'LARGE',
      location: 'San Francisco, CA'
    },
    description: 'We are looking for a talented Senior Software Engineer to join our growing team.',
    requirements: [
      '5+ years of experience in software development',
      'Strong proficiency in JavaScript, React, and Node.js',
      'Experience with cloud platforms (AWS, Azure, or GCP)',
      'Knowledge of database design and SQL',
      'Excellent problem-solving and communication skills'
    ],
    responsibilities: [
      'Design and implement scalable software solutions',
      'Collaborate with cross-functional teams',
      'Mentor junior developers',
      'Participate in code reviews and technical discussions',
      'Contribute to architectural decisions'
    ],
    benefits: [
      'Competitive salary and equity',
      'Health, dental, and vision insurance',
      'Flexible work hours and remote work options',
      'Professional development opportunities',
      '401(k) matching'
    ],
    salary: {
      min: 120000,
      max: 180000,
      currency: 'USD'
    },
    type: 'FULL_TIME',
    experience: 'SENIOR',
    isRemote: true,
    location: 'San Francisco, CA',
    isUrgent: true,
    isFeatured: true,
    postedAt: '2024-08-01T10:00:00Z',
    views: 150,
    applicationCount: 25
  },
  {
    id: '2',
    title: 'Corporate Attorney',
    company: {
      id: '2',
      name: 'Legal Associates LLP',
      logo: '⚖️',
      industry: 'Legal Services',
      size: 'MEDIUM',
      location: 'New York, NY'
    },
    description: 'Join our prestigious law firm as a Corporate Attorney. You will handle complex corporate transactions.',
    requirements: [
      'Juris Doctor (JD) degree from an accredited law school',
      'Active bar membership in New York',
      '3+ years of experience in corporate law',
      'Strong analytical and research skills',
      'Excellent written and verbal communication'
    ],
    responsibilities: [
      'Draft and review corporate documents',
      'Provide legal counsel on business transactions',
      'Conduct legal research and analysis',
      'Represent clients in negotiations',
      'Stay updated on relevant laws and regulations'
    ],
    benefits: [
      'Competitive salary with bonus structure',
      'Comprehensive health benefits',
      'Professional development and CLE credits',
      'Generous vacation and sick leave',
      '401(k) plan'
    ],
    salary: {
      min: 150000,
      max: 250000,
      currency: 'USD'
    },
    type: 'FULL_TIME',
    experience: 'MID',
    isRemote: false,
    location: 'New York, NY',
    isUrgent: false,
    isFeatured: true,
    postedAt: '2024-08-01T09:00:00Z',
    views: 89,
    applicationCount: 12
  },
  {
    id: '3',
    title: 'UX/UI Designer',
    company: {
      id: '3',
      name: 'Creative Studio',
      logo: '🎨',
      industry: 'Creative Services',
      size: 'SMALL',
      location: 'Los Angeles, CA'
    },
    description: 'We are seeking a creative UX/UI Designer to help us create beautiful and functional user experiences.',
    requirements: [
      '2+ years of experience in UX/UI design',
      'Proficiency in Figma, Sketch, or Adobe XD',
      'Strong portfolio demonstrating user-centered design',
      'Understanding of design principles and user psychology',
      'Experience with design systems and component libraries'
    ],
    responsibilities: [
      'Create user-centered design solutions',
      'Conduct user research and usability testing',
      'Design wireframes, prototypes, and high-fidelity mockups',
      'Collaborate with product managers and developers',
      'Maintain and evolve our design system'
    ],
    benefits: [
      'Competitive salary',
      'Health and wellness benefits',
      'Flexible work environment',
      'Professional development budget',
      'Creative and collaborative culture'
    ],
    salary: {
      min: 70000,
      max: 100000,
      currency: 'USD'
    },
    type: 'FULL_TIME',
    experience: 'JUNIOR',
    isRemote: true,
    location: 'Los Angeles, CA',
    isUrgent: false,
    isFeatured: false,
    postedAt: '2024-08-01T08:00:00Z',
    views: 67,
    applicationCount: 8
  },
  {
    id: '4',
    title: 'Data Scientist',
    company: {
      id: '4',
      name: 'DataFlow Analytics',
      logo: '📊',
      industry: 'Data & Analytics',
      size: 'STARTUP',
      location: 'Austin, TX'
    },
    description: 'Join our data science team to help us extract insights from complex datasets and build predictive models.',
    requirements: [
      'Master\'s degree in Statistics, Mathematics, or related field',
      '3+ years of experience in data science',
      'Proficiency in Python, R, and SQL',
      'Experience with machine learning frameworks',
      'Strong statistical analysis skills'
    ],
    responsibilities: [
      'Develop and implement machine learning models',
      'Analyze large datasets to extract insights',
      'Create data visualizations and reports',
      'Collaborate with engineering teams',
      'Present findings to stakeholders'
    ],
    benefits: [
      'Competitive salary with equity',
      'Health, dental, and vision insurance',
      'Flexible work hours',
      'Conference and training budget',
      'Modern office with great amenities'
    ],
    salary: {
      min: 100000,
      max: 150000,
      currency: 'USD'
    },
    type: 'FULL_TIME',
    experience: 'MID',
    isRemote: false,
    location: 'Austin, TX',
    isUrgent: true,
    isFeatured: false,
    postedAt: '2024-08-01T07:00:00Z',
    views: 45,
    applicationCount: 15
  }
];

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'HappyCareer API (Demo)',
    version: '1.0.0'
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/scraping', scrapingRoutes);

// Get all jobs
app.get('/api/jobs', (req, res) => {
  const { search, location, type, experience, isRemote } = req.query;
  
  let filteredJobs = [...mockJobs];
  
  if (search) {
    const searchLower = (search as string).toLowerCase();
    filteredJobs = filteredJobs.filter(job => 
      job.title.toLowerCase().includes(searchLower) ||
      job.description.toLowerCase().includes(searchLower) ||
      job.company.name.toLowerCase().includes(searchLower)
    );
  }
  
  if (location) {
    const locationLower = (location as string).toLowerCase();
    filteredJobs = filteredJobs.filter(job => 
      job.location.toLowerCase().includes(locationLower)
    );
  }
  
  if (type) {
    filteredJobs = filteredJobs.filter(job => job.type === type);
  }
  
  if (experience) {
    filteredJobs = filteredJobs.filter(job => job.experience === experience);
  }
  
  if (isRemote !== undefined) {
    const remote = isRemote === 'true';
    filteredJobs = filteredJobs.filter(job => job.isRemote === remote);
  }
  
  res.json({
    success: true,
    message: 'Jobs retrieved successfully',
    data: filteredJobs,
    pagination: {
      page: 1,
      limit: filteredJobs.length,
      total: filteredJobs.length,
      totalPages: 1
    }
  });
});

// Get featured jobs
app.get('/api/jobs/featured', (req, res) => {
  const featuredJobs = mockJobs.filter(job => job.isFeatured);
  
  res.json({
    success: true,
    message: 'Featured jobs retrieved successfully',
    data: featuredJobs
  });
});

// Get job by ID
app.get('/api/jobs/:id', (req, res) => {
  const { id } = req.params;
  const job = mockJobs.find(j => j.id === id);
  
  if (!job) {
    return res.status(404).json({
      success: false,
      message: 'Job not found'
    });
  }
  
  return res.json({
    success: true,
    message: 'Job retrieved successfully',
    data: job
  });
});

// Fraud protection routes
app.get('/api/fraud-protection/guidelines', (req, res) => {
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
  
  res.json({
    success: true,
    message: 'Fraud protection guidelines retrieved successfully',
    data: guidelines
  });
});

// Report suspicious activity (demo endpoint)
app.post('/api/fraud-protection/report', (req, res) => {
  const { type, targetId, reason, evidence } = req.body;
  
  // In a real implementation, this would save to database
  const report = {
    id: `report_${Date.now()}`,
    type,
    targetId,
    reason,
    evidence,
    status: 'PENDING',
    createdAt: new Date().toISOString()
  };
  
  res.status(201).json({
    success: true,
    message: 'Report submitted successfully. Our team will review it within 24 hours.',
    data: report
  });
});

// Get fraud statistics (demo endpoint)
app.get('/api/fraud-protection/stats', (req, res) => {
  const stats = {
    blockedJobs: 12,
    blockedCompanies: 5,
    pendingReports: 8,
    suspiciousJobs: 15,
    totalReportsThisMonth: 45,
    averageResponseTime: '4.2 hours'
  };
  
  res.json({
    success: true,
    message: 'Fraud statistics retrieved successfully',
    data: stats
  });
});

// Get companies
app.get('/api/companies', (req, res) => {
  const companies = [
    {
      id: '1',
      name: 'TechCorp Solutions',
      description: 'Leading technology solutions provider specializing in AI and machine learning',
      logo: '🏢',
      website: 'https://techcorp.com',
      industry: 'Technology',
      size: 'LARGE',
      type: 'PRIVATE',
      founded: 2010,
      location: 'San Francisco, CA',
      isVerified: true,
      _count: { jobs: 2, users: 5 }
    },
    {
      id: '2',
      name: 'Legal Associates LLP',
      description: 'Premier law firm specializing in corporate law and intellectual property',
      logo: '⚖️',
      website: 'https://legalassociates.com',
      industry: 'Legal Services',
      size: 'MEDIUM',
      type: 'PRIVATE',
      founded: 1995,
      location: 'New York, NY',
      isVerified: true,
      _count: { jobs: 1, users: 3 }
    },
    {
      id: '3',
      name: 'Creative Studio',
      description: 'Award-winning design and creative agency',
      logo: '🎨',
      website: 'https://creativestudio.com',
      industry: 'Creative Services',
      size: 'SMALL',
      type: 'PRIVATE',
      founded: 2018,
      location: 'Los Angeles, CA',
      isVerified: true,
      _count: { jobs: 1, users: 2 }
    },
    {
      id: '4',
      name: 'DataFlow Analytics',
      description: 'Data analytics and business intelligence solutions',
      logo: '📊',
      website: 'https://dataflow.com',
      industry: 'Data & Analytics',
      size: 'STARTUP',
      type: 'PRIVATE',
      founded: 2022,
      location: 'Austin, TX',
      isVerified: false,
      _count: { jobs: 1, users: 1 }
    }
  ];
  
  res.json({
    success: true,
    message: 'Companies retrieved successfully',
    data: companies,
    pagination: {
      page: 1,
      limit: companies.length,
      total: companies.length,
      totalPages: 1
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 HappyCareer API (Demo) server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
  console.log(`📝 This is a demo version with mock data. For full functionality, use Supabase setup.`);
});

export default app; 
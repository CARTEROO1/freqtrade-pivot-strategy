export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary?: string;
  description: string;
  requirements: string[];
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  experience: 'entry' | 'mid' | 'senior' | 'executive';
  postedAt: string;
  deadline?: string;
  isRemote: boolean;
  benefits?: string[];
  verified?: boolean;
  remote?: boolean;
  skills?: string[];
  industry?: string;
  department?: string;
  applicationCount?: number;
  views?: number;
  featured?: boolean;
  urgent?: boolean;
  companyLogo?: string;
  companySize?: string;
  companyType?: 'startup' | 'enterprise' | 'agency' | 'nonprofit';
}

export interface JobFilters {
  search?: string;
  location?: string;
  type?: Job['type'];
  experience?: Job['experience'];
  isRemote?: boolean;
  salary?: {
    min?: number;
    max?: number;
  };
  industry?: string;
  department?: string;
  skills?: string[];
}

export interface JobApplication {
  id: string;
  jobId: string;
  userId: string;
  status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'hired';
  appliedAt: string;
  coverLetter?: string;
  resume?: string;
  portfolio?: string;
  expectedSalary?: number;
  availability?: string;
  references?: {
    name: string;
    email: string;
    phone: string;
    relationship: string;
  }[];
}

export interface JobSearchResponse {
  jobs: Job[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  filters: JobFilters;
}

export interface JobStats {
  totalJobs: number;
  activeJobs: number;
  remoteJobs: number;
  featuredJobs: number;
  urgentJobs: number;
  averageSalary: number;
  topIndustries: {
    industry: string;
    count: number;
  }[];
  topLocations: {
    location: string;
    count: number;
  }[];
} 
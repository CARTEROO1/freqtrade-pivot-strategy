import axios from 'axios';
import { PrismaClient } from '@prisma/client';
import { JobType, Experience } from '@prisma/client';
import LegalComplianceService from './legalCompliance';

const prisma = new PrismaClient();
const complianceService = new LegalComplianceService();

interface ScrapedJob {
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  type: JobType;
  experience: Experience;
  isRemote: boolean;
  url: string;
  source: string;
  postedAt: Date;
}

export class JobScraper {
  private sources = [
    {
      name: 'GitHub',
      baseUrl: 'https://jobs.github.com/positions.json',
      apiBased: true,
      selectors: {
        jobCards: '.job-listing',
        title: '.job-title',
        company: '.company-name',
        location: '.location',
        description: '.job-description'
      }
    },
    {
      name: 'StackOverflow',
      baseUrl: 'https://api.stackexchange.com/2.3/jobs',
      apiBased: true,
      selectors: {
        jobCards: '.job-listing',
        title: '.job-title',
        company: '.company-name',
        location: '.location',
        description: '.job-description'
      }
    }
  ];

  private keywords = [
    'software engineer', 'developer', 'programmer', 'full stack',
    'frontend', 'backend', 'data scientist', 'machine learning',
    'devops', 'product manager', 'designer', 'analyst'
  ];

  private locations = [
    'San Francisco', 'New York', 'Los Angeles', 'Chicago',
    'Austin', 'Seattle', 'Boston', 'Denver', 'Atlanta',
    'Remote', 'United States', 'Canada', 'United Kingdom'
  ];

  async startScraping() {
    console.log('🚀 Starting legally compliant job scraping...');
    
    // Check compliance before starting
    const complianceReport = complianceService.getComplianceReport();
    console.log('📋 Compliance Report:', complianceReport);
    
    if (complianceReport.compliantSources.length === 0) {
      console.error('❌ No compliant sources available. Cannot proceed with scraping.');
      return;
    }
    
    try {
      for (const source of this.sources) {
        if (complianceService.isScrapingAllowed(source.name)) {
          console.log(`📡 Scraping from ${source.name} (Compliant)`);
          await this.scrapeSource(source);
        } else {
          console.log(`⛔ Skipping ${source.name} (Non-compliant)`);
          complianceService.logViolation(source.name, 'Scraping not allowed by terms of service');
        }
      }
      
      console.log('✅ Legally compliant job scraping completed successfully!');
    } catch (error) {
      console.error('❌ Error during job scraping:', error);
    }
  }

  private async scrapeSource(source: any) {
    try {
      const rateLimit = complianceService.getRateLimit(source.name);
      console.log(`⏱️ Rate limit for ${source.name}: ${rateLimit} requests per hour`);

      for (const keyword of this.keywords.slice(0, 3)) { // Reduced for compliance
        for (const location of this.locations.slice(0, 2)) { // Reduced for compliance
          const jobs = await this.scrapeJobs(source, keyword, location);
          await this.saveJobs(jobs);
          
          // Respect rate limits
          const delay = rateLimit > 0 ? (60 * 60 * 1000) / rateLimit : 5000; // Convert to milliseconds
          console.log(`⏳ Waiting ${delay}ms to respect rate limits...`);
          await this.delay(delay);
        }
      }
    } catch (error) {
      console.error(`Error scraping ${source.name}:`, error);
    }
  }

  private async scrapeJobs(source: any, keyword: string, location: string): Promise<ScrapedJob[]> {
    const jobs: ScrapedJob[] = [];
    
    try {
      if (source.apiBased) {
        // Use API-based approach for compliant sources
        const jobs = await this.scrapeFromAPI(source, keyword, location);
        return jobs;
      } else {
        // Fallback to web scraping (only for compliant sources)
        const jobs = await this.scrapeFromWeb(source, keyword, location);
        return jobs;
      }
    } catch (error) {
      console.error(`Error scraping ${source.name} for ${keyword} in ${location}:`, error);
    }
    
    return jobs;
  }

  private async scrapeFromAPI(source: any, keyword: string, location: string): Promise<ScrapedJob[]> {
    const jobs: ScrapedJob[] = [];
    
    try {
      let url = source.baseUrl;
      
      if (source.name === 'GitHub') {
        url += `?search=${encodeURIComponent(keyword)}&location=${encodeURIComponent(location)}`;
      } else if (source.name === 'StackOverflow') {
        url += `?tagged=${encodeURIComponent(keyword)}&location=${encodeURIComponent(location)}&site=stackoverflow`;
      }

      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'HappyCareer-JobScraper/1.0 (Compliant API Usage)',
          'Accept': 'application/json'
        },
        timeout: 10000
      });

      const data = response.data;
      
      if (source.name === 'GitHub') {
        // GitHub Jobs API response
        for (const job of data.slice(0, 10)) { // Limit to 10 jobs
          jobs.push({
            title: job.title,
            company: job.company,
            location: job.location,
            description: job.description,
            requirements: this.extractRequirements(job.description),
            responsibilities: this.extractResponsibilities(job.description),
            benefits: this.extractBenefits(job.description),
            salary: this.extractSalary(job.description),
            type: this.determineJobType(job.title, job.description),
            experience: this.determineExperienceLevel(job.title, job.description),
            isRemote: this.isRemoteJob(job.title, job.description, job.location),
            url: job.url,
            source: source.name,
            postedAt: new Date(job.created_at)
          });
        }
      } else if (source.name === 'StackOverflow') {
        // Stack Overflow Jobs API response
        for (const job of data.items?.slice(0, 10) || []) {
          jobs.push({
            title: job.title,
            company: job.company_name,
            location: job.location,
            description: job.description,
            requirements: this.extractRequirements(job.description),
            responsibilities: this.extractResponsibilities(job.description),
            benefits: this.extractBenefits(job.description),
            salary: this.extractSalary(job.description),
            type: this.determineJobType(job.title, job.description),
            experience: this.determineExperienceLevel(job.title, job.description),
            isRemote: this.isRemoteJob(job.title, job.description, job.location),
            url: job.link,
            source: source.name,
            postedAt: new Date(job.creation_date * 1000)
          });
        }
      }
      
    } catch (error) {
      console.error(`Error scraping from ${source.name} API:`, error);
    }
    
    return jobs;
  }

  private async scrapeFromWeb(source: any, keyword: string, location: string): Promise<ScrapedJob[]> {
    // This method is kept for reference but should not be used for non-compliant sources
    console.log(`⚠️ Web scraping not recommended for ${source.name} - using API instead`);
    return [];
  }

  private buildSearchUrl(baseUrl: string, keyword: string, location: string): string {
    const params = new URLSearchParams({
      q: keyword,
      l: location,
      sort: 'date'
    });
    return `${baseUrl}?${params.toString()}`;
  }

  // Removed web scraping methods as we're using API-based approach only

  private extractRequirements(description: string): string[] {
    const requirements: string[] = [];
    const lines = description.split('\n');
    
    let inRequirements = false;
    for (const line of lines) {
      const lowerLine = line.toLowerCase();
      
      if (lowerLine.includes('requirements') || lowerLine.includes('qualifications')) {
        inRequirements = true;
        continue;
      }
      
      if (inRequirements && (lowerLine.includes('responsibilities') || lowerLine.includes('benefits'))) {
        break;
      }
      
      if (inRequirements && line.trim().length > 10) {
        requirements.push(line.trim());
      }
    }
    
    return requirements.slice(0, 5); // Limit to 5 requirements
  }

  private extractResponsibilities(description: string): string[] {
    const responsibilities: string[] = [];
    const lines = description.split('\n');
    
    let inResponsibilities = false;
    for (const line of lines) {
      const lowerLine = line.toLowerCase();
      
      if (lowerLine.includes('responsibilities') || lowerLine.includes('duties')) {
        inResponsibilities = true;
        continue;
      }
      
      if (inResponsibilities && (lowerLine.includes('benefits') || lowerLine.includes('requirements'))) {
        break;
      }
      
      if (inResponsibilities && line.trim().length > 10) {
        responsibilities.push(line.trim());
      }
    }
    
    return responsibilities.slice(0, 5); // Limit to 5 responsibilities
  }

  private extractBenefits(description: string): string[] {
    const benefits: string[] = [];
    const lines = description.split('\n');
    
    let inBenefits = false;
    for (const line of lines) {
      const lowerLine = line.toLowerCase();
      
      if (lowerLine.includes('benefits') || lowerLine.includes('perks')) {
        inBenefits = true;
        continue;
      }
      
      if (inBenefits && line.trim().length > 10) {
        benefits.push(line.trim());
      }
    }
    
    return benefits.slice(0, 5); // Limit to 5 benefits
  }

  private extractSalary(description: string): { min: number; max: number; currency: string } | undefined {
    const salaryRegex = /\$(\d{1,3}(?:,\d{3})*)\s*-\s*\$(\d{1,3}(?:,\d{3})*)/i;
    const match = description.match(salaryRegex);
    
    if (match) {
      return {
        min: parseInt(match[1].replace(/,/g, '')),
        max: parseInt(match[2].replace(/,/g, '')),
        currency: 'USD'
      };
    }
    
    return undefined;
  }

  private determineJobType(title: string, description: string): JobType {
    const text = `${title} ${description}`.toLowerCase();
    
    if (text.includes('full-time') || text.includes('full time')) return 'FULL_TIME';
    if (text.includes('part-time') || text.includes('part time')) return 'PART_TIME';
    if (text.includes('contract')) return 'CONTRACT';
    if (text.includes('internship') || text.includes('intern')) return 'INTERNSHIP';
    if (text.includes('freelance')) return 'FREELANCE';
    
    return 'FULL_TIME'; // Default
  }

  private determineExperienceLevel(title: string, description: string): Experience {
    const text = `${title} ${description}`.toLowerCase();
    
    if (text.includes('senior') || text.includes('lead') || text.includes('principal')) return 'SENIOR';
    if (text.includes('junior') || text.includes('entry level') || text.includes('entry-level')) return 'JUNIOR';
    if (text.includes('executive') || text.includes('director') || text.includes('vp')) return 'EXECUTIVE';
    if (text.includes('mid') || text.includes('intermediate')) return 'MID';
    
    return 'ENTRY'; // Default
  }

  private isRemoteJob(title: string, description: string, location: string): boolean {
    const text = `${title} ${description} ${location}`.toLowerCase();
    return text.includes('remote') || text.includes('work from home') || text.includes('wfh');
  }

  private async saveJobs(jobs: ScrapedJob[]) {
    for (const job of jobs) {
      try {
        // Check if job already exists
        const existingJob = await prisma.job.findFirst({
          where: {
            title: job.title,
            company: {
              name: job.company
            }
          }
        });

        if (existingJob) {
          console.log(`Job already exists: ${job.title} at ${job.company}`);
          continue;
        }

        // Find or create company
        let company = await prisma.company.findFirst({
          where: { name: job.company }
        });

        if (!company) {
          company = await prisma.company.create({
            data: {
              name: job.company,
              description: `Company description for ${job.company}`,
              industry: 'Technology', // Default
              size: 'MEDIUM', // Default
              type: 'PRIVATE', // Default
              location: job.location,
              isVerified: false
            }
          });
        }

        // Create job
        await prisma.job.create({
          data: {
            title: job.title,
            description: job.description,
            requirements: job.requirements,
            responsibilities: job.responsibilities,
            benefits: job.benefits,
            salary: job.salary,
            type: job.type,
            experience: job.experience,
            isRemote: job.isRemote,
            location: job.location,
            companyId: company.id,
            postedById: 'demo-user-id', // Default user for scraped jobs
            source: job.source,
            externalUrl: job.url,
            isScraped: true,
            lastScraped: new Date()
          }
        });

        console.log(`✅ Saved job: ${job.title} at ${job.company} (${job.source})`);
      } catch (error) {
        console.error(`Error saving job ${job.title}:`, error);
      }
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default JobScraper; 
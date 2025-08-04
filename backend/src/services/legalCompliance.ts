export interface TermsOfService {
  source: string;
  allowsScraping: boolean;
  rateLimit: number; // requests per minute
  requiresAuth: boolean;
  requiresHeaders: boolean;
  robotsTxt: string;
  termsUrl: string;
  lastChecked: Date;
}

export class LegalComplianceService {
  private termsOfService: Map<string, TermsOfService> = new Map();

  constructor() {
    this.initializeTermsOfService();
  }

  private initializeTermsOfService() {
    // LinkedIn Terms of Service
    this.termsOfService.set('LinkedIn', {
      source: 'LinkedIn',
      allowsScraping: false, // LinkedIn explicitly prohibits scraping
      rateLimit: 0,
      requiresAuth: true,
      requiresHeaders: true,
      robotsTxt: 'https://www.linkedin.com/robots.txt',
      termsUrl: 'https://www.linkedin.com/legal/user-agreement',
      lastChecked: new Date()
    });

    // Indeed Terms of Service
    this.termsOfService.set('Indeed', {
      source: 'Indeed',
      allowsScraping: false, // Indeed prohibits automated access
      rateLimit: 0,
      requiresAuth: false,
      requiresHeaders: true,
      robotsTxt: 'https://www.indeed.com/robots.txt',
      termsUrl: 'https://www.indeed.com/legal',
      lastChecked: new Date()
    });

    // Glassdoor Terms of Service
    this.termsOfService.set('Glassdoor', {
      source: 'Glassdoor',
      allowsScraping: false, // Glassdoor prohibits scraping
      rateLimit: 0,
      requiresAuth: false,
      requiresHeaders: true,
      robotsTxt: 'https://www.glassdoor.com/robots.txt',
      termsUrl: 'https://www.glassdoor.com/about/terms.htm',
      lastChecked: new Date()
    });

    // Monster Terms of Service
    this.termsOfService.set('Monster', {
      source: 'Monster',
      allowsScraping: false, // Monster prohibits scraping
      rateLimit: 0,
      requiresAuth: false,
      requiresHeaders: true,
      robotsTxt: 'https://www.monster.com/robots.txt',
      termsUrl: 'https://www.monster.com/terms-of-use',
      lastChecked: new Date()
    });

    // GitHub Jobs (API-based, more permissive)
    this.termsOfService.set('GitHub', {
      source: 'GitHub',
      allowsScraping: true, // GitHub Jobs API is designed for this
      rateLimit: 60, // 60 requests per hour
      requiresAuth: false,
      requiresHeaders: false,
      robotsTxt: 'https://jobs.github.com/robots.txt',
      termsUrl: 'https://docs.github.com/en/rest/reference/search#search-jobs',
      lastChecked: new Date()
    });

    // Stack Overflow Jobs (API-based)
    this.termsOfService.set('StackOverflow', {
      source: 'StackOverflow',
      allowsScraping: true, // Stack Overflow has an API
      rateLimit: 30, // 30 requests per day
      requiresAuth: false,
      requiresHeaders: false,
      robotsTxt: 'https://stackoverflow.com/jobs/robots.txt',
      termsUrl: 'https://stackoverflow.com/legal/api-terms-of-use',
      lastChecked: new Date()
    });
  }

  // Check if scraping is allowed for a source
  isScrapingAllowed(source: string): boolean {
    const terms = this.termsOfService.get(source);
    return terms ? terms.allowsScraping : false;
  }

  // Get rate limit for a source
  getRateLimit(source: string): number {
    const terms = this.termsOfService.get(source);
    return terms ? terms.rateLimit : 0;
  }

  // Get all compliant sources
  getCompliantSources(): string[] {
    return Array.from(this.termsOfService.values())
      .filter(terms => terms.allowsScraping)
      .map(terms => terms.source);
  }

  // Get terms of service for a source
  getTermsOfService(source: string): TermsOfService | null {
    return this.termsOfService.get(source) || null;
  }

  // Check robots.txt compliance
  async checkRobotsTxt(source: string): Promise<boolean> {
    const terms = this.termsOfService.get(source);
    if (!terms) return false;

    try {
      const response = await fetch(terms.robotsTxt);
      const robotsTxt = await response.text();
      
      // Check if scraping is disallowed
      const disallowPatterns = [
        '/jobs',
        '/search',
        '/api',
        '*'
      ];

      return !disallowPatterns.some(pattern => 
        robotsTxt.includes(`Disallow: ${pattern}`)
      );
    } catch (error) {
      console.error(`Error checking robots.txt for ${source}:`, error);
      return false;
    }
  }

  // Log compliance violation
  logViolation(source: string, violation: string) {
    console.error(`🚨 LEGAL COMPLIANCE VIOLATION: ${source} - ${violation}`);
    // In production, this should log to a compliance monitoring system
  }

  // Get compliance report
  getComplianceReport(): {
    compliantSources: string[];
    nonCompliantSources: string[];
    recommendations: string[];
  } {
    const compliantSources = this.getCompliantSources();
    const nonCompliantSources = Array.from(this.termsOfService.keys())
      .filter(source => !compliantSources.includes(source));

    const recommendations = [
      'Use only API-based sources for automated data collection',
      'Implement proper rate limiting for all requests',
      'Respect robots.txt files',
      'Monitor for changes in terms of service',
      'Consider using official APIs instead of scraping'
    ];

    return {
      compliantSources,
      nonCompliantSources,
      recommendations
    };
  }
}

export default LegalComplianceService; 
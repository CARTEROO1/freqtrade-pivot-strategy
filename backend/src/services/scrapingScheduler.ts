import cron from 'node-cron';
import JobScraper from './jobScraper';

export class ScrapingScheduler {
  private jobScraper: JobScraper;
  private isRunning: boolean = false;

  constructor() {
    this.jobScraper = new JobScraper();
  }

  // Start daily scraping at 2 AM
  startDailyScraping() {
    console.log('📅 Setting up daily scraping schedule (2:00 AM)');
    
    cron.schedule('0 2 * * *', async () => {
      console.log('🕐 Daily scraping job triggered');
      await this.runScraping();
    }, {
      scheduled: true,
      timezone: 'America/New_York'
    });
  }

  // Start scraping every 6 hours
  startFrequentScraping() {
    console.log('📅 Setting up frequent scraping schedule (every 6 hours)');
    
    cron.schedule('0 */6 * * *', async () => {
      console.log('🕐 Frequent scraping job triggered');
      await this.runScraping();
    }, {
      scheduled: true,
      timezone: 'America/New_York'
    });
  }

  // Start scraping every hour (for testing)
  startHourlyScraping() {
    console.log('📅 Setting up hourly scraping schedule (for testing)');
    
    cron.schedule('0 * * * *', async () => {
      console.log('🕐 Hourly scraping job triggered');
      await this.runScraping();
    }, {
      scheduled: true,
      timezone: 'America/New_York'
    });
  }

  // Start scraping every 30 minutes (for intensive testing)
  startIntensiveScraping() {
    console.log('📅 Setting up intensive scraping schedule (every 30 minutes)');
    
    cron.schedule('*/30 * * * *', async () => {
      console.log('🕐 Intensive scraping job triggered');
      await this.runScraping();
    }, {
      scheduled: true,
      timezone: 'America/New_York'
    });
  }

  private async runScraping() {
    if (this.isRunning) {
      console.log('⚠️ Scraping already in progress, skipping...');
      return;
    }

    try {
      this.isRunning = true;
      console.log('🚀 Starting scheduled scraping job...');
      
      await this.jobScraper.startScraping();
      
      console.log('✅ Scheduled scraping job completed successfully');
    } catch (error) {
      console.error('❌ Error in scheduled scraping job:', error);
    } finally {
      this.isRunning = false;
    }
  }

  // Stop all scheduled jobs
  stopAllJobs() {
    console.log('🛑 Stopping all scheduled scraping jobs');
    cron.getTasks().forEach(task => task.stop());
  }

  // Get status of scheduled jobs
  getJobStatus() {
    const tasks = cron.getTasks();
    const status = {
      totalJobs: tasks.size,
      runningJobs: Array.from(tasks.values()).filter(task => task.running).length,
      scheduledJobs: Array.from(tasks.values()).filter(task => !task.running).length
    };
    
    return status;
  }
}

export default ScrapingScheduler; 
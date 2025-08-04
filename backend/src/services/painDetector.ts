import axios from 'axios'
import * as cheerio from 'cheerio'
import { Configuration, OpenAIApi } from 'openai'

interface PainPoint {
  id: string
  source: string
  url: string
  content: string
  painType: 'job_loss' | 'workplace_abuse' | 'financial_stress' | 'career_stagnation' | 'discrimination' | 'burnout' | 'scam_victim' | 'other'
  severity: 'low' | 'medium' | 'high' | 'critical'
  sentiment: 'negative' | 'very_negative' | 'neutral' | 'positive'
  keywords: string[]
  timestamp: Date
  location?: string
  industry?: string
  ageGroup?: string
  verified: boolean
  confidence: number
}

interface PainAnalysis {
  totalPosts: number
  painDistribution: Record<string, number>
  severityBreakdown: Record<string, number>
  trendingTopics: string[]
  topSources: string[]
  recentAlerts: PainPoint[]
  insights: string[]
}

class PainDetectorService {
  private openai: OpenAIApi
  private sources = [
    'reddit.com/r/jobs',
    'reddit.com/r/antiwork',
    'reddit.com/r/careerguidance',
    'reddit.com/r/recruitinghell',
    'glassdoor.com',
    'indeed.com',
    'linkedin.com',
    'twitter.com',
    'facebook.com/groups',
    'quora.com',
    'stackoverflow.com',
    'blind.com',
    'fishbowl.com'
  ]

  constructor() {
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    })
    this.openai = new OpenAIApi(configuration)
  }

  async scrapeJobRelatedContent(): Promise<PainPoint[]> {
    const painPoints: PainPoint[] = []
    
    for (const source of this.sources) {
      try {
        console.log(`Scraping ${source}...`)
        const posts = await this.scrapeSource(source)
        const analyzedPosts = await this.analyzePainPoints(posts)
        painPoints.push(...analyzedPosts)
      } catch (error) {
        console.error(`Error scraping ${source}:`, error)
      }
    }

    return painPoints
  }

  private async scrapeSource(source: string): Promise<any[]> {
    const posts: any[] = []
    
    try {
      // Different scraping strategies for different sources
      if (source.includes('reddit.com')) {
        posts.push(...await this.scrapeReddit(source))
      } else if (source.includes('glassdoor.com')) {
        posts.push(...await this.scrapeGlassdoor(source))
      } else if (source.includes('twitter.com')) {
        posts.push(...await this.scrapeTwitter(source))
      } else {
        posts.push(...await this.scrapeGeneric(source))
      }
    } catch (error) {
      console.error(`Error scraping ${source}:`, error)
    }

    return posts
  }

  private async scrapeReddit(subreddit: string): Promise<any[]> {
    const posts: any[] = []
    
    try {
      // Reddit API endpoint for subreddit posts
      const response = await axios.get(`https://www.reddit.com${subreddit}/hot.json?limit=50`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; PainDetector/1.0)'
        }
      })

      const redditPosts = response.data.data.children
      
      for (const post of redditPosts) {
        const postData = post.data
        posts.push({
          title: postData.title,
          content: postData.selftext,
          author: postData.author,
          score: postData.score,
          comments: postData.num_comments,
          url: `https://reddit.com${postData.permalink}`,
          created: new Date(postData.created_utc * 1000),
          source: 'reddit'
        })
      }
    } catch (error) {
      console.error('Error scraping Reddit:', error)
    }

    return posts
  }

  private async scrapeGlassdoor(domain: string): Promise<any[]> {
    const posts: any[] = []
    
    try {
      // Scrape Glassdoor reviews and discussions
      const response = await axios.get(`https://${domain}/Reviews`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; PainDetector/1.0)'
        }
      })

      const $ = cheerio.load(response.data)
      
      $('.review').each((index, element) => {
        const title = $(element).find('.review-title').text().trim()
        const content = $(element).find('.review-content').text().trim()
        const rating = $(element).find('.rating').text().trim()
        
        posts.push({
          title,
          content,
          rating,
          url: domain,
          source: 'glassdoor',
          created: new Date()
        })
      })
    } catch (error) {
      console.error('Error scraping Glassdoor:', error)
    }

    return posts
  }

  private async scrapeTwitter(domain: string): Promise<any[]> {
    const posts: any[] = []
    
    try {
      // Note: Twitter scraping requires API access or specialized tools
      // This is a simplified version
      const response = await axios.get(`https://${domain}/search?q=job%20problems%20OR%20work%20stress%20OR%20career%20issues`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; PainDetector/1.0)'
        }
      })

      const $ = cheerio.load(response.data)
      
      $('article').each((index, element) => {
        const content = $(element).find('[data-testid="tweetText"]').text().trim()
        
        if (content) {
          posts.push({
            content,
            source: 'twitter',
            url: domain,
            created: new Date()
          })
        }
      })
    } catch (error) {
      console.error('Error scraping Twitter:', error)
    }

    return posts
  }

  private async scrapeGeneric(domain: string): Promise<any[]> {
    const posts: any[] = []
    
    try {
      const response = await axios.get(`https://${domain}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; PainDetector/1.0)'
        }
      })

      const $ = cheerio.load(response.data)
      
      // Generic scraping for job-related content
      $('p, .post, .comment, .review').each((index, element) => {
        const content = $(element).text().trim()
        
        if (content.length > 50 && this.containsJobKeywords(content)) {
          posts.push({
            content,
            source: domain,
            url: domain,
            created: new Date()
          })
        }
      })
    } catch (error) {
      console.error(`Error scraping ${domain}:`, error)
    }

    return posts
  }

  private containsJobKeywords(text: string): boolean {
    const jobKeywords = [
      'job', 'work', 'career', 'employment', 'boss', 'manager', 'colleague',
      'salary', 'pay', 'money', 'stress', 'burnout', 'toxic', 'harassment',
      'discrimination', 'layoff', 'fired', 'quit', 'resign', 'unemployed',
      'interview', 'application', 'rejection', 'promotion', 'raise'
    ]
    
    const lowerText = text.toLowerCase()
    return jobKeywords.some(keyword => lowerText.includes(keyword))
  }

  private async analyzePainPoints(posts: any[]): Promise<PainPoint[]> {
    const painPoints: PainPoint[] = []
    
    for (const post of posts) {
      try {
        const analysis = await this.analyzeSinglePost(post)
        if (analysis) {
          painPoints.push(analysis)
        }
      } catch (error) {
        console.error('Error analyzing post:', error)
      }
    }

    return painPoints
  }

  private async analyzeSinglePost(post: any): Promise<PainPoint | null> {
    try {
      const content = `${post.title || ''} ${post.content || ''}`.trim()
      
      if (content.length < 20) return null

      const prompt = `
        Analyze this job-related content and identify pain points. Return a JSON object with:
        {
          "painType": "job_loss|workplace_abuse|financial_stress|career_stagnation|discrimination|burnout|scam_victim|other",
          "severity": "low|medium|high|critical",
          "sentiment": "negative|very_negative|neutral|positive",
          "keywords": ["keyword1", "keyword2"],
          "confidence": 0.0-1.0,
          "insight": "brief insight about the pain point"
        }

        Content: "${content.substring(0, 1000)}"
      `

      const completion = await this.openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a pain point analyzer for job-related content. Identify suffering, stress, and negative experiences."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 300
      })

      const response = completion.data.choices[0]?.message?.content
      if (!response) return null

      const analysis = JSON.parse(response)
      
      return {
        id: `pain_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        source: post.source,
        url: post.url,
        content: content.substring(0, 500),
        painType: analysis.painType,
        severity: analysis.severity,
        sentiment: analysis.sentiment,
        keywords: analysis.keywords,
        timestamp: new Date(),
        verified: false,
        confidence: analysis.confidence
      }
    } catch (error) {
      console.error('Error in AI analysis:', error)
      return null
    }
  }

  async generatePainAnalysis(painPoints: PainPoint[]): Promise<PainAnalysis> {
    const painDistribution: Record<string, number> = {}
    const severityBreakdown: Record<string, number> = {}
    const sources: Record<string, number> = {}
    const allKeywords: string[] = []

    painPoints.forEach(point => {
      // Pain type distribution
      painDistribution[point.painType] = (painDistribution[point.painType] || 0) + 1
      
      // Severity breakdown
      severityBreakdown[point.severity] = (severityBreakdown[point.severity] || 0) + 1
      
      // Source analysis
      sources[point.source] = (sources[point.source] || 0) + 1
      
      // Keywords
      allKeywords.push(...point.keywords)
    })

    // Find trending topics
    const keywordCounts: Record<string, number> = {}
    allKeywords.forEach(keyword => {
      keywordCounts[keyword] = (keywordCounts[keyword] || 0) + 1
    })

    const trendingTopics = Object.entries(keywordCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([keyword]) => keyword)

    // Generate insights
    const insights = this.generateInsights(painPoints, painDistribution, severityBreakdown)

    return {
      totalPosts: painPoints.length,
      painDistribution,
      severityBreakdown,
      trendingTopics,
      topSources: Object.entries(sources)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([source]) => source),
      recentAlerts: painPoints
        .filter(p => p.severity === 'critical' || p.severity === 'high')
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
        .slice(0, 10),
      insights
    }
  }

  private generateInsights(painPoints: PainPoint[], painDistribution: Record<string, number>, severityBreakdown: Record<string, number>): string[] {
    const insights: string[] = []
    
    const totalPoints = painPoints.length
    if (totalPoints === 0) return insights

    // Most common pain type
    const mostCommonPain = Object.entries(painDistribution)
      .sort(([,a], [,b]) => b - a)[0]
    if (mostCommonPain) {
      insights.push(`${mostCommonPain[0].replace('_', ' ')} is the most reported issue (${Math.round(mostCommonPain[1] / totalPoints * 100)}%)`)
    }

    // High severity alerts
    const highSeverity = severityBreakdown.high || 0
    const criticalSeverity = severityBreakdown.critical || 0
    if (highSeverity + criticalSeverity > 0) {
      insights.push(`${highSeverity + criticalSeverity} high/critical severity alerts detected`)
    }

    // Recent surge detection
    const last24Hours = painPoints.filter(p => 
      Date.now() - p.timestamp.getTime() < 24 * 60 * 60 * 1000
    ).length
    if (last24Hours > totalPoints * 0.3) {
      insights.push(`Significant increase in reports in the last 24 hours (${last24Hours} posts)`)
    }

    // Scam detection
    const scamReports = painPoints.filter(p => p.painType === 'scam_victim').length
    if (scamReports > 0) {
      insights.push(`${scamReports} potential scam victim reports detected`)
    }

    return insights
  }

  async startMonitoring(): Promise<void> {
    console.log('Starting pain detection monitoring...')
    
    // Initial scrape
    const painPoints = await this.scrapeJobRelatedContent()
    const analysis = await this.generatePainAnalysis(painPoints)
    
    console.log(`Detected ${painPoints.length} pain points`)
    console.log('Analysis:', analysis)
    
    // Schedule regular monitoring
    setInterval(async () => {
      try {
        const newPainPoints = await this.scrapeJobRelatedContent()
        const newAnalysis = await this.generatePainAnalysis(newPainPoints)
        
        // Check for critical alerts
        const criticalAlerts = newPainPoints.filter(p => p.severity === 'critical')
        if (criticalAlerts.length > 0) {
          console.log(`🚨 CRITICAL ALERTS: ${criticalAlerts.length} new critical pain points detected`)
          // Here you could send notifications, emails, etc.
        }
        
        console.log(`Monitoring update: ${newPainPoints.length} pain points analyzed`)
      } catch (error) {
        console.error('Error in monitoring cycle:', error)
      }
    }, 30 * 60 * 1000) // Run every 30 minutes
  }
}

export default PainDetectorService
export type { PainPoint, PainAnalysis } 
import { Router } from 'express'
import PainDetectorService, { PainPoint, PainAnalysis } from '../services/painDetector'

const router = Router()
const painDetector = new PainDetectorService()

// In-memory storage for demo purposes (in production, use database)
let painPoints: PainPoint[] = []
let analysis: PainAnalysis | null = null
let isMonitoring = false

// Get all pain points
router.get('/pain-points', async (req, res) => {
  try {
    const { 
      painType, 
      severity, 
      source, 
      limit = 50, 
      offset = 0,
      sortBy = 'timestamp',
      sortOrder = 'desc'
    } = req.query

    let filteredPoints = [...painPoints]

    // Apply filters
    if (painType) {
      filteredPoints = filteredPoints.filter(p => p.painType === painType)
    }
    if (severity) {
      filteredPoints = filteredPoints.filter(p => p.severity === severity)
    }
    if (source) {
      filteredPoints = filteredPoints.filter(p => p.source === source)
    }

    // Apply sorting
    filteredPoints.sort((a, b) => {
      let aValue: any, bValue: any
      
      switch (sortBy) {
        case 'timestamp':
          aValue = a.timestamp.getTime()
          bValue = b.timestamp.getTime()
          break
        case 'severity':
          const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 }
          aValue = severityOrder[a.severity as keyof typeof severityOrder]
          bValue = severityOrder[b.severity as keyof typeof severityOrder]
          break
        case 'confidence':
          aValue = a.confidence
          bValue = b.confidence
          break
        default:
          aValue = a.timestamp.getTime()
          bValue = b.timestamp.getTime()
      }

      return sortOrder === 'desc' ? bValue - aValue : aValue - bValue
    })

    // Apply pagination
    const paginatedPoints = filteredPoints.slice(Number(offset), Number(offset) + Number(limit))

    res.json({
      painPoints: paginatedPoints,
      total: filteredPoints.length,
      limit: Number(limit),
      offset: Number(offset)
    })
  } catch (error) {
    console.error('Error fetching pain points:', error)
    res.status(500).json({ error: 'Failed to fetch pain points' })
  }
})

// Get pain analysis
router.get('/analysis', async (req, res) => {
  try {
    if (!analysis) {
      analysis = await painDetector.generatePainAnalysis(painPoints)
    }
    
    res.json(analysis)
  } catch (error) {
    console.error('Error generating analysis:', error)
    res.status(500).json({ error: 'Failed to generate analysis' })
  }
})

// Start monitoring
router.post('/start-monitoring', async (req, res) => {
  try {
    if (isMonitoring) {
      return res.json({ message: 'Monitoring is already active' })
    }

    isMonitoring = true
    
    // Start the monitoring process
    painDetector.startMonitoring()
    
    res.json({ message: 'Pain detection monitoring started' })
  } catch (error) {
    console.error('Error starting monitoring:', error)
    res.status(500).json({ error: 'Failed to start monitoring' })
  }
})

// Stop monitoring
router.post('/stop-monitoring', async (req, res) => {
  try {
    isMonitoring = false
    res.json({ message: 'Pain detection monitoring stopped' })
  } catch (error) {
    console.error('Error stopping monitoring:', error)
    res.status(500).json({ error: 'Failed to stop monitoring' })
  }
})

// Manual scrape
router.post('/scrape', async (req, res) => {
  try {
    const { sources } = req.body
    
    console.log('Starting manual scrape...')
    const newPainPoints = await painDetector.scrapeJobRelatedContent()
    
    // Add new pain points to storage
    painPoints.push(...newPainPoints)
    
    // Regenerate analysis
    analysis = await painDetector.generatePainAnalysis(painPoints)
    
    res.json({
      message: `Scraped ${newPainPoints.length} new pain points`,
      newPainPoints,
      totalPainPoints: painPoints.length
    })
  } catch (error) {
    console.error('Error during manual scrape:', error)
    res.status(500).json({ error: 'Failed to scrape content' })
  }
})

// Get monitoring status
router.get('/status', (req, res) => {
  res.json({
    isMonitoring,
    totalPainPoints: painPoints.length,
    lastAnalysis: analysis ? {
      totalPosts: analysis.totalPosts,
      insights: analysis.insights,
      recentAlerts: analysis.recentAlerts.length
    } : null
  })
})

// Get critical alerts
router.get('/critical-alerts', (req, res) => {
  try {
    const criticalAlerts = painPoints
      .filter(p => p.severity === 'critical')
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 20)

    res.json({
      criticalAlerts,
      total: criticalAlerts.length
    })
  } catch (error) {
    console.error('Error fetching critical alerts:', error)
    res.status(500).json({ error: 'Failed to fetch critical alerts' })
  }
})

// Get trending topics
router.get('/trending-topics', (req, res) => {
  try {
    if (!analysis) {
      return res.json({ trendingTopics: [] })
    }

    res.json({
      trendingTopics: analysis.trendingTopics,
      topSources: analysis.topSources
    })
  } catch (error) {
    console.error('Error fetching trending topics:', error)
    res.status(500).json({ error: 'Failed to fetch trending topics' })
  }
})

// Get pain distribution
router.get('/pain-distribution', (req, res) => {
  try {
    if (!analysis) {
      return res.json({ painDistribution: {}, severityBreakdown: {} })
    }

    res.json({
      painDistribution: analysis.painDistribution,
      severityBreakdown: analysis.severityBreakdown
    })
  } catch (error) {
    console.error('Error fetching pain distribution:', error)
    res.status(500).json({ error: 'Failed to fetch pain distribution' })
  }
})

// Mark pain point as verified
router.put('/pain-points/:id/verify', (req, res) => {
  try {
    const { id } = req.params
    const painPoint = painPoints.find(p => p.id === id)
    
    if (!painPoint) {
      return res.status(404).json({ error: 'Pain point not found' })
    }

    painPoint.verified = true
    res.json({ message: 'Pain point marked as verified', painPoint })
  } catch (error) {
    console.error('Error verifying pain point:', error)
    res.status(500).json({ error: 'Failed to verify pain point' })
  }
})

// Delete pain point
router.delete('/pain-points/:id', (req, res) => {
  try {
    const { id } = req.params
    const index = painPoints.findIndex(p => p.id === id)
    
    if (index === -1) {
      return res.status(404).json({ error: 'Pain point not found' })
    }

    painPoints.splice(index, 1)
    res.json({ message: 'Pain point deleted successfully' })
  } catch (error) {
    console.error('Error deleting pain point:', error)
    res.status(500).json({ error: 'Failed to delete pain point' })
  }
})

// Get insights
router.get('/insights', (req, res) => {
  try {
    if (!analysis) {
      return res.json({ insights: [] })
    }

    res.json({
      insights: analysis.insights,
      totalPosts: analysis.totalPosts,
      recentAlerts: analysis.recentAlerts.length
    })
  } catch (error) {
    console.error('Error fetching insights:', error)
    res.status(500).json({ error: 'Failed to fetch insights' })
  }
})

// Export data
router.get('/export', (req, res) => {
  try {
    const exportData = {
      painPoints,
      analysis,
      exportDate: new Date().toISOString(),
      totalRecords: painPoints.length
    }

    res.setHeader('Content-Type', 'application/json')
    res.setHeader('Content-Disposition', `attachment; filename="pain-detector-export-${Date.now()}.json"`)
    res.json(exportData)
  } catch (error) {
    console.error('Error exporting data:', error)
    res.status(500).json({ error: 'Failed to export data' })
  }
})

export default router 
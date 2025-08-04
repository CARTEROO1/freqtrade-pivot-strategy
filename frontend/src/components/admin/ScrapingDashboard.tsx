'use client'

import { useState, useEffect } from 'react'
import { 
  Play, 
  Pause, 
  RefreshCw, 
  BarChart3, 
  Globe, 
  Clock,
  TrendingUp,
  Database,
  Settings,
  Trash2
} from 'lucide-react'

interface ScrapingStats {
  totalJobs: number
  scrapedJobs: number
  jobsBySource: Array<{
    source: string
    _count: { id: number }
  }>
  recentJobs: Array<{
    id: string
    title: string
    company: { name: string }
    source: string
    postedAt: string
  }>
}

interface ScrapingConfig {
  enabled: boolean
  keywords: string[]
  locations: string[]
  sources: string[]
  schedule: string
  rateLimit: number
}

export default function ScrapingDashboard() {
  const [stats, setStats] = useState<ScrapingStats | null>(null)
  const [config, setConfig] = useState<ScrapingConfig | null>(null)
  const [isScraping, setIsScraping] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
    fetchConfig()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/scraping/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data.data)
      }
    } catch (error) {
      console.error('Error fetching scraping stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchConfig = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/scraping/config')
      if (response.ok) {
        const data = await response.json()
        setConfig(data.data)
      }
    } catch (error) {
      console.error('Error fetching scraping config:', error)
    }
  }

  const startScraping = async () => {
    try {
      setIsScraping(true)
      const response = await fetch('http://localhost:4000/api/scraping/start', {
        method: 'POST'
      })
      
      if (response.ok) {
        alert('Job scraping started successfully!')
        // Refresh stats after a delay
        setTimeout(() => {
          fetchStats()
          setIsScraping(false)
        }, 5000)
      } else {
        alert('Failed to start scraping')
        setIsScraping(false)
      }
    } catch (error) {
      console.error('Error starting scraping:', error)
      alert('Error starting scraping')
      setIsScraping(false)
    }
  }

  const clearScrapedJobs = async () => {
    if (!confirm('Are you sure you want to clear all scraped jobs? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch('http://localhost:4000/api/scraping/jobs', {
        method: 'DELETE'
      })
      
      if (response.ok) {
        alert('Scraped jobs cleared successfully!')
        fetchStats()
      } else {
        alert('Failed to clear scraped jobs')
      }
    } catch (error) {
      console.error('Error clearing scraped jobs:', error)
      alert('Error clearing scraped jobs')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading scraping dashboard...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Job Scraping Dashboard</h1>
          <p className="text-gray-600">Automated job data collection from multiple sources</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={startScraping}
            disabled={isScraping}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isScraping ? (
              <RefreshCw className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Play className="h-4 w-4 mr-2" />
            )}
            {isScraping ? 'Scraping...' : 'Start Scraping'}
          </button>
          <button
            onClick={fetchStats}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Database className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Jobs</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalJobs || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Globe className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Scraped Jobs</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.scrapedJobs || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <BarChart3 className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Sources</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.jobsBySource.length || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Success Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.totalJobs ? Math.round((stats.scrapedJobs / stats.totalJobs) * 100) : 0}%
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Jobs by Source */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Jobs by Source</h3>
          <div className="space-y-3">
            {stats?.jobsBySource.map((source) => (
              <div key={source.source} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                  <span className="text-gray-700">{source.source}</span>
                </div>
                <span className="font-semibold text-gray-900">{source._count.id}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Configuration */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Scraping Configuration</h3>
          {config && (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Status</p>
                <p className={`text-sm ${config.enabled ? 'text-green-600' : 'text-red-600'}`}>
                  {config.enabled ? 'Enabled' : 'Disabled'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Schedule</p>
                <p className="text-sm text-gray-700">{config.schedule}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Rate Limit</p>
                <p className="text-sm text-gray-700">{config.rateLimit}ms between requests</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Sources</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {config.sources.map((source) => (
                    <span key={source} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                      {source}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent Scraped Jobs */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Scraped Jobs</h3>
          <button
            onClick={clearScrapedJobs}
            className="flex items-center px-3 py-1 text-red-600 hover:bg-red-50 rounded text-sm"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Clear All
          </button>
        </div>
        <div className="space-y-3">
          {stats?.recentJobs.map((job) => (
            <div key={job.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{job.title}</h4>
                <p className="text-sm text-gray-600">{job.company.name}</p>
              </div>
              <div className="flex items-center space-x-4">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                  {job.source}
                </span>
                <span className="text-sm text-gray-500">
                  {new Date(job.postedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
          {(!stats?.recentJobs || stats.recentJobs.length === 0) && (
            <p className="text-gray-500 text-center py-4">No scraped jobs found</p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={startScraping}
            disabled={isScraping}
            className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            <Play className="h-4 w-4 mr-2" />
            Start Scraping
          </button>
          <button
            onClick={fetchStats}
            className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Stats
          </button>
          <button
            onClick={clearScrapedJobs}
            className="flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear Jobs
          </button>
        </div>
      </div>
    </div>
  )
} 
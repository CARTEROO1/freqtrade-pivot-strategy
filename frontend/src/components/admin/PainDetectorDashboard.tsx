'use client'

import { useState, useEffect } from 'react'
import { 
  AlertTriangle, 
  TrendingUp, 
  Activity, 
  Play, 
  Pause, 
  RefreshCw, 
  Download, 
  Eye, 
  Shield, 
  Users, 
  DollarSign, 
  Briefcase,
  Zap,
  BarChart3,
  PieChart,
  Clock,
  CheckCircle,
  XCircle,
  Filter,
  Search
} from 'lucide-react'

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

const getPainTypeIcon = (painType: string) => {
  switch (painType) {
    case 'job_loss':
      return <Briefcase className="w-4 h-4" />
    case 'workplace_abuse':
      return <AlertTriangle className="w-4 h-4" />
    case 'financial_stress':
      return <DollarSign className="w-4 h-4" />
    case 'career_stagnation':
      return <TrendingUp className="w-4 h-4" />
    case 'discrimination':
      return <Users className="w-4 h-4" />
    case 'burnout':
      return <Zap className="w-4 h-4" />
    case 'scam_victim':
      return <Shield className="w-4 h-4" />
    default:
      return <Activity className="w-4 h-4" />
  }
}

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'critical':
      return 'bg-red-100 text-red-800 border-red-200'
    case 'high':
      return 'bg-orange-100 text-orange-800 border-orange-200'
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    case 'low':
      return 'bg-green-100 text-green-800 border-green-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

export default function PainDetectorDashboard() {
  const [painPoints, setPainPoints] = useState<PainPoint[]>([])
  const [analysis, setAnalysis] = useState<PainAnalysis | null>(null)
  const [isMonitoring, setIsMonitoring] = useState(false)
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({
    painType: '',
    severity: '',
    source: '',
    search: ''
  })
  const [currentView, setCurrentView] = useState<'overview' | 'pain-points' | 'analysis' | 'alerts'>('overview')

  useEffect(() => {
    fetchStatus()
    fetchPainPoints()
    fetchAnalysis()
  }, [])

  const fetchStatus = async () => {
    try {
      const response = await fetch('/api/pain-detector/status')
      const data = await response.json()
      setIsMonitoring(data.isMonitoring)
    } catch (error) {
      console.error('Error fetching status:', error)
    }
  }

  const fetchPainPoints = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/pain-detector/pain-points?limit=100')
      const data = await response.json()
      setPainPoints(data.painPoints)
    } catch (error) {
      console.error('Error fetching pain points:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchAnalysis = async () => {
    try {
      const response = await fetch('/api/pain-detector/analysis')
      const data = await response.json()
      setAnalysis(data)
    } catch (error) {
      console.error('Error fetching analysis:', error)
    }
  }

  const startMonitoring = async () => {
    try {
      const response = await fetch('/api/pain-detector/start-monitoring', { method: 'POST' })
      const data = await response.json()
      setIsMonitoring(true)
      alert(data.message)
    } catch (error) {
      console.error('Error starting monitoring:', error)
    }
  }

  const stopMonitoring = async () => {
    try {
      const response = await fetch('/api/pain-detector/stop-monitoring', { method: 'POST' })
      const data = await response.json()
      setIsMonitoring(false)
      alert(data.message)
    } catch (error) {
      console.error('Error stopping monitoring:', error)
    }
  }

  const manualScrape = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/pain-detector/scrape', { method: 'POST' })
      const data = await response.json()
      alert(data.message)
      fetchPainPoints()
      fetchAnalysis()
    } catch (error) {
      console.error('Error during manual scrape:', error)
    } finally {
      setLoading(false)
    }
  }

  const exportData = async () => {
    try {
      const response = await fetch('/api/pain-detector/export')
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `pain-detector-export-${Date.now()}.json`
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error exporting data:', error)
    }
  }

  const filteredPainPoints = painPoints.filter(point => {
    if (filters.painType && point.painType !== filters.painType) return false
    if (filters.severity && point.severity !== filters.severity) return false
    if (filters.source && point.source !== filters.source) return false
    if (filters.search && !point.content.toLowerCase().includes(filters.search.toLowerCase())) return false
    return true
  })

  const criticalAlerts = painPoints.filter(p => p.severity === 'critical')
  const highAlerts = painPoints.filter(p => p.severity === 'high')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Pain Detector Dashboard</h1>
              <p className="text-gray-600 mt-1">AI-powered job market suffering analysis</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={manualScrape}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Scraping...' : 'Manual Scrape'}
              </button>
              <button
                onClick={exportData}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Download className="w-4 h-4" />
                Export Data
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Monitoring Controls */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${isMonitoring ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-sm font-medium">
                  Monitoring: {isMonitoring ? 'Active' : 'Inactive'}
                </span>
              </div>
              {analysis && (
                <span className="text-sm text-gray-600">
                  Total Pain Points: {analysis.totalPosts}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {isMonitoring ? (
                <button
                  onClick={stopMonitoring}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  <Pause className="w-4 h-4" />
                  Stop Monitoring
                </button>
              ) : (
                <button
                  onClick={startMonitoring}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <Play className="w-4 h-4" />
                  Start Monitoring
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'pain-points', label: 'Pain Points', icon: Activity },
              { id: 'analysis', label: 'Analysis', icon: PieChart },
              { id: 'alerts', label: 'Alerts', icon: AlertTriangle }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id as any)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  currentView === item.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Activity className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Pain Points</p>
                    <p className="text-2xl font-bold text-gray-900">{analysis?.totalPosts || 0}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Critical Alerts</p>
                    <p className="text-2xl font-bold text-gray-900">{criticalAlerts.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">High Severity</p>
                    <p className="text-2xl font-bold text-gray-900">{highAlerts.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Verified</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {painPoints.filter(p => p.verified).length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Alerts */}
            {analysis?.recentAlerts && analysis.recentAlerts.length > 0 && (
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Recent Critical Alerts</h3>
                </div>
                <div className="divide-y divide-gray-200">
                  {analysis.recentAlerts.slice(0, 5).map((alert) => (
                    <div key={alert.id} className="px-6 py-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {getPainTypeIcon(alert.painType)}
                            <span className="text-sm font-medium text-gray-900">
                              {alert.painType.replace('_', ' ').toUpperCase()}
                            </span>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(alert.severity)}`}>
                              {alert.severity.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-2">{alert.content}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                            <span>{alert.source}</span>
                            <span>{new Date(alert.timestamp).toLocaleDateString()}</span>
                            <span>Confidence: {Math.round(alert.confidence * 100)}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Insights */}
            {analysis?.insights && analysis.insights.length > 0 && (
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">AI Insights</h3>
                </div>
                <div className="px-6 py-4">
                  <ul className="space-y-2">
                    {analysis.insights.map((insight, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-sm text-gray-700">{insight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

        {currentView === 'pain-points' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pain Type</label>
                  <select
                    value={filters.painType}
                    onChange={(e) => setFilters({ ...filters, painType: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="">All Types</option>
                    <option value="job_loss">Job Loss</option>
                    <option value="workplace_abuse">Workplace Abuse</option>
                    <option value="financial_stress">Financial Stress</option>
                    <option value="career_stagnation">Career Stagnation</option>
                    <option value="discrimination">Discrimination</option>
                    <option value="burnout">Burnout</option>
                    <option value="scam_victim">Scam Victim</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
                  <select
                    value={filters.severity}
                    onChange={(e) => setFilters({ ...filters, severity: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="">All Severities</option>
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
                  <select
                    value={filters.source}
                    onChange={(e) => setFilters({ ...filters, source: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="">All Sources</option>
                    <option value="reddit">Reddit</option>
                    <option value="glassdoor">Glassdoor</option>
                    <option value="twitter">Twitter</option>
                    <option value="linkedin">LinkedIn</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    placeholder="Search content..."
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
              </div>
            </div>

            {/* Pain Points List */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Pain Points ({filteredPainPoints.length})
                </h3>
              </div>
              <div className="divide-y divide-gray-200">
                {filteredPainPoints.map((point) => (
                  <div key={point.id} className="px-6 py-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getPainTypeIcon(point.painType)}
                          <span className="text-sm font-medium text-gray-900">
                            {point.painType.replace('_', ' ').toUpperCase()}
                          </span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(point.severity)}`}>
                            {point.severity.toUpperCase()}
                          </span>
                          {point.verified && (
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                              VERIFIED
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{point.content}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>{point.source}</span>
                          <span>{new Date(point.timestamp).toLocaleDateString()}</span>
                          <span>Confidence: {Math.round(point.confidence * 100)}%</span>
                          <div className="flex gap-1">
                            {point.keywords.slice(0, 3).map((keyword, index) => (
                              <span key={index} className="px-1 py-0.5 bg-gray-100 rounded text-xs">
                                {keyword}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <a
                          href={point.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 text-gray-400 hover:text-gray-600"
                        >
                          <Eye className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentView === 'analysis' && analysis && (
          <div className="space-y-6">
            {/* Pain Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Pain Type Distribution</h3>
                <div className="space-y-3">
                  {Object.entries(analysis.painDistribution).map(([type, count]) => (
                    <div key={type} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getPainTypeIcon(type)}
                        <span className="text-sm font-medium text-gray-700">
                          {type.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${(count / analysis.totalPosts) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Severity Breakdown</h3>
                <div className="space-y-3">
                  {Object.entries(analysis.severityBreakdown).map(([severity, count]) => (
                    <div key={severity} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        {severity.toUpperCase()}
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${getSeverityColor(severity).split(' ')[0]}`}
                            style={{ width: `${(count / analysis.totalPosts) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Trending Topics */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Trending Topics</h3>
              <div className="flex flex-wrap gap-2">
                {analysis.trendingTopics.map((topic, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>

            {/* Top Sources */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Top Sources</h3>
              <div className="space-y-2">
                {analysis.topSources.map((source, index) => (
                  <div key={source} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{source}</span>
                    <span className="text-sm text-gray-500">#{index + 1}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentView === 'alerts' && (
          <div className="space-y-6">
            {/* Critical Alerts */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Critical Alerts</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {criticalAlerts.map((alert) => (
                  <div key={alert.id} className="px-6 py-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getPainTypeIcon(alert.painType)}
                          <span className="text-sm font-medium text-gray-900">
                            {alert.painType.replace('_', ' ').toUpperCase()}
                          </span>
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                            CRITICAL
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{alert.content}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>{alert.source}</span>
                          <span>{new Date(alert.timestamp).toLocaleDateString()}</span>
                          <span>Confidence: {Math.round(alert.confidence * 100)}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* High Severity Alerts */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">High Severity Alerts</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {highAlerts.map((alert) => (
                  <div key={alert.id} className="px-6 py-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getPainTypeIcon(alert.painType)}
                          <span className="text-sm font-medium text-gray-900">
                            {alert.painType.replace('_', ' ').toUpperCase()}
                          </span>
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800">
                            HIGH
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{alert.content}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>{alert.source}</span>
                          <span>{new Date(alert.timestamp).toLocaleDateString()}</span>
                          <span>Confidence: {Math.round(alert.confidence * 100)}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 
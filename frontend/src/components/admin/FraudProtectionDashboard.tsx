'use client'

import { useState, useEffect } from 'react'
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Eye,
  EyeOff,
  Flag,
  Users,
  Briefcase,
  TrendingUp,
  BarChart3,
  Settings,
  RefreshCw,
  Filter,
  Search
} from 'lucide-react'

interface FraudStats {
  blockedJobs: number
  blockedCompanies: number
  pendingReports: number
  suspiciousJobs: number
  totalJobs: number
  totalCompanies: number
  fraudDetectionRate: number
}

interface FraudReport {
  id: string
  type: string
  targetId: string
  reason: string
  evidence?: string
  status: string
  adminNotes?: string
  createdAt: string
  reporter: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
}

interface BlockedEntity {
  id: string
  title?: string
  name?: string
  fraudScore: number
  fraudFlags: string[]
  blockedAt: string
  company?: {
    id: string
    name: string
  }
}

export default function FraudProtectionDashboard() {
  const [stats, setStats] = useState<FraudStats | null>(null)
  const [reports, setReports] = useState<FraudReport[]>([])
  const [blockedJobs, setBlockedJobs] = useState<BlockedEntity[]>([])
  const [blockedCompanies, setBlockedCompanies] = useState<BlockedEntity[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    fetchFraudData()
  }, [])

  const fetchFraudData = async () => {
    try {
      // Mock data - in real implementation, this would come from the backend
      const mockStats: FraudStats = {
        blockedJobs: 47,
        blockedCompanies: 12,
        pendingReports: 23,
        suspiciousJobs: 156,
        totalJobs: 2847,
        totalCompanies: 892,
        fraudDetectionRate: 94.2
      }
      setStats(mockStats)

      const mockReports: FraudReport[] = [
        {
          id: '1',
          type: 'JOB',
          targetId: 'job-123',
          reason: 'Suspicious salary range and vague job description',
          evidence: 'Job promises $200k salary for entry-level position',
          status: 'PENDING',
          createdAt: '2024-08-03T10:30:00Z',
          reporter: {
            id: 'user-1',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com'
          }
        },
        {
          id: '2',
          type: 'COMPANY',
          targetId: 'company-456',
          reason: 'Fake company information and suspicious contact details',
          evidence: 'Company website is non-functional and uses personal email',
          status: 'APPROVED',
          adminNotes: 'Confirmed fake company, blocked immediately',
          createdAt: '2024-08-03T09:15:00Z',
          reporter: {
            id: 'user-2',
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'jane@example.com'
          }
        }
      ]
      setReports(mockReports)

      const mockBlockedJobs: BlockedEntity[] = [
        {
          id: 'job-1',
          title: 'Work From Home - Earn $5000/day',
          fraudScore: 85,
          fraudFlags: ['Suspicious job title', 'Unrealistic salary', 'No experience required'],
          blockedAt: '2024-08-03T08:00:00Z',
          company: {
            id: 'company-1',
            name: 'Global Online Enterprises'
          }
        },
        {
          id: 'job-2',
          title: 'Quick Cash - No Experience Needed',
          fraudScore: 92,
          fraudFlags: ['Suspicious job title', 'Suspicious requirements', 'Missing company info'],
          blockedAt: '2024-08-03T07:30:00Z'
        }
      ]
      setBlockedJobs(mockBlockedJobs)

      const mockBlockedCompanies: BlockedEntity[] = [
        {
          id: 'company-1',
          name: 'Global Online Enterprises',
          fraudScore: 78,
          fraudFlags: ['Suspicious company name', 'Personal email domain', 'No website'],
          blockedAt: '2024-08-03T06:00:00Z'
        }
      ]
      setBlockedCompanies(mockBlockedCompanies)

    } catch (error) {
      console.error('Error fetching fraud data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading fraud protection dashboard...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fraud Protection Dashboard</h1>
          <p className="text-gray-600">AI-powered scam detection and prevention system</p>
        </div>
        <div className="flex items-center space-x-2">
          <Shield className="h-6 w-6 text-green-600" />
          <span className="text-sm font-medium text-green-600">System Active</span>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <XCircle className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Blocked Jobs</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.blockedJobs || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Blocked Companies</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.blockedCompanies || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Flag className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Reports</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.pendingReports || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Detection Rate</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.fraudDetectionRate || 0}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'reports', label: 'Fraud Reports', icon: Flag },
              { id: 'blocked', label: 'Blocked Entities', icon: XCircle },
              { id: 'patterns', label: 'Detection Patterns', icon: Search }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Fraud Detection Metrics</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Jobs Scanned</span>
                      <span className="font-semibold">{stats?.totalJobs?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Suspicious Jobs Detected</span>
                      <span className="font-semibold text-yellow-600">{stats?.suspiciousJobs}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Jobs Blocked</span>
                      <span className="font-semibold text-red-600">{stats?.blockedJobs}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Detection Accuracy</span>
                      <span className="font-semibold text-green-600">{stats?.fraudDetectionRate}%</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
                      <XCircle className="h-5 w-5 text-red-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Job blocked</p>
                        <p className="text-xs text-gray-600">"Work From Home - Earn $5000/day" flagged as suspicious</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                      <Flag className="h-5 w-5 text-yellow-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Fraud report submitted</p>
                        <p className="text-xs text-gray-600">User reported suspicious company activity</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Company verified</p>
                        <p className="text-xs text-gray-600">TechCorp Inc. passed verification checks</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Reports Tab */}
          {activeTab === 'reports' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Fraud Reports</h3>
                <div className="flex space-x-2">
                  <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                    <option>All Status</option>
                    <option>Pending</option>
                    <option>Approved</option>
                    <option>Rejected</option>
                  </select>
                  <button className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm">
                    <RefreshCw className="h-4 w-4" />
                    <span>Refresh</span>
                  </button>
                </div>
              </div>
              <div className="space-y-3">
                {reports.map((report) => (
                  <div key={report.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <span className={`px-2 py-1 text-xs rounded ${
                          report.type === 'JOB' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                        }`}>
                          {report.type}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded ${
                          report.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                          report.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {report.status}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(report.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h4 className="font-medium text-gray-900 mb-2">{report.reason}</h4>
                    {report.evidence && (
                      <p className="text-sm text-gray-600 mb-3">{report.evidence}</p>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        Reported by {report.reporter.firstName} {report.reporter.lastName}
                      </div>
                      <div className="flex space-x-2">
                        <button className="px-3 py-1 bg-green-600 text-white rounded text-sm">Approve</button>
                        <button className="px-3 py-1 bg-red-600 text-white rounded text-sm">Reject</button>
                        <button className="px-3 py-1 bg-gray-600 text-white rounded text-sm">Review</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Blocked Entities Tab */}
          {activeTab === 'blocked' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Blocked Jobs</h3>
                <div className="space-y-3">
                  {blockedJobs.map((job) => (
                    <div key={job.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-900">{job.title}</h4>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-red-600 font-medium">
                            Score: {job.fraudScore}
                          </span>
                          <button className="px-2 py-1 bg-blue-600 text-white rounded text-xs">Unblock</button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {job.fraudFlags.map((flag, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <AlertTriangle className="h-3 w-3 text-red-600" />
                            <span className="text-sm text-gray-600">{flag}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 text-xs text-gray-500">
                        Blocked on {new Date(job.blockedAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Blocked Companies</h3>
                <div className="space-y-3">
                  {blockedCompanies.map((company) => (
                    <div key={company.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-900">{company.name}</h4>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-red-600 font-medium">
                            Score: {company.fraudScore}
                          </span>
                          <button className="px-2 py-1 bg-blue-600 text-white rounded text-xs">Unblock</button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {company.fraudFlags.map((flag, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <AlertTriangle className="h-3 w-3 text-red-600" />
                            <span className="text-sm text-gray-600">{flag}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 text-xs text-gray-500">
                        Blocked on {new Date(company.blockedAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Detection Patterns Tab */}
          {activeTab === 'patterns' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Fraud Patterns</h3>
                  <div className="space-y-3">
                    {[
                      'Suspicious job titles (e.g., "Work From Home", "Quick Cash")',
                      'Unrealistic salary promises',
                      'No experience requirements',
                      'Vague job descriptions',
                      'Missing company information',
                      'Personal email addresses',
                      'Pressure for immediate decisions',
                      'Requests for upfront payments'
                    ].map((pattern, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                        <span className="text-sm text-gray-700">{pattern}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Fraud Patterns</h3>
                  <div className="space-y-3">
                    {[
                      'Generic company names (e.g., "Global", "International")',
                      'Personal email domains',
                      'Fake phone numbers',
                      'Missing website or social media',
                      'No physical address',
                      'Suspicious contact information',
                      'Recently registered domains',
                      'No company history or reviews'
                    ].map((pattern, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                        <span className="text-sm text-gray-700">{pattern}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">AI Detection System</h4>
                <p className="text-sm text-blue-800">
                  Our AI system continuously learns from new fraud patterns and adapts its detection algorithms. 
                  It analyzes job postings and company information in real-time, flagging suspicious content 
                  before it reaches job seekers.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 